import type { CelestialBody } from "../CelestialBody";
import * as THREE from "three";
import AppState from "../../state";

export function getBodyWorldPosition(body: CelestialBody) {
  const target = new THREE.Vector3();
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
