import * as THREE from "three";
import OverviewController from "./overview";

export abstract class CameraController {
  constructor(
    protected camera: THREE.PerspectiveCamera,
    protected canvas: HTMLCanvasElement,
  ) {}

  abstract update(delta: number): void;

  abstract dispose(): void;
}

class CameraManager {
  private static instance: CameraManager;
  camera: THREE.PerspectiveCamera;
  //   controller: CameraController;

  static getInstance(): CameraManager {
    if (!CameraManager.instance) {
      CameraManager.instance = new CameraManager();
    }
    return CameraManager.instance;
  }

  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100000000,
    );
    // this.controller = new OverviewController(this.camera, canvas);
  }
}

export default CameraManager.getInstance();
