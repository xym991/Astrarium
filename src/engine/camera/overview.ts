import * as THREE from "three";
import type { CelestialBody } from "../CelestialBody";
import type { InputState } from "./inputController";
import AppState from "../../state";
import { getBodyWorldPosition, getDefaultViewingDistance } from "./shared";
import type { MovementController } from ".";

export class OverviewController implements MovementController {
  private offset = new THREE.Vector3();
  private orientation = new THREE.Quaternion();

  private distance = 10;

  private readonly rotationSensitivity = 0.005;
  private minDistance = 2;
  private maxDistance = 5000000;

  private lastFocusedBody?: CelestialBody;

  enter(camera: THREE.PerspectiveCamera, focusedBody?: CelestialBody) {
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
      this.distance *= 1 + mouse.scrollDelta * 0.001;
    }

    this.distance = THREE.MathUtils.clamp(
      this.distance,
      this.minDistance,
      this.maxDistance,
    );

    this.offset.set(0, 0, this.distance).applyQuaternion(this.orientation);

    const target = getBodyWorldPosition(focusedBody);

    camera.position.copy(target).add(this.offset);
    camera.quaternion.copy(this.orientation);
  }

  private onTargetChanged(body: CelestialBody) {
    this.orientation.identity();

    this.minDistance = Math.max(
      body.radius * AppState.get("radiusScale") * 1.2,
      0.01,
    );
    const radius = body.radius * AppState.get("radiusScale");

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

    // this.maxDistance = body.radius * AppState.get("radiusScale") * 1000;

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
