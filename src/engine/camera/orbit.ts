// import type { ControllerContext } from "./index";
import * as THREE from "three";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "./inputController";
import AppState from "../../state";
import { getBodyWorldPosition } from "./shared";
export class OrbitController {
  private yaw = 0;
  private pitch = THREE.MathUtils.degToRad(30);
  private offset = new THREE.Vector3();
  private altitude = 0;
  private readonly rotationSensitivity = 0.005;
  private minAltitude = 0.01;
  private maxAltitude = 10;
  private lastFocusedBody?: CelestialBody;

  constructor(camera: THREE.PerspectiveCamera) {}

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

    const euler = new THREE.Euler(this.pitch, this.yaw, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    this.altitude = THREE.MathUtils.clamp(
      this.altitude,
      this.minAltitude,
      this.maxAltitude,
    );

    const localUp = this.offset.clone().normalize();

    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(
      camera.quaternion,
    );

    const right = cameraRight.projectOnPlane(localUp).normalize();

    const forward = new THREE.Vector3()
      .crossVectors(right, localUp)
      .normalize();
    const moveSpeed =
      (focusedBody.radius * AppState.get("radiusScale") + this.altitude) *
      delta;

    if (movement.forward)
      this.offset.add(forward.clone().multiplyScalar(-moveSpeed));

    if (movement.backward)
      this.offset.add(forward.clone().multiplyScalar(moveSpeed));

    if (movement.right)
      this.offset.add(right.clone().multiplyScalar(moveSpeed));

    if (movement.left)
      this.offset.add(right.clone().multiplyScalar(-moveSpeed));

    const radius =
      focusedBody.radius * AppState.get("radiusScale") + this.altitude;
    this.offset.setLength(radius);
    const center = getBodyWorldPosition(focusedBody);
    camera.position.copy(center.clone().add(this.offset));
  }
  private onTargetChanged(body: CelestialBody) {
    const radius = body.radius * AppState.get("radiusScale");
    this.altitude = radius * 0.5;
    this.minAltitude = radius * 0.2;
    this.maxAltitude = radius * 10;
    this.offset.set(radius + this.altitude, 0, 0);
  }

  destroy() {}
}
