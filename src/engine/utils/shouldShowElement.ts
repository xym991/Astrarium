import type { CelestialBody } from "../CelestialBody";
import AppState from "../../state";
export default function shouldShowElement(
  body: CelestialBody,
  cameraDistanceSq: number,
  near = 100,
  far = 20,
): boolean {
  const bodyRadius = body.radius * AppState.get("distanceScale");
  const bodyOrbitalRadius = body.semiMajorAxis * AppState.get("distanceScale");
  if (body.type === "star") return cameraDistanceSq > (bodyRadius * 100) ** 2;

  return (
    (near ? cameraDistanceSq > (bodyRadius * near) ** 2 : true) &&
    (far ? cameraDistanceSq < (bodyOrbitalRadius * far) ** 2 : true)
  );
}
