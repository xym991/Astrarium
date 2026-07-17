import * as THREE from "three";
import { CelestialBodyData, solarSystemData } from "../data";
import { recursiveTransform } from "./utils";
import { CelestialBody } from "./CelestialBody";
import CameraController from "./camera";
import AppState from "../state";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { FXAAPass } from "three/examples/jsm/Addons.js";
import LabelController from "./labels";
import addTextures from "./utils/addTextures";
import Stats from "stats.js";
import ClockController from "./clock";
import Telemetry from "../state/telemetry.svelte";

const maxSolarDriftDistance = 50000;
const SUN_GALACTIC_SPEED = 19_008_000; // km/day

let num = 0;

let FOCAL_LENGTH = 0;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

export class Engine {
  declare private canvas: HTMLCanvasElement;
  declare private scene: THREE.Scene;
  declare private renderer: THREE.WebGLRenderer;
  declare private composer: EffectComposer;
  declare private SolarSystem: CelestialBody;

  declare private CameraController: CameraController;
  declare private LabelController: LabelController;
  declare private Clock: ClockController;

  declare private updateBackground: () => void;

  private data = solarSystemData;
  private CelestianBodyArray: CelestialBody[] = [];

  private animate = () => {
    num++;
    this.Clock.update();
    stats.begin();
    const t0 = performance.now();
    this.updateScene();
    const t1 = performance.now();
    this.composer.render();
    const t2 = performance.now();

    Telemetry.update({
      currentTime: this.Clock.getTime(),
      distanceFromSun: this.CameraController.camera.position.distanceTo(
        this.SolarSystem.group.position,
      ),
    });
    const t3 = performance.now();

    // num % 100 == 0 &&
    //   console.table([
    //     {
    //       name: "updateScene",
    //       time: t1 - t0,
    //     },
    //     {
    //       name: "composer.render",
    //       time: t2 - t1,
    //     },
    //     {
    //       name: "updateBackground",
    //       time: t3 - t2,
    //     },
    //   ]);

    stats.end();
    requestAnimationFrame(this.animate);
  };

  constructor(canvas: HTMLCanvasElement, labels: HTMLDivElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.Clock = ClockController.getInstance();
    this.initRenderer();

    this.buildSolarSystem();
    this.appendTrails();

    this.CameraController = CameraController.getInstance(
      canvas,
      this.SolarSystem,
    );
    FOCAL_LENGTH =
      window.innerHeight /
      (2 *
        Math.tan(
          THREE.MathUtils.degToRad(this.CameraController.camera.fov) / 2,
        ));
    this.LabelController = LabelController.getInstance(
      labels,
      this.SolarSystem,
    );

    this.initComposer();
    this.initLight();
    this.initWindowEventListeners();
    this.initCanvasClickListeners();
    this.updateBackground = this.initBackground();
    this.animate();
  }

  updateScene() {
    const SolarSystem = this.SolarSystem;
    if (SolarSystem.group.position.y > maxSolarDriftDistance)
      this.resetSolarPosition();

    this.handleDistanceScaleChanged();
    this.handleTimeScaleChanged();
    this.updateCelestialBodyMotion();

    this.updateSolarPosition();

    this.ensureMinimumSunScale();

    this.cacheWorldPositions();

    this.CameraController.update(this.Clock.getDelta());

    this.updateCelestialBodyLOD();

    this.updateTrails();

    this.runPostUpdateMethods();

    this.LabelController.update(this.CameraController.camera);
    this.updateBackground();
  }

  runPostUpdateMethods() {
    const camera = this.CameraController.camera;
    const showMoons = AppState.get("showMoons");
    const showTrails = AppState.get("showTrails");
    const showOrbits = AppState.get("showOrbits");

    for (const body of this.CelestianBodyArray) {
      body.postUpdate(camera, {
        showMoons,
        showTrails,
        showOrbits,
      });
    }
  }

  updateTrails() {
    this.SolarSystem.trail.line.material.setCamera(
      this.CameraController.camera,
    );
    for (let body of this.CelestianBodyArray) {
      body.updateTrail();
    }
  }

  cacheWorldPositions() {
    this.scene.updateMatrixWorld(false);
    for (const body of this.CelestianBodyArray) {
      body.worldPosition.setFromMatrixPosition(body.group.matrixWorld);
    }
  }

  updateSolarPosition() {
    const SolarSystem = this.SolarSystem;

    SolarSystem.group.position.y +=
      SUN_GALACTIC_SPEED *
      this.Clock.getDeltaDays() *
      AppState.get("distanceScale");
  }

  ensureMinimumSunScale() {
    const camera = this.CameraController.camera;
    const SolarSystem = this.SolarSystem;
    const distanceScale = AppState.get("distanceScale");

    const distance = camera.position.distanceTo(SolarSystem.group.position);

    const projectedRadius =
      ((SolarSystem.radius * distanceScale) / distance) * FOCAL_LENGTH;

    const scale = Math.max(1, 2 / projectedRadius);
    SolarSystem.mesh.scale.setScalar(scale);
  }

  updateCelestialBodyMotion() {
    const time = this.Clock.getDays();

    for (let i = 1; i < this.CelestianBodyArray.length; i++) {
      this.CelestianBodyArray[i].updatePosition(time);
    }
  }

