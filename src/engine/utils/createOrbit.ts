import * as THREE from "three";

import {
  HighPrecisionLine,
  HighPrecisionLineGeometry,
  HighPrecisionLineMaterial,
} from "three-high-precision-lines";

export default function createOrbit(
  eccentricity: number,
  color: number | string = 0x555555,
) {
  const positions: number[] = [];

  const a = 1;
  const e = eccentricity;
  const b = a * Math.sqrt(1 - e * e);

  for (let i = 0; i <= 16384; i++) {
    const E = (i / 8192) * Math.PI * 2;

    positions.push(a * (Math.cos(E) - e), 0, b * Math.sin(E));
  }

  const geometry = new HighPrecisionLineGeometry({
    positions,
  });

  const material = new HighPrecisionLineMaterial({
    color: new THREE.Color(color).multiplyScalar(6).convertLinearToSRGB(),
    opacity: 1,
  });

  return new HighPrecisionLine(geometry, material);
}
