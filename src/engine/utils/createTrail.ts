import type { CelestialBody } from "../CelestialBody";
import * as THREE from "three";

const MAX_POINTS = 5000;

export type Trail = {
  line: THREE.Line;
  points: Float32Array;
  index: number;
  length: number;
  count: number;
};

export default function createTrail(length: number): Trail | null {
  if (!length) return null;
  let geometry = new THREE.BufferGeometry();
  let buffer = new Float32Array(length * 3 * 2);
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(buffer, 3).setUsage(THREE.DynamicDrawUsage),
  );
  const color = new THREE.Color(0xffffff);
  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color: color.multiplyScalar(1.5) }),
  );
  line.frustumCulled = false;
  return {
    line,
    points: buffer,
    index: length,
    length,
    count: 0,
  };
}
