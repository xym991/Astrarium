import * as THREE from "three";
import type { CameraMode } from "../../state";
import AppState from "../../state";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "../Input/inputController";
import { OverviewController } from "./overview";
import { OrbitController } from "./orbit";
import { FlightController } from "./flight";
import type InputController from "../Input/inputController";

export interface MovementController {
  enter(camera?: THREE.PerspectiveCamera): MovementController;

  update(
    delta: number,
    camera: THREE.PerspectiveCamera,
    input: InputState,
  ): void;

  exit(): void;
}

const initFunctions: Record<
  CameraMode,
  {
    init: (camera: THREE.PerspectiveCamera) => MovementController;
    pointerCaptured: boolean;
  }
> = {
  overview: {
    init: (camera: THREE.PerspectiveCamera) =>
      new OverviewController().enter(camera),
    pointerCaptured: false,
  },
  orbit: {
    init: (camera: THREE.PerspectiveCamera) =>
      new OrbitController().enter(camera),
    pointerCaptured: true,
  },
  flight: {
    init: (camera: THREE.PerspectiveCamera) =>
      new FlightController().enter(camera),
    pointerCaptured: true,
  },
};
export default class CameraController {
  private static instance: CameraController;
  public readonly camera: THREE.PerspectiveCamera;

  public mode: CameraMode = "overview";
  public defaultTarget: CelestialBody;

  private inputController: InputController;
  private movementController: MovementController;

  private constructor(
    InputController: InputController,
    defaultTarget: CelestialBody,
  ) {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.001,
      1000000,
    );
    this.inputController = InputController;
    this.movementController = new OverviewController();
    this.defaultTarget = defaultTarget;
    this.camera.position.set(0, 500, 1000);

    // this.listenForPointerRelease();
  }

  public static getInstance(
    InputController: InputController,
    defaultTarget: CelestialBody,
  ): CameraController {
    if (!CameraController.instance) {
      CameraController.instance = new CameraController(
        InputController,
        defaultTarget,
      );
    }

    return CameraController.instance;
  }

  public update(delta: number) {
    this.movementController.update(
      delta,
      this.camera,
      this.inputController.getInputState(),
    );
    this.inputController.endFrame();
    this.camera.updateProjectionMatrix();
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  public setMode(mode: CameraMode) {
    if (mode === this.mode) return;
    else this.mode = mode;
    this.movementController.exit();
    if (!AppState.get("focusedBody"))
      AppState.set("focusedBody", this.defaultTarget);
    const { init, pointerCaptured } = initFunctions[mode];
    this.movementController = init(this.camera);
    if (pointerCaptured) {
      this.inputController.capturePointer();
    } else {
      this.inputController.releasePointer();
    }
  }
}
