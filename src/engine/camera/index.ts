// global camera controlling body
// handles camera instance, input mapping , camera lookaround and movement logic
import * as THREE from "three";
import type { cameraMode } from "../../data";
import { InputController } from "./inputController";
import AppState from "../../state";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "./inputController";
import { OverviewController } from "./overview";
import { OrbitController } from "./orbit";
import { FlightController } from "./flight";

// export abstract class movementController {
//   abstract update(
//     delta: number,
//     camera: THREE.PerspectiveCamera,
//     state: typeof AppState,
//     input:
//   ): void;
//   abstract destroy(): void;
// }
// export type ControllerContext = {
//   input: InputState;
//   focusedBody?: CelestialBody;
// };
export default class CameraController {
  private static instance: CameraController;
  public readonly camera: THREE.PerspectiveCamera;
  inputController: InputController;
  movementController: any;
  private constructor(canvas: HTMLCanvasElement) {
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.01,
      1000000,
    );
    this.inputController = new InputController(canvas);
    // this.movementController = new OverviewController();
    // this.movementController = new OrbitController();
    this.movementController = new FlightController();
  }
  public static getInstance(canvas: HTMLCanvasElement): CameraController {
    if (!CameraController.instance) {
      CameraController.instance = new CameraController(canvas);
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

  // public getCamera(): THREE.PerspectiveCamera {
  //   // return this.camera;
  // }
  public setMode(mode: cameraMode) {}
}
