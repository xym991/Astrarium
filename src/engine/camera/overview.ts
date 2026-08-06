import * as THREE from "three";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "../Input/inputController";
import AppState from "../../state";

import type InputController from "../Input/inputController";
import type Clock from "../clock";
import MovementController from "./movementController";
import { DISTANCE_SCALE, SIMULATION_RADIUS } from "../../data/constants";

export class OverviewController extends MovementController {
  private offset = new THREE.Vector3();
  private orientation = new THREE.Quaternion();

  private distance = 10;

  private readonly rotationSensitivity = 0.01;
  private minDistance = 2;
  private maxDistance = SIMULATION_RADIUS * DISTANCE_SCALE;

  private lastFocusedBody?: CelestialBody;

  constructor(
    camera: THREE.PerspectiveCamera,
    inputController: InputController,
    body: CelestialBody,
  ) {
    super(camera, inputController, body);
    AppState.set("focusedBody", body);
    this.onTargetChanged(body, camera);
    inputController.releasePointer();
    return this;
  }

  update(
    camera: THREE.PerspectiveCamera,
    clock: Clock,
    inputController: InputController,
  ) {
    const focusedBody = AppState.get("focusedBody");

    if (!focusedBody) return;

    if (focusedBody !== this.lastFocusedBody) {
      this.onTargetChanged(focusedBody, camera);
      this.lastFocusedBody = focusedBody;
    }

    const mouse = inputController.getMouse();

    if (mouse.primaryMouse) {
      const yawQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        -mouse.mouseDeltaX * this.rotationSensitivity,
      );

      const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        -mouse.mouseDeltaY * this.rotationSensitivity,
      );

      this.orientation.multiply(yawQuat);
      this.orientation.multiply(pitchQuat);

      this.orientation.normalize();
    }

    if (mouse.scrollDelta !== 0) {
      this.distance = Math.max(
        this.distance * (1 + mouse.scrollDelta * 0.001),
        this.minDistance,
      );
    }

    this.distance = THREE.MathUtils.clamp(
      this.distance,
      this.minDistance,
      this.maxDistance,
    );

    this.offset.set(0, 0, this.distance).applyQuaternion(this.orientation);

    const target = focusedBody.cached.worldPosition;

    camera.position.copy(target).add(this.offset);

    camera.quaternion.copy(this.orientation);
  }

  private onTargetChanged(
    body: CelestialBody,
    camera: THREE.PerspectiveCamera,
  ) {
    this.orientation.identity();

    const radius = body.radius * DISTANCE_SCALE;

    this.minDistance = Math.max(radius * 1.5, 0.0005);
    camera.near = radius / 3;
    camera.updateProjectionMatrix();

    this.distance = radius * 5;
    if (body.name == "Sun") {
      if (!this.lastFocusedBody) this.distance = radius * 500;
      else this.distance = radius * 50;

      this.orientation.setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(60), // pitch down

          THREE.MathUtils.degToRad(-75), // rotate around system

          0,
        ),
      );
    } else {
      this.orientation.setFromEuler(
        new THREE.Euler(
          0,

          THREE.MathUtils.degToRad(-90),

          0,
        ),
      );
    }

    this.orientation.multiply(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(0),
          THREE.MathUtils.degToRad(-90),
          0,
        ),
      ),
    );
  }

  exit() {}
}
