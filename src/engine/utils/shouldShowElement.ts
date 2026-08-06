import type { CelestialBody } from "../CelestialBody";
import { DISTANCE_SCALE } from "../../data/constants";
export default function shouldShowElement(
  body: CelestialBody,
  distance: number,
  near = 100,
  far = 20,
): boolean {
  const bodyRadius = body.radius * DISTANCE_SCALE;
  const bodyOrbitalRadius = body.semiMajorAxis * DISTANCE_SCALE;
  if (body.type === "star") return distance > bodyRadius * 100;

  return (
    (near ? distance > bodyRadius * near : true) &&
    (far ? distance < bodyOrbitalRadius * far : true)
  );
}
