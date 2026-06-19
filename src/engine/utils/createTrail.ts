import type { CelestialBody } from "../CelestialBody";
import {
  HighPrecisionLine,
  HighPrecisionLineGeometry,
  HighPrecisionLineMaterial,
} from "three-high-precision-lines";
import * as THREE from "three";

export type Trail = {
  line: HighPrecisionLine;
  pointsHigh: Float32Array;
  pointsLow: Float32Array;
  index: number;
  length: number;
  count: number;
  material: THREE.ShaderMaterial;
  distance: THREE.Vector3;
};

export default function createTrail(length: number): Trail {
  if (!length) throw new Error("Trail length must be greater than 0");

  let pointsHigh = new Float32Array(length * 3 * 2);
  let pointsLow = new Float32Array(length * 3 * 2);

  let line = new HighPrecisionLine(
    new HighPrecisionLineGeometry({
      positionsHigh: pointsHigh,
      positionsLow: pointsLow,
    }),
    new HighPrecisionLineMaterial({
      color: new THREE.Color(0xffffff).multiplyScalar(5),
    }),
  );

  return {
    line,
    pointsHigh,
    pointsLow,
    index: length,
    length,
    count: 0,
    material: line.material as THREE.ShaderMaterial,
    distance: new THREE.Vector3(),
  };
}
