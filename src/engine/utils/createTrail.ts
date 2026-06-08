import type { CelestialBody } from "../CelestialBody";
import * as THREE from "three";

const MAX_POINTS = 5000;

export type Trail = {
  line: THREE.Line;
  points: Float32Array;
  index: number;
  length: number;
};

export default function createTrail(length: number): Trail {
  let geometry = new THREE.BufferGeometry();
  let buffer = new Float32Array(length * 3 * 2);
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(buffer, 3).setUsage(THREE.DynamicDrawUsage),
  );
  const color = new THREE.Color(0xffffff);
  return {
    line: new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: color.multiplyScalar(2) }),
    ),
    points: buffer,
    index: length,
    length: length,
  };
}
