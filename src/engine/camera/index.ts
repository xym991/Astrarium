import * as THREE from "three";
import type { cameraMode } from "../../data";
import { InputController } from "./inputController";
import AppState from "../../state";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "./inputController";
import { OverviewController } from "./overview";
import { OrbitController } from "./orbit";
import { FlightController } from "./flight";

export interface MovementController {
  enter(camera?: THREE.PerspectiveCamera): MovementController;

  update(
    delta: number,
    camera: THREE.PerspectiveCamera,
    input: InputState,
  ): void;

  exit(): void;
}
export default class CameraController {
  private static instance: CameraController;
  public readonly camera: THREE.PerspectiveCamera;

  public mode = "overview";
  public defaultTarget: CelestialBody;

  private inputController: InputController;
  private movementController: MovementController;

  private constructor(canvas: HTMLCanvasElement, defaultTarget: CelestialBody) {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10000000,
    );
    this.inputController = new InputController(canvas);
    this.movementController = new OverviewController();
    this.defaultTarget = defaultTarget;
    this.camera.position.set(0, 500, 1000);
  }
  public static getInstance(
    canvas: HTMLCanvasElement,
    defaultTarget: CelestialBody,
  ): CameraController {
    if (!CameraController.instance) {
      CameraController.instance = new CameraController(canvas, defaultTarget);
    }

    return CameraController.instance;
  }

  public update(delta: number) {
    this.movementController.update(
      delta,
      this.camera,
      this.inputController.getState(),
    );
    this.inputController.endFrame();
    this.camera.updateProjectionMatrix();
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  public setMode(mode: cameraMode) {
    if (mode === this.mode) return;
    else this.mode = mode;
    this.movementController.exit();
    if (!AppState.get("focusedBody"))
      AppState.set("focusedBody", this.defaultTarget);
    switch (this.mode) {
      case "overview":
        this.movementController = new OverviewController().enter(this.camera);
        break;
      case "orbit":
        this.movementController = new OrbitController().enter(this.camera);
        break;
      case "flight":
        this.movementController = new FlightController().enter(this.camera);
        AppState.set("focusedBody", null);
        break;
    }
  }
}
