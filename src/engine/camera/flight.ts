// import type { ControllerContext } from "./index";
import * as THREE from "three";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "./inputController";
import AppState from "../../state";
import { getBodyWorldPosition } from "./shared";
export class FlightController {
  private yaw = 0;
  private pitch = THREE.MathUtils.degToRad(30);
  private position = new THREE.Vector3();
  private readonly rotationSensitivity = 0.005;

  update(delta: number, camera: THREE.PerspectiveCamera, input: InputState) {
    const mouse = input.mouse;
    const movement = input.movement;
    // Rotation
    if (mouse.primaryMouse) {
      this.yaw -= mouse.mouseDeltaX * this.rotationSensitivity;
      this.pitch -= mouse.mouseDeltaY * this.rotationSensitivity;
    }

    const euler = new THREE.Euler(this.pitch, this.yaw, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      camera.quaternion,
    );

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const moveSpeed = delta * 100;

    if (movement.forward)
      this.position.add(forward.clone().multiplyScalar(moveSpeed));

    if (movement.backward)
      this.position.add(forward.clone().multiplyScalar(-moveSpeed));

    if (movement.right)
      this.position.add(right.clone().multiplyScalar(moveSpeed));

    if (movement.left)
      this.position.add(right.clone().multiplyScalar(-moveSpeed));

    if (movement.up) this.position.add(up.clone().multiplyScalar(moveSpeed));

    if (movement.down) this.position.add(up.clone().multiplyScalar(-moveSpeed));

    camera.position.copy(this.position);
  }

  destroy() {}
}