  updateCelestialBodyLOD() {
    const distanceScale = AppState.get("distanceScale");
    const camera = this.CameraController.camera;
    for (let body of this.CelestianBodyArray) {
      body.updateLOD(camera, distanceScale, FOCAL_LENGTH);
    }
  }

  handleDistanceScaleChanged() {
    if (!AppState.isDirty("distanceScale")) return;
    const distanceScale = AppState.get("distanceScale");
    for (let body of this.CelestianBodyArray) {
      body.setBodyScale(distanceScale);
      body.setOrbitScale(distanceScale);
      body.resetTrail();
    }
  }

  handleTimeScaleChanged() {
    if (!AppState.isDirty("timeScale")) return;
    for (let body of this.CelestianBodyArray) {
      body.resetTrail();
    }
  }

  appendTrails() {
    for (const body of this.CelestianBodyArray) {
      if (body.trail?.line) {
        this.scene.add(body.trail.line);
      }
    }
  }

  initLight() {
    const light = new THREE.PointLight("#FFFFFF", 5, 0);
    light.decay = 0.05;
    light.castShadow = true;
    light.position.set(0, 0, 0);
    this.SolarSystem.group.add(light);
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
    this.scene.add(ambientLight);
  }

  initRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    this.renderer = renderer;
  }

  initComposer() {
    const composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.CameraController.camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        window.innerWidth,

        window.innerHeight,
      ),
      0.25, // strength
      1.2, // radius
      10, // threshold
    );

    composer.addPass(bloomPass);
    composer.addPass(new FXAAPass());

    this.composer = composer;
  }

  buildSolarSystem(
    data: CelestialBodyData = this.data,
    parent: CelestialBody | null = null,
  ) {
    const body = new CelestialBody(data, parent);
    this.CelestianBodyArray.push(body);
    addTextures(body, this.renderer);
    for (const childData of data.children) {
      this.buildSolarSystem(childData, body);
    }
    if (body.name === "Sun") {
      body.group.position.set(0, 0, 0);
      this.scene.add(body.group);
      this.SolarSystem = body;

      setTimeout(() => {
        AppState.set("focusedBody", this.SolarSystem);
      }, 0);
    }
  }

  resetSolarPosition() {
    this.SolarSystem.group.position.y -= maxSolarDriftDistance;
    this.CameraController.camera.position.y -= maxSolarDriftDistance;
    this.SolarSystem.group.updateMatrixWorld(true);
    this.CameraController.camera.updateMatrixWorld(true);
    recursiveTransform(this.SolarSystem, (body) => {
      if (!body.trail) return;
      const points = body.trail.pointsHigh;

      for (let i = 0; i < points.length; i += 3) {
        points[i + 1] -= maxSolarDriftDistance;
      }
    });
  }

  initBackground() {
    this.scene.background = new THREE.Color(0x000000);

    function createStars(count: number) {
      const positions: number[] = [];
      const colors: number[] = [];

      const palette = [
        [0.7, 0.8, 1.0], // blue-white
        [1.0, 1.0, 1.0], // white
        [1.0, 0.95, 0.8], // yellow-white
        [1.0, 0.8, 0.6], // orange
      ];

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        const radius = 10000000;

        positions.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta),
        );

        const brightness = Math.pow(Math.random(), 4);
        const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
        colors.push(r * brightness, g * brightness, b * brightness);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );

      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3),
      );

      return geometry;
    }

    const material1 = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: false,
      vertexColors: true,
    });

    const stars = new THREE.Points(createStars(20000), material1);

    this.scene.add(stars);

    return () => {
      stars.position.copy(this.CameraController.camera.position);
    };
  }

  initWindowEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (Number(e.key) > 0 && Number(e.key) <= 9) {
        const index = parseInt(e.key);
        this.SolarSystem.children.forEach((child, i) => {
          if (i + 1 === index) {
            AppState.set("focusedBody", child);
          }
        });
      }
      if (e.key === "0") {
        AppState.set("focusedBody", this.SolarSystem);
      }
      if (e.code === "KeyR") {
        this.CameraController.setMode("overview");
      }
      if (e.code === "KeyT") {
        this.CameraController.setMode("orbit");
      }
      if (e.code === "KeyY") {
        this.CameraController.setMode("flight");
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        AppState.set("paused", true);
      } else {
        this.Clock.update();
        AppState.set("paused", false);
      }
    });

    window.addEventListener("resize", () => {
      this.CameraController.camera.aspect =
        window.innerWidth / window.innerHeight;
      this.composer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      recursiveTransform(this.SolarSystem, (body) => {
        if (body.orbit?.material instanceof LineMaterial) {
          body.orbit.material.resolution.set(
            window.innerWidth,
            window.innerHeight,
          );
        }
      });
      this.CameraController.camera.updateProjectionMatrix();
    });
  }

  initCanvasClickListeners() {
    const camera = this.CameraController.camera;
    const meshes = this.CelestianBodyArray.map((body) => body.mesh);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.canvas.addEventListener("click", (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length === 0) return;
      const body = hits[0].object.userData as CelestialBody;
      AppState.set("focusedBody", body);
    });
  }
}
