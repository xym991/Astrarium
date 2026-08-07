import { CelestialBodyData } from "../..";

export default new CelestialBodyData({
  name: "Jupiter",

  ascendingNode: 100.464,
  argumentOfPeriapsis: 273.867,
  meanAnomalyAtEpoch: 20.02,

  type: "planet",
  radius: 69911,
  shapeScale: [1, 0.935, 1],

  semiMajorAxis: 778340821,
  eccentricity: 0.0489,

  orbitalTilt: 1.3,
  axisTilt: 3.13,

  orbitalPeriod: 4332.59,
  rotationPeriod: 0.41354,

  color: "#C46B4D",
})
  .addChild(
    new CelestialBodyData({
      name: "Himalia",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 85,
      shapeScale: [1.05, 0.96, 0.9],

      semiMajorAxis: 11480000,
      eccentricity: 0.158,

      orbitalTilt: 27.5,
      axisTilt: 0,

      orbitalPeriod: 250.56,
      rotationPeriod: 250.56,

      color: "#9E9487",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Io",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 200,

      type: "moon",
      radius: 1821.6,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 421700,
      eccentricity: 0.0041,

      orbitalTilt: 0.04,
      axisTilt: 0,

      orbitalPeriod: 1.769,
      rotationPeriod: 1.769,

      color: "#DCC25A",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Europa",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 80,

      type: "moon",
      radius: 1560.8,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 671100,
      eccentricity: 0.0094,

      orbitalTilt: 0.47,
      axisTilt: 0.1,

      orbitalPeriod: 3.551,
      rotationPeriod: 3.551,

      color: "#CFC5A3",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Ganymede",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 300,

      type: "moon",
      radius: 2634.1,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 1070400,
      eccentricity: 0.0013,

      orbitalTilt: 0.2,
      axisTilt: 0.3,

      orbitalPeriod: 7.155,
      rotationPeriod: 7.155,

      color: "#8D7D69",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Callisto",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 20,

      type: "moon",
      radius: 2410.3,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 1882700,
      eccentricity: 0.0074,

      orbitalTilt: 0.28,
      axisTilt: 0,

      orbitalPeriod: 16.689,
      rotationPeriod: 16.689,

      color: "#7B5A4E",
    }),
  );
