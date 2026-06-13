import { CelestialBodyData } from "../../data";
import { CelestialBody } from "../CelestialBody";

export default function buildSolarSystem(
  data: CelestialBodyData,
  parent: CelestialBody | null = null,
): CelestialBody {
  const body = new CelestialBody(data, parent);
  for (const childData of data.children) {
    buildSolarSystem(childData, body);
  }
  return body;
}
