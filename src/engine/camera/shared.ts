import type { CelestialBody } from "../CelestialBody";
import * as THREE from "three";
import AppState from "../../state";
import type { InputState } from "./inputController";

export function getBodyWorldPosition(body: CelestialBody) {
  const target = new THREE.Vector3();
  if (!body.mesh) return target;
  body.mesh.getWorldPosition(target);
  return target;
}

export function getDefaultViewingDistance(body: CelestialBody) {
  return body.radius * 5 * AppState.get("radiusScale");
}
export function sphericalToCartesian(
  distance: number,
  yaw: number,
  pitch: number,
) {
  return new THREE.Vector3(
    distance * Math.cos(pitch) * Math.sin(yaw),
    distance * Math.sin(pitch),
    distance * Math.cos(pitch) * Math.cos(yaw),
  );
}

export function updateCameraRotation(
  camera: THREE.Camera,
  mouse: InputState["mouse"],
  state: {
    yaw: number;
    pitch: number;
  },
  sensitivity: number,
) {
  if (mouse.primaryMouse) {
    state.yaw -= mouse.mouseDeltaX * sensitivity;
    state.pitch -= mouse.mouseDeltaY * sensitivity;
  }

  state.pitch = THREE.MathUtils.clamp(
    state.pitch,
    -Math.PI / 2 + 0.01,
    Math.PI / 2 - 0.01,
  );

  const euler = new THREE.Euler(state.pitch, state.yaw, 0, "YXZ");

  camera.quaternion.setFromEuler(euler);
}
