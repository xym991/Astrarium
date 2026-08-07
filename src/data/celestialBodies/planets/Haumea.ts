import { CelestialBodyData } from "../..";

export default new CelestialBodyData({
  name: "Haumea",

  ascendingNode: 121.787,
  argumentOfPeriapsis: 239.041,
  meanAnomalyAtEpoch: 205.95,

  type: "dwarf",
  radius: 780,
  shapeScale: [1, 0.49, 0.734],

  semiMajorAxis: 6452000000,
  eccentricity: 0.1913,

  orbitalPeriod: 103410,
  rotationPeriod: 0.163,

  orbitalTilt: 28.19,
  axisTilt: 126,

  color: "#7FD8E8",
})
  .addChild(
    new CelestialBodyData({
      name: "Hi'iaka",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 160.0,
      shapeScale: [1.04, 0.96, 0.94],

      semiMajorAxis: 49880,
      eccentricity: 0.051,

      orbitalTilt: 0.0,
      axisTilt: 0,

      orbitalPeriod: 49.12,
      rotationPeriod: 49.12,

      color: "#D6D2C5",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Namaka",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 85.0,
      shapeScale: [1.03, 0.97, 0.95],

      semiMajorAxis: 25600,
      eccentricity: 0.0,

      orbitalTilt: 0.0,
      axisTilt: 0,

      orbitalPeriod: 18.28,
      rotationPeriod: 18.28,

      color: "#CDBEAA",
    }),
  );
