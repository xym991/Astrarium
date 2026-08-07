import { CelestialBodyData } from "../..";
export default new CelestialBodyData({
  name: "Mars",

  ascendingNode: 49.558,
  argumentOfPeriapsis: 286.502,
  meanAnomalyAtEpoch: 19.373,

  type: "planet",
  radius: 3389.5,
  shapeScale: [1, 1, 1],

  semiMajorAxis: 227943824,
  eccentricity: 0.0934,

  orbitalTilt: 1.85,
  axisTilt: 25.19,

  orbitalPeriod: 686.98,
  rotationPeriod: 1.025957,

  color: "#C85A1E",
})
  .addChild(
    new CelestialBodyData({
      name: "Phobos",

      ascendingNode: 83.143,
      argumentOfPeriapsis: 298.38,
      meanAnomalyAtEpoch: 19.909,

      type: "moon",
      radius: 11.3,
      shapeScale: [1.15, 0.95, 0.85],

      semiMajorAxis: 9376,
      eccentricity: 0.0151,

      orbitalTilt: 1.08,
      axisTilt: 0,

      orbitalPeriod: 0.319,
      rotationPeriod: 0.319,

      color: "#6E6257",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Deimos",

      ascendingNode: 79.41,
      argumentOfPeriapsis: 260.73,
      meanAnomalyAtEpoch: 290.49,

      type: "moon",
      radius: 6.2,
      shapeScale: [1.4, 0.9, 0.8],

      semiMajorAxis: 23463,
      eccentricity: 0.0002,

      orbitalTilt: 1.79,
      axisTilt: 0,

      orbitalPeriod: 1.263,
      rotationPeriod: 1.263,

      color: "#8A8177",
    }),
  );
