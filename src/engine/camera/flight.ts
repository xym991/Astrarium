import * as THREE from "three";
import type { InputState } from "./inputController";
import type { MovementController } from ".";

export class FlightController implements MovementController {
  private yaw = 0;
  private pitch = THREE.MathUtils.degToRad(30);

  private position = new THREE.Vector3();
  private velocity = new THREE.Vector3();
  private readonly maxVelocity = 1000;

  private readonly rotationSensitivity = 0.005;

  private baseAcceleration = 1;
  private currentAcceleration = 1;

  private drag = 0.9;

  private forward = new THREE.Vector3();
  private right = new THREE.Vector3();
  private up = new THREE.Vector3();

  enter(camera: THREE.PerspectiveCamera) {
    this.position.copy(camera.position);
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
    this.pitch = euler.x;
    this.yaw = euler.y;

    return this;
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

    this.forward.set(0, 0, -1).applyQuaternion(camera.quaternion);

    this.right.set(1, 0, 0).applyQuaternion(camera.quaternion);

    this.up.set(0, 1, 0).applyQuaternion(camera.quaternion);

    const accelStep = this.currentAcceleration * delta;

    if (movement.forward)
      this.velocity.add(this.forward.clone().multiplyScalar(accelStep));

    if (movement.backward)
      this.velocity.add(this.forward.clone().multiplyScalar(-accelStep));

    if (movement.right)
      this.velocity.add(this.right.clone().multiplyScalar(accelStep));

    if (movement.left)
      this.velocity.add(this.right.clone().multiplyScalar(-accelStep));

    if (movement.up)
      this.velocity.add(this.up.clone().multiplyScalar(accelStep));

    if (movement.down)
      this.velocity.add(this.up.clone().multiplyScalar(-accelStep));

    this.velocity.multiplyScalar(Math.pow(this.drag, delta * 60));

    if (this.velocity.length() < 0.01) {
      this.velocity.set(0, 0, 0);
    } else if (this.velocity.lengthSq() > this.maxVelocity * this.maxVelocity) {
      this.velocity.setLength(this.maxVelocity);
    }

    this.position.add(this.velocity.clone().multiplyScalar(delta));
    camera.position.copy(this.position);
  }

  exit() {}
}
