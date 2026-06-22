import * as THREE from "three";
import guessOrbitE from "./guessOrbitE";
import type { CelestialBody } from "../CelestialBody";

interface OrbitalPositionOptions {
  body: CelestialBody;
  time: number;
  distanceScale: number;
  target?: THREE.Vector3;
}

export default function calculateOrbitalPosition({
  body,
  distanceScale,
  time,
  target = new THREE.Vector3(),
}: OrbitalPositionOptions): THREE.Vector3 {
  console.log(time);
  const { meanAnomalyAtEpoch, eccentricity, semiMajorAxis, orbitalPeriod } =
    body;

  if (!orbitalPeriod) return target.set(0, 0, 0);

  const M =
    THREE.MathUtils.degToRad(meanAnomalyAtEpoch) +
    ((time % orbitalPeriod) / orbitalPeriod) * Math.PI * 2;

  const E = guessOrbitE(M, eccentricity);

  const x = semiMajorAxis * distanceScale * (Math.cos(E) - eccentricity);

  const z =
    semiMajorAxis *
    distanceScale *
    Math.sqrt(1 - eccentricity * eccentricity) *
    Math.sin(E);

  return target.set(x, 0, z);
}
