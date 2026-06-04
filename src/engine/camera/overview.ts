// import type { ControllerContext } from "./index";
import * as THREE from "three";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "./inputController";
import AppState from "../../state";
export class OverviewController {
  private yaw = 0;
  private pitch = THREE.MathUtils.degToRad(20);
  private distance = 10;
  private readonly rotationSensitivity = 0.005;
  private readonly zoomSensitivity = 1;
  private readonly minDistance = 10;
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
    const target = new THREE.Vector3();
    focusedBody.mesh.getWorldPosition(target);

    // Spherical -> Cartesian
    const x = this.distance * Math.cos(this.pitch) * Math.sin(this.yaw);
    const y = this.distance * Math.sin(this.pitch);
    const z = this.distance * Math.cos(this.pitch) * Math.cos(this.yaw);

    camera.position.set(target.x + x, target.y + y, target.z + z);

    camera.lookAt(target);
  }
  private onTargetChanged(body: CelestialBody) {
    this.distance = body.radius * 5 * AppState.get("radiusScale");
  }

  destroy() {}
}
