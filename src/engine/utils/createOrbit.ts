import * as THREE from "three";

import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
export default function createOrbit(
  eccentricity: number,
  orbitalTilt: number,
  color?: number | string,
) {
  if (!color) color = 0xaaaaaa;

  const tilt = THREE.MathUtils.degToRad(orbitalTilt);
  const positions: number[] = [];

  const a = 1;
  const e = eccentricity;
  const b = a * Math.sqrt(1 - e * e);

  for (let i = 0; i <= 8192; i++) {
    const E = (i / 8192) * Math.PI * 2;

    const x = a * (Math.cos(E) - e);

    let z = b * Math.sin(E);

    const y = -z * Math.sin(tilt);
    z = z * Math.cos(tilt);

    positions.push(x, y, z);
  }

  const geometry = new LineGeometry();
  geometry.setPositions(positions);

  const material = new LineMaterial({
    color: new THREE.Color(color).multiplyScalar(2),
    linewidth: 2,
    transparent: true,
    opacity: 0.25,
  });

  material.resolution.set(window.innerWidth, window.innerHeight);

  const orbit = new Line2(geometry, material);
  orbit.computeLineDistances();
  // orbit.visible = false;
  return orbit;
}
