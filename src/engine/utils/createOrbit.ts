import * as THREE from "three";

import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";

export default function createOrbit(color: string | number = 0xffffff) {
  const curve = new THREE.EllipseCurve(0, 0, 1, 1, 0, Math.PI * 2);

  const points = curve.getPoints(4196);

  const positions: number[] = [];

  for (const p of points) {
    positions.push(p.x, 0, p.y);
  }

  const geometry = new LineGeometry();

  geometry.setPositions(positions);

  const material = new LineMaterial({
    color: new THREE.Color(color).multiplyScalar(1.5),
    linewidth: 2,
    transparent: true,
    opacity: 0.25,
  });

  material.resolution.set(window.innerWidth, window.innerHeight);

  const orbit = new Line2(geometry, material);

  orbit.computeLineDistances();

  return orbit;
}
