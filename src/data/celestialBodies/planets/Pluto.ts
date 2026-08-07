import { CelestialBodyData } from "../..";

export default new CelestialBodyData({
  name: "Pluto",

  ascendingNode: 110.299,
  argumentOfPeriapsis: 113.834,
  meanAnomalyAtEpoch: 14.86,

  type: "dwarf",
  radius: 1188.3,
  shapeScale: [1, 1, 1],

  semiMajorAxis: 5906380000,
  eccentricity: 0.2488,

  orbitalPeriod: 90560,
  rotationPeriod: -6.387,

  orbitalTilt: 17.16,
  axisTilt: 122.53,

  color: "#C8A88B",
}).addChild(
  new CelestialBodyData({
    name: "Charon",

    ascendingNode: 0,
    argumentOfPeriapsis: 0,
    meanAnomalyAtEpoch: 0,

    type: "moon",
    radius: 606.0,
    shapeScale: [1.04, 0.98, 0.96],

    semiMajorAxis: 19571,
    eccentricity: 0.0,

    orbitalTilt: 0.0,
    axisTilt: 0,

    orbitalPeriod: 6.38723,
    rotationPeriod: 6.38723,

    color: "#A9A6A0",
  }),
);
