import { CelestialBodyData } from "..";
import planets from "./planets";

const Sun = new CelestialBodyData({
  name: "Sun",
  radius: 696340,
  shapeScale: [1, 1, 1],
  semiMajorAxis: 0,
  eccentricity: 0,
  orbitalPeriod: null,
  rotationPeriod: 25.38,
  orbitalTilt: 0,
  axisTilt: 0,
  ascendingNode: 0,
  argumentOfPeriapsis: 0,
  meanAnomalyAtEpoch: 0,
  type: "star",
  color: "#FFD27D",
});

planets.forEach((planet) => {
  Sun.addChild(planet);
});

export default Sun;
