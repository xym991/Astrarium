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
import ClockController from "./clock";
import Telemetry from "../state/telemetry.svelte";
import InputController from "./Input/inputController";

const maxSolarDriftDistance = 50000;
const SUN_GALACTIC_SPEED = 19_008_000; // km/day

let FOCAL_LENGTH = 0;

export default class Engine {
  public static instance: Engine;

  declare private canvas: HTMLCanvasElement;
  declare private scene: THREE.Scene;
  declare private renderer: THREE.WebGLRenderer;
  declare private composer: EffectComposer;
  declare public readonly SolarSystem: CelestialBody;

  declare public cameraController: CameraController;
  declare public labelController: LabelController;
  declare public inputController: InputController;
  declare public clock: ClockController;

  declare private updateBackground: () => void;

  private data = solarSystemData;
  private CelestianBodyArray: CelestialBody[] = [];

  public static getInstance(
    canvas: HTMLCanvasElement,
    labels: HTMLDivElement,
  ): Engine {
    if (!Engine.instance) {
      Engine.instance = new Engine(
        canvas as HTMLCanvasElement,
        labels as HTMLDivElement,
      );
    }
    return Engine.instance;
  }

  private animate = () => {
    this.clock.update();

    this.updateScene();

    this.composer.render();

    Telemetry.update({
      currentTime: this.clock.getTime(),
      distanceFromSun: this.cameraController.camera.position.distanceTo(
        this.SolarSystem.group.position,
      ),
      focusedBody: AppState.get("focusedBody"),
      timeScale: AppState.get("timeScale"),
      cameraMode: AppState.get("cameraMode"),
      mouseState: this.inputController.getMouse(),
      movementState: this.inputController.getMovement(),
    });

    if (AppState.isDirty("cameraMode"))
      this.cameraController.setMode(AppState.get("cameraMode"));
    requestAnimationFrame(this.animate);
  };

  constructor(canvas: HTMLCanvasElement, labels: HTMLDivElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.clock = ClockController.getInstance();
    this.initRenderer();

    this.buildSolarSystem();
    this.appendTrails();

    this.inputController = InputController.getInstance(canvas);

    this.cameraController = CameraController.getInstance(
      this.inputController,
      this.SolarSystem,
    );
    FOCAL_LENGTH =
      window.innerHeight /
      (2 *
        Math.tan(
          THREE.MathUtils.degToRad(this.cameraController.camera.fov) / 2,
        ));
    this.labelController = LabelController.getInstance(
      labels,
      this.SolarSystem,
    );

    this.initComposer();
    this.initLight();
    this.handleStateActions();
    this.initEventListeners();
    this.initCanvasClickListeners();
    this.updateBackground = this.initBackground();

    AppState.set("focusedBody", this.SolarSystem);

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

    this.cameraController.update(this.clock.getDelta());

    this.updateCelestialBodyLOD();

    this.updateTrails();

    this.runPostUpdateMethods();

    this.labelController.update(this.cameraController.camera);
    this.updateBackground();
  }

  runPostUpdateMethods() {
    const camera = this.cameraController.camera;
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
      this.clock.getDeltaDays() *
      AppState.get("distanceScale");
  }

  ensureMinimumSunScale() {
    const camera = this.cameraController.camera;
    const SolarSystem = this.SolarSystem;
    const distanceScale = AppState.get("distanceScale");

    const distance = camera.position.distanceTo(SolarSystem.group.position);

    const projectedRadius =
      ((SolarSystem.radius * distanceScale) / distance) * FOCAL_LENGTH;

    const scale = Math.max(1, 2 / projectedRadius);
    SolarSystem.mesh.scale.setScalar(scale);
  }

  updateCelestialBodyMotion() {
    const time = this.clock.getDays();

    for (let i = 1; i < this.CelestianBodyArray.length; i++) {
      this.CelestianBodyArray[i].updatePosition(time);
    }
  }

  updateCelestialBodyLOD() {
    const distanceScale = AppState.get("distanceScale");
    const camera = this.cameraController.camera;
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
    const renderPass = new RenderPass(this.scene, this.cameraController.camera);
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
    }
  }

  resetSolarPosition() {
    this.SolarSystem.group.position.y -= maxSolarDriftDistance;
    this.cameraController.camera.position.y -= maxSolarDriftDistance;
    this.SolarSystem.group.updateMatrixWorld(true);
    this.cameraController.camera.updateMatrixWorld(true);
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
      stars.position.copy(this.cameraController.camera.position);
    };
  }

  private handleStateActions() {
    const input = this.inputController;

    const toggle = <
      K extends
        | "showOrbits"
        | "showTrails"
        | "showLabels"
        | "showMoons"
        | "showIndicators",
    >(
      key: K,
    ) => {
      input.subscribe(key, (_, state) => {
        if (!state.active) return;
        AppState.set(key, !AppState.get(key));
      });
    };

    toggle("showOrbits");
    toggle("showTrails");
    toggle("showLabels");
    toggle("showMoons");
    toggle("showIndicators");

    const focus: Record<string, number> = {
      focusSun: 0,
      focusMercury: 1,
      focusVenus: 2,
      focusEarth: 3,
      focusMars: 4,
      focusJupiter: 5,
      focusSaturn: 6,
      focusUranus: 7,
      focusNeptune: 8,
      focusPluto: 9,
    };

    for (const [action, index] of Object.entries(focus)) {
      input.subscribe(action as any, (_, state) => {
        if (!state.active) return;

        if (index === 0) {
          AppState.set("focusedBody", this.SolarSystem);
          return;
        }

        const body = this.SolarSystem.children[index - 1];
        if (body) {
          AppState.set("focusedBody", body);
        }
      });
    }
  }

  initEventListeners() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        AppState.set("paused", true);
      } else {
        this.clock.update();
        AppState.set("paused", false);
      }
    });

    window.addEventListener("resize", () => {
      this.cameraController.camera.aspect =
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
      this.cameraController.camera.updateProjectionMatrix();
    });
  }

  initCanvasClickListeners() {
    const camera = this.cameraController.camera;
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
