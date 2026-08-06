import * as THREE from "three";
import type { CameraMode } from "../../state";
import AppState from "../../state";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "../Input/inputController";
import { OverviewController } from "./overview";
import { OrbitController } from "./orbit";
import { FlightController } from "./flight";
import InputController from "../Input/inputController";
import type Clock from "../clock";
import type MovementController from "./movementController";
import { DISTANCE_SCALE } from "../../data/constants";

export default class CameraController {
  private static instance: CameraController;
  public readonly camera: THREE.PerspectiveCamera;

  public mode: CameraMode = "overview";
  public defaultTarget: CelestialBody;
  private movementController: MovementController;
  private inputController: InputController;

  private constructor(
    defaultTarget: CelestialBody,
    InputController: InputController,
  ) {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.001,
      2_000_000,
    );
    this.movementController = new OverviewController(
      this.camera,
      InputController,
      defaultTarget,
    );
    this.inputController = InputController;
    this.defaultTarget = defaultTarget;
    this.camera.position.set(0, 500, 1000);
  }

  public static getInstance(
    defaultTarget: CelestialBody,
    inputController: InputController,
  ): CameraController {
    if (!CameraController.instance) {
      CameraController.instance = new CameraController(
        defaultTarget,
        inputController,
      );
    }

    return CameraController.instance;
  }

  public update(clock: Clock) {
    this.movementController.update(this.camera, clock, this.inputController);
    this.inputController.endFrame();
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld(false);
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  public setMode(mode: CameraMode) {
    if (mode === this.mode) return;
    else this.mode = mode;
    this.movementController.exit(this.inputController);
    const body = AppState.get("focusedBody") || this.defaultTarget;
    switch (mode) {
      case "orbit":
        this.movementController = new OrbitController(
          this.camera,
          this.inputController,
          body,
        );
        break;
      case "overview":
        this.movementController = new OverviewController(
          this.camera,
          this.inputController,
          body,
        );
        break;
      case "flight":
        this.movementController = new FlightController(
          this.camera,
          this.inputController,
          body,
        );
        break;
    }
  }
}
