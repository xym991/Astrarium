// import type { ControllerContext } from "./index";
import * as THREE from "three";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "./inputController";
import AppState from "../../state";
import {
  getBodyWorldPosition,
  getDefaultViewingDistance,
  sphericalToCartesian,
} from "./shared";
export class OverviewController {
  private yaw = 0;
  private pitch = THREE.MathUtils.degToRad(20);
  private distance = 10;
  private readonly rotationSensitivity = 0.005;
  private readonly minDistance = 2;
  private readonly maxDistance = 100000;
  private lastFocusedBody?: CelestialBody;

  update(delta: number, camera: THREE.PerspectiveCamera, input: InputState) {
    const focusedBody = AppState.get("focusedBody");

    if (!focusedBody) return;
    if (focusedBody !== this.lastFocusedBody) {
      this.onTargetChanged(focusedBody);
      this.lastFocusedBody = focusedBody;
    }

    const mouse = input.mouse;
    // console.log(mouse);

    // Rotation
    if (mouse.primaryMouse) {
      this.yaw -= mouse.mouseDeltaX * this.rotationSensitivity;
      this.pitch -= mouse.mouseDeltaY * this.rotationSensitivity;
    }

    // Zoom
    if (mouse.scrollDelta !== 0) {
      this.distance *= 1 + mouse.scrollDelta * 0.001;
    }

    this.distance = THREE.MathUtils.clamp(
      this.distance,
      this.minDistance,
      this.maxDistance,
    );

    // Target position
    const target = getBodyWorldPosition(focusedBody);

    // Spherical -> Cartesian
    const [x, y, z] = sphericalToCartesian(this.distance, this.yaw, this.pitch);

    camera.position.set(target.x + x, target.y + y, target.z + z);

    camera.lookAt(target);
  }
  private onTargetChanged(body: CelestialBody) {
    this.distance = getDefaultViewingDistance(body);
  }

  destroy() {}
}
