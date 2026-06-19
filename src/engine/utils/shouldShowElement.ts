import type { CelestialBody } from "../CelestialBody";
import AppState from "../../state";
export default function shouldShowElement(
  body: CelestialBody,
  cameraDistance: number,
  near = 100,
  far = 20,
): boolean {
  const bodyRadius = body.radius * AppState.get("distanceScale");
  const bodyOrbitalRadius = body.semiMajorAxis * AppState.get("distanceScale");
  if (body.type === "star") return cameraDistance > bodyRadius * 100;

  return (
    (near ? cameraDistance > bodyRadius * near : true) &&
    (far ? cameraDistance < bodyOrbitalRadius * far : true)
  );
}
