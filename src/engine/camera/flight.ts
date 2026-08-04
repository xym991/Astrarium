import * as THREE from "three";
import type { InputState } from "../Input/inputController";

import AppState from "../../state";
import { celestialBodies } from "../../main";
import { SOLAR_GALACTIC_SPEED } from "../../data/constants";
import type Clock from "../clock";
import type InputController from "../Input/inputController";
import MovementController from "./movementController";
import type { CelestialBody } from "../CelestialBody";

export class FlightController extends MovementController {
  private yaw = 0;
  private pitch = THREE.MathUtils.degToRad(30);

  private position = new THREE.Vector3();
  private velocity = new THREE.Vector3();

  private localVelocity = new THREE.Vector3();

  private readonly rotationSensitivity = 0.005;

  private readonly distanceScale = AppState.get("distanceScale");
  private readonly initialSpeedKm = 1_000;
  private readonly maxSpeedKm = 3_000_000_000;

  // Three-stage acceleration
  private readonly lowSpeedAccelerationKm = 25_000;
  private readonly mediumSpeedAccelerationKm = 100_000;
  private readonly warpAccelerationKm = 10_000_000;

  // Thresholds
  private readonly mediumThresholdKm = 100_000;
  private readonly warpThresholdKm = 600_000;

  private readonly brakingMultiplier = 4;
  private readonly idleDamping = 6;

  private readonly initialSpeed = this.initialSpeedKm * this.distanceScale;
  private readonly maxSpeed = this.maxSpeedKm * this.distanceScale;

  private readonly lowSpeedAcceleration =
    this.lowSpeedAccelerationKm * this.distanceScale;

  private readonly mediumSpeedAcceleration =
    this.mediumSpeedAccelerationKm * this.distanceScale;

  private readonly warpAcceleration =
    this.warpAccelerationKm * this.distanceScale;

  private readonly mediumThreshold =
    this.mediumThresholdKm * this.distanceScale;

  private readonly warpThreshold = this.warpThresholdKm * this.distanceScale;

  private forward = new THREE.Vector3();
  private right = new THREE.Vector3();
  private up = new THREE.Vector3();

  // Scratch vector reused every frame
  private collisionOffset = new THREE.Vector3();

  constructor(
    camera: THREE.PerspectiveCamera,
    inputController: InputController,
    body: CelestialBody,
  ) {
    super(camera, inputController, body);
    AppState.set("focusedBody", null);
    inputController.capturePointer();
    this.position.copy(camera.position);

    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");

    camera.near = 0.001;
    camera.updateProjectionMatrix();

    this.pitch = euler.x;
    this.yaw = euler.y;

    this.localVelocity.set(0, 0, 0);
    this.velocity.set(0, 0, 0);

    return this;
  }

  update(
    camera: THREE.PerspectiveCamera,
    clock: Clock,
    inputController: InputController,
  ) {
    this.addSolarDrift(clock.getDeltaDays(AppState.get("timeScale")));
    const delta = clock.getDeltaSeconds();
    const mouse = inputController.getMouse();
    const movement = inputController.getMovement();

    if (mouse.isCaptured || mouse.mode === "touch") {
      this.yaw -= mouse.mouseDeltaX * this.rotationSensitivity;
      this.pitch -= mouse.mouseDeltaY * this.rotationSensitivity;
    }

    const euler = new THREE.Euler(this.pitch, this.yaw, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    this.forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    this.right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    this.up.set(0, 1, 0).applyQuaternion(camera.quaternion);

    const currentSpeed = this.localVelocity.length();

    let acceleration: number;

    if (currentSpeed < this.mediumThreshold) {
      acceleration = this.lowSpeedAcceleration;
    } else if (currentSpeed < this.warpThreshold) {
      acceleration = this.mediumSpeedAcceleration;
    } else {
      acceleration = this.warpAcceleration;
    }

    const accel = acceleration * delta;
    const brake = accel * this.brakingMultiplier;

    const updateAxis = (
      velocity: number,
      positive: boolean,
      negative: boolean,
    ) => {
      if (positive === negative) {
        return THREE.MathUtils.damp(velocity, 0, this.idleDamping, delta);
      }

      const direction = positive ? 1 : -1;

      // Braking
      if (velocity !== 0 && Math.sign(velocity) !== direction) {
        velocity += direction * brake;

        if (Math.sign(velocity) === direction) {
          velocity = 0;
        }

        return velocity;
      }

      // Initial kick
      if (Math.abs(velocity) < this.initialSpeed) {
        velocity = direction * this.initialSpeed;
      }

      // Constant acceleration
      velocity += direction * accel;

      return THREE.MathUtils.clamp(velocity, -this.maxSpeed, this.maxSpeed);
    };

    this.localVelocity.z = updateAxis(
      this.localVelocity.z,
      movement.forward,
      movement.backward,
    );

    this.localVelocity.x = updateAxis(
      this.localVelocity.x,
      movement.right,
      movement.left,
    );

    this.localVelocity.y = updateAxis(
      this.localVelocity.y,
      movement.up,
      movement.down,
    );

    this.velocity
      .copy(this.right)
      .multiplyScalar(this.localVelocity.x)
      .addScaledVector(this.up, this.localVelocity.y)
      .addScaledVector(this.forward, this.localVelocity.z);

    this.position.addScaledVector(this.velocity, delta);

    // Prevent flying through planets
    this.resolveCollisions();

    camera.position.copy(this.position);
  }

  private resolveCollisions() {
    for (const body of celestialBodies) {
      const collisionRadius =
        Math.max(body.radius * 1.25, 1000) * this.distanceScale;

      const collisionRadiusSq = collisionRadius * collisionRadius;

      this.collisionOffset.subVectors(this.position, body.worldPosition);

      const distanceSq = this.collisionOffset.lengthSq();

      if (distanceSq >= collisionRadiusSq) continue;

      // Camera somehow exactly at the center
      if (distanceSq < 1e-12) {
        this.collisionOffset.set(1, 0, 0);
      } else {
        this.collisionOffset.multiplyScalar(1 / Math.sqrt(distanceSq));
      }

      // Push camera to surface
      this.position
        .copy(body.worldPosition)
        .addScaledVector(this.collisionOffset, collisionRadius);

      // Kill momentum
      this.velocity.set(0, 0, 0);
      this.localVelocity.set(0, 0, 0);

      break;
    }
  }

  private addSolarDrift(deltaDays: number) {
    this.position.y +=
      SOLAR_GALACTIC_SPEED * deltaDays * AppState.get("distanceScale");
  }

  exit(inputController: InputController) {
    inputController.releasePointer();
  }
}
