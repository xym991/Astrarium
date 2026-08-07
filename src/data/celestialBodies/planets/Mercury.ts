import { CelestialBodyData } from "../..";

export default new CelestialBodyData({
  name: "Mercury",
  radius: 2439.7,
  shapeScale: [1, 1, 1],
  semiMajorAxis: 57909227,
  eccentricity: 0.20563,

  orbitalTilt: 7.0,
  axisTilt: 0.03,

  orbitalPeriod: 87.969,
  rotationPeriod: 58.646,

  ascendingNode: 48.331,
  argumentOfPeriapsis: 29.124,
  meanAnomalyAtEpoch: 174.796,

  type: "planet",
  color: "#B8B7C5",
});
