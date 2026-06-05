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
export class OrbitController {
  private yaw = 0;
  private pitch = THREE.MathUtils.degToRad(30);
  private orbitYaw = 0;
  private orbitPitch = 0;
  private altitude = 0;
  private readonly rotationSensitivity = 0.005;
  private minAltitude = 0.01;
  private maxAltitude = 10;
  private lastFocusedBody?: CelestialBody;

  update(delta: number, camera: THREE.PerspectiveCamera, input: InputState) {
    const focusedBody = AppState.get("focusedBody");

    if (!focusedBody) return;
    if (focusedBody !== this.lastFocusedBody) {
      this.onTargetChanged(focusedBody);
      this.lastFocusedBody = focusedBody;
    }

    const mouse = input.mouse;
    const movement = input.movement;
    // Rotation
    if (mouse.primaryMouse) {
      this.yaw -= mouse.mouseDeltaX * this.rotationSensitivity;
      this.pitch -= mouse.mouseDeltaY * this.rotationSensitivity;
    }

    // Zoom
    if (mouse.scrollDelta !== 0) {
      this.altitude *= 1 + mouse.scrollDelta * 0.0001;
    }

    this.altitude = THREE.MathUtils.clamp(
      this.altitude,
      this.minAltitude,
      this.maxAltitude,
    );

    if (movement.left) this.orbitYaw -= delta;
    if (movement.right) this.orbitYaw += delta;
    if (movement.forward) this.orbitPitch += delta;
    if (movement.backward) this.orbitPitch -= delta;

    const radius =
      focusedBody.radius * AppState.get("radiusScale") + this.altitude;
    1;

    const center = getBodyWorldPosition(focusedBody);

    const offset = sphericalToCartesian(radius, this.orbitYaw, this.orbitPitch);
    console.log(center, offset);
    camera.position.copy(center.clone().add(offset));
    const euler = new THREE.Euler(this.pitch, this.yaw, 0, "YXZ");

    camera.quaternion.setFromEuler(euler);
  }
  private onTargetChanged(body: CelestialBody) {
    this.altitude = 0.1;
    // this.altitude = body.radius * AppState.get("radiusScale") * 0.1;
    // this.minAltitude = body.radius * AppState.get("radiusScale") * 0.1;
    // this.maxAltitude = body.radius * AppState.get("radiusScale") * 10;
  }

  destroy() {}
}
