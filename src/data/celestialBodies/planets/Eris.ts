import { CelestialBodyData } from "../..";

export default new CelestialBodyData({
  name: "Eris",

  ascendingNode: 35.951,
  argumentOfPeriapsis: 151.639,
  meanAnomalyAtEpoch: 204.16,

  type: "dwarf",
  radius: 1163,
  shapeScale: [1, 1, 1],

  semiMajorAxis: 10125000000,
  eccentricity: 0.4407,

  orbitalPeriod: 203830,
  rotationPeriod: 1.08,

  orbitalTilt: 44.04,
  axisTilt: 78.0,

  color: "#D8E6F2",
}).addChild(
  new CelestialBodyData({
    name: "Dysnomia",

    ascendingNode: 0,
    argumentOfPeriapsis: 0,
    meanAnomalyAtEpoch: 0,

    type: "moon",
    radius: 350.0,
    shapeScale: [1.03, 0.98, 0.95],

    semiMajorAxis: 37300,
    eccentricity: 0.0,

    orbitalTilt: 0.0,
    axisTilt: 0,

    orbitalPeriod: 15.774,
    rotationPeriod: 15.774,

    color: "#B5B9C2",
  }),
);
