import { CelestialBodyData } from "../..";

export default new CelestialBodyData({
  name: "Venus",
  radius: 6051.8,
  shapeScale: [1, 1, 1],
  semiMajorAxis: 108209475,
  eccentricity: 0.006772,

  orbitalTilt: 3.39,
  axisTilt: 177.36,

  orbitalPeriod: 224.701,
  rotationPeriod: -243.025,

  ascendingNode: 76.68,
  argumentOfPeriapsis: 54.884,
  meanAnomalyAtEpoch: 50.115,

  type: "planet",
  color: "#C89A26",
});
