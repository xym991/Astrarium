// import type { ControllerContext } from "./index";
import * as THREE from "three";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "./inputController";
import AppState from "../../state";
import { getBodyWorldPosition } from "./shared";
import type { MovementController } from "./index";
export class OrbitController implements MovementController {
  private yaw = 0;
  private pitch = THREE.MathUtils.degToRad(30);
  private offset = new THREE.Vector3();
  private altitude = 0;
  private readonly rotationSensitivity = 0.005;
  private minAltitude = 0.01;
  private maxAltitude = 10;
  private lastFocusedBody?: CelestialBody;

  enter(camera: THREE.PerspectiveCamera) {
    return this;
  }

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
    const euler = new THREE.Euler(this.pitch, this.yaw, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    // Zoom
    if (mouse.scrollDelta !== 0) {
      this.altitude *= 1 + mouse.scrollDelta * 0.0001;
    }

    this.altitude = THREE.MathUtils.clamp(
      this.altitude,
      this.minAltitude,
      this.maxAltitude,
    );

    const backwards = this.offset.clone().normalize();

    const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(
      camera.quaternion,
    );

    const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
      camera.quaternion,
    );

    const projectedRight = cameraRight.projectOnPlane(backwards).normalize();
    const projectedUp = cameraUp.projectOnPlane(backwards).normalize();

    const forward = new THREE.Vector3()
      .crossVectors(projectedRight, backwards)
      .normalize();
    const right = new THREE.Vector3()
      .crossVectors(projectedUp, backwards)
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
    this.offset.set(
      -(radius + this.altitude),
      // radius + this.altitude,
      0,
      // radius + this.altitude,
      0,
    );
  }

  exit() {}
}
