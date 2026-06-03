import { CelestialBodyData } from "../../data";
import { CelestialBody } from "../CelestialBody";

export default function buildSolarSystem(
  data: CelestialBodyData,
  parent: CelestialBody | null = null,
): CelestialBody {
  const body = new CelestialBody(data, parent);
  for (const childData of data.children) {
    const childBody = buildSolarSystem(childData, body);
    body.children.push(childBody);
    body.group.add(childBody.group);
  }
  return body;
}
