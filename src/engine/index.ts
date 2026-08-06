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
import ThreePerfManager from "./utils/threePerf";

import {
  MAX_SOLAR_DRIFT_DISTANCE,
  SIMULATION_RADIUS,
  SOLAR_GALACTIC_SPEED,
  DISTANCE_SCALE,
} from "../data/constants";
import { createStarfield } from "./utils/starfield";

export default class Engine {
  public static instance: Engine;

  declare private canvas: HTMLCanvasElement;
  declare private scene: THREE.Scene;
  declare private renderer: THREE.WebGLRenderer;
  declare private composer: EffectComposer;
  declare public SolarSystem: CelestialBody;
  public CelestialBodyArray: CelestialBody[] = [];
  declare public cameraController: CameraController;
  declare public labelController: LabelController;
  declare public inputController: InputController;
  declare public clock: ClockController;
  declare private perfManager: ThreePerfManager | null;

  declare private background: THREE.Points;
  declare private updateBackground: () => void;

  private data = solarSystemData;
  declare private constants: {
    focalLength: number;
  };

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

    this.perfManager?.begin();

    this.updateScene();

    this.composer.render();

    this.perfManager?.end();

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
      this.SolarSystem,
      this.inputController,
    );

    this.labelController = LabelController.getInstance(
      labels,
      this.SolarSystem,
    );

    this.initComposer();
    this.initLight();
    this.handleStateActions();
    this.initEventListeners();
    this.initCanvasClickListeners();
    this.initBackground();

    this.perfManager = new ThreePerfManager(this.renderer, document.body);

    AppState.set("focusedBody", this.SolarSystem);

    this.constants = {
      focalLength:
        window.innerHeight /
        (2 *
          Math.tan(
            THREE.MathUtils.degToRad(this.cameraController.camera.fov) / 2,
          )),
    };

    this.animate();
  }

  updateScene() {
    const SolarSystem = this.SolarSystem;
    if (SolarSystem.group.position.y > MAX_SOLAR_DRIFT_DISTANCE)
      this.resetSolarPosition();

    this.handleDistanceScaleChanged();

    this.handleTimeScaleChanged();

    this.updateCelestialBodyMotion();

    this.updateSolarPosition();

    this.updateCachePre();

    this.cameraController.update(this.clock);

    this.updateCachePost();

    this.ensureMinimumSunScale();

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

    for (const body of this.CelestialBodyArray) {
      body.postUpdate(camera, {
        showMoons,
        showTrails,
        showOrbits,
      });
    }
  }

  updateTrails() {
    for (let body of this.CelestialBodyArray) {
      body.updateTrail();
    }
  }

  updateCachePre() {
    this.scene.updateMatrixWorld(false);
    for (const body of this.CelestialBodyArray) {
      body.updateCachePre();
    }
  }

  updateCachePost() {
    // this.scene.updateMatrixWorld(false);
    for (const body of this.CelestialBodyArray) {
      body.updateCachePost({
        camera: this.cameraController.camera,
        focalLength: this.constants.focalLength,
      });
    }
  }

  updateSolarPosition() {
    const SolarSystem = this.SolarSystem;

    SolarSystem.group.position.y +=
      SOLAR_GALACTIC_SPEED *
      this.clock.getDeltaDays(AppState.get("timeScale")) *
      DISTANCE_SCALE;
  }

  ensureMinimumSunScale() {
    const SolarSystem = this.SolarSystem;
    const scale = Math.max(1, 2 / SolarSystem.cached.projectedRadius);
    SolarSystem.mesh.scale.setScalar(scale);
  }

  updateCelestialBodyMotion() {
    const time = this.clock.getDays();

    for (let i = 1; i < this.CelestialBodyArray.length; i++) {
      this.CelestialBodyArray[i].updatePosition(time);
    }
  }

  handleDistanceScaleChanged() {
    if (!AppState.isDirty("distanceScale")) return;
    const distanceScale = DISTANCE_SCALE;
    for (let body of this.CelestialBodyArray) {
      body.setBodyScale(distanceScale);
      body.setOrbitScale(distanceScale);
      body.resetTrail();
    }
  }

  handleTimeScaleChanged() {
    if (!AppState.isDirty("timeScale")) return;
    for (let body of this.CelestialBodyArray) {
      body.resetTrail();
    }
  }

  appendTrails() {
    for (const body of this.CelestialBodyArray) {
      if (body.trail?.line) {
        this.scene.add(body.trail.line);
      }
    }
  }

  initLight() {
    const radius = SIMULATION_RADIUS * DISTANCE_SCALE;
    const light = new THREE.PointLight("#FFFFFF", 20, radius);
    light.decay = 0.2;
    light.position.set(0, 0, 0);
    this.SolarSystem.group.add(light);
    const light2 = new THREE.PointLight("#FFFFFF", 0.2, radius);
    this.SolarSystem.group.add(light2);
    light2.position.set(0, 0, 0);
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

    renderer.info.autoReset = false;

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
      1, // radius
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
    this.CelestialBodyArray.push(body);
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
    this.SolarSystem.group.position.y -= MAX_SOLAR_DRIFT_DISTANCE;
    this.cameraController.camera.position.y -= MAX_SOLAR_DRIFT_DISTANCE;
    this.SolarSystem.group.updateMatrixWorld(true);
    this.cameraController.camera.updateMatrixWorld(true);
    recursiveTransform(this.SolarSystem, (body) => {
      if (!body.trail) return;
      const points = body.trail.pointsHigh;

      for (let i = 0; i < points.length; i += 3) {
        points[i + 1] -= MAX_SOLAR_DRIFT_DISTANCE;
      }
    });
  }

  initBackground() {
    this.scene.remove(this.background);
    const { points, update } = createStarfield(
      this.renderer,
      this.cameraController.camera,
    );
    this.scene.add(points);

    this.background = points;
    this.updateBackground = () => update(this.cameraController.camera);
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

      this.initBackground();
      this.cameraController.camera.updateProjectionMatrix();
    });
  }

  initCanvasClickListeners() {
    const camera = this.cameraController.camera;
    const meshes = this.CelestialBodyArray.map((body) => body.mesh);

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
