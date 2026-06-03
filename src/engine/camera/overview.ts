import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CameraController } from "./index";
class OverviewController extends CameraController {
  private controls: OrbitControls;

  constructor(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    super(camera, canvas);
    this.controls = new OrbitControls(camera, canvas);
  }

  update() {
    this.controls.update();
  }

  dispose() {
    this.controls.dispose();
  }
}

export default OverviewController;
