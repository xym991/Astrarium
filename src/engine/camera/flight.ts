import * as THREE from "three";
import type { InputState } from "./inputController";

export class FlightController {
  private yaw = 0;
  private pitch = THREE.MathUtils.degToRad(30);

  private position = new THREE.Vector3();
  private velocity = new THREE.Vector3();

  private readonly rotationSensitivity = 0.005;

  private baseAcceleration = 1;
  private currentAcceleration = 1;

  private currentDrag = 0.98;
  private baseDrag = 0.85;

  constructor(camera: THREE.PerspectiveCamera) {
    // this.position.copy(camera.position);
    // const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
    // this.pitch = euler.x;
    // this.yaw = euler.y;
  }

  update(delta: number, camera: THREE.PerspectiveCamera, input: InputState) {
    const mouse = input.mouse;
    const movement = input.movement;

    // Rotation
    if (mouse.primaryMouse) {
      this.yaw -= mouse.mouseDeltaX * this.rotationSensitivity;
      this.pitch -= mouse.mouseDeltaY * this.rotationSensitivity;
    }

    const moving =
      movement.forward ||
      movement.backward ||
      movement.left ||
      movement.right ||
      movement.up ||
      movement.down;

    if (moving) {
      this.currentAcceleration += delta * this.currentAcceleration;
    } else {
      this.currentAcceleration = THREE.MathUtils.lerp(
        this.currentAcceleration,
        this.baseAcceleration,
        3 * delta,
      );
    }

    const euler = new THREE.Euler(this.pitch, this.yaw, 0, "YXZ");

    camera.quaternion.setFromEuler(euler);

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      camera.quaternion,
    );

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);

    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

    const accelStep = this.currentAcceleration * delta;

    if (movement.forward)
      this.velocity.add(forward.clone().multiplyScalar(accelStep));

    if (movement.backward)
      this.velocity.add(forward.clone().multiplyScalar(-accelStep));

    if (movement.right)
      this.velocity.add(right.clone().multiplyScalar(accelStep));

    if (movement.left)
      this.velocity.add(right.clone().multiplyScalar(-accelStep));

    if (movement.up) this.velocity.add(up.clone().multiplyScalar(accelStep));

    if (movement.down) this.velocity.add(up.clone().multiplyScalar(-accelStep));

    this.currentDrag = Math.min(this.baseDrag + this.currentDrag * delta, 0.99);

    this.velocity.multiplyScalar(Math.pow(this.currentDrag, delta * 60));

    this.position.add(this.velocity.clone().multiplyScalar(delta));

    camera.position.copy(this.position);
  }

  destroy() {}
}
