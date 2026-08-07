import { CelestialBodyData } from "../..";

export default new CelestialBodyData({
  name: "Neptune",

  ascendingNode: 131.784,
  argumentOfPeriapsis: 273.187,
  meanAnomalyAtEpoch: 256.228,

  type: "planet",
  radius: 24622,
  shapeScale: [1, 0.983, 1],

  semiMajorAxis: 4498396441,
  eccentricity: 0.0086,

  orbitalTilt: 1.77,
  axisTilt: 28.32,

  orbitalPeriod: 60182,
  rotationPeriod: 0.67125,

  color: "#5478F9",
})
  .addChild(
    new CelestialBodyData({
      name: "Despina",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 75.0,
      shapeScale: [1.04, 0.96, 0.92],

      semiMajorAxis: 52526,
      eccentricity: 0.0002,

      orbitalTilt: 0.3,
      axisTilt: 0,

      orbitalPeriod: 0.334655,
      rotationPeriod: 0.334655,

      color: "#B9C1C8",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Galatea",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 88.0,
      shapeScale: [1.04, 0.96, 0.92],

      semiMajorAxis: 61953,
      eccentricity: 0.0001,

      orbitalTilt: 0.05,
      axisTilt: 0,

      orbitalPeriod: 0.429,
      rotationPeriod: 0.429,

      color: "#C0C5CC",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Larissa",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 97.0,
      shapeScale: [1.04, 0.96, 0.92],

      semiMajorAxis: 73548,
      eccentricity: 0.0014,

      orbitalTilt: 0.2,
      axisTilt: 0,

      orbitalPeriod: 0.554,
      rotationPeriod: 0.554,

      color: "#B8C0C6",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Triton",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 140,

      type: "moon",
      radius: 1353.4,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 354759,
      eccentricity: 0.000016,

      orbitalTilt: 156.9,
      axisTilt: 0,

      orbitalPeriod: -5.877,
      rotationPeriod: -5.877,

      color: "#C8D6E4",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Nereid",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 290,

      type: "moon",
      radius: 170,
      shapeScale: [1.2, 1.0, 0.85],

      semiMajorAxis: 5513818,
      eccentricity: 0.75,

      orbitalTilt: 7.23,
      axisTilt: 0,

      orbitalPeriod: 360.14,
      rotationPeriod: 360.14,

      color: "#7E8798",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Proteus",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 210.0,
      shapeScale: [1.05, 0.95, 0.92],

      semiMajorAxis: 117647,
      eccentricity: 0.0005,

      orbitalTilt: 0.0,
      axisTilt: 0,

      orbitalPeriod: 1.122315,
      rotationPeriod: 1.122315,

      color: "#B2B6BE",
    }),
  );
