import { CelestialBodyData } from "../..";

export default new CelestialBodyData({
  name: "Uranus",

  ascendingNode: 74.006,
  argumentOfPeriapsis: 96.998,
  meanAnomalyAtEpoch: 142.238,

  type: "planet",
  radius: 25362,
  shapeScale: [1, 0.977, 1],

  semiMajorAxis: 2870658186,
  eccentricity: 0.0463,

  orbitalTilt: 0.77,
  axisTilt: 97.77,

  orbitalPeriod: 30688.5,
  rotationPeriod: -0.71833,

  color: "#3DC6DF",
})
  .addChild(
    new CelestialBodyData({
      name: "Puck",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 81.0,
      shapeScale: [1.04, 0.96, 0.92],

      semiMajorAxis: 86000,
      eccentricity: 0.0005,

      orbitalTilt: 0.31,
      axisTilt: 0,

      orbitalPeriod: 0.7618,
      rotationPeriod: 0.7618,

      color: "#B3B4B7",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Portia",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 67.6,
      shapeScale: [1.03, 0.97, 0.95],

      semiMajorAxis: 66097,
      eccentricity: 0.00005,

      orbitalTilt: 0.03,
      axisTilt: 0,

      orbitalPeriod: 0.513,
      rotationPeriod: 0.513,

      color: "#C1C2C4",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Caliban",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 72.0,
      shapeScale: [1.04, 0.96, 0.92],

      semiMajorAxis: 7231000,
      eccentricity: 0.158,

      orbitalTilt: 0.0,
      axisTilt: 0,

      orbitalPeriod: 579.7,
      rotationPeriod: 579.7,

      color: "#9C9DA0",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Sycorax",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 78.5,
      shapeScale: [1.04, 0.96, 0.92],

      semiMajorAxis: 12179000,
      eccentricity: 0.521,

      orbitalTilt: 0.0,
      axisTilt: 0,

      orbitalPeriod: 1288.0,
      rotationPeriod: 1288.0,

      color: "#A9A8A3",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Miranda",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 35,

      type: "moon",
      radius: 235.8,
      shapeScale: [1.1, 0.95, 0.9],

      semiMajorAxis: 129900,
      eccentricity: 0.0013,

      orbitalTilt: 4.34,
      axisTilt: 0,

      orbitalPeriod: 1.413,
      rotationPeriod: 1.413,

      color: "#A8A097",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Ariel",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 100,

      type: "moon",
      radius: 578.9,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 191020,
      eccentricity: 0.0012,

      orbitalTilt: 0.04,
      axisTilt: 0,

      orbitalPeriod: 2.52,
      rotationPeriod: 2.52,

      color: "#D6DBE3",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Umbriel",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 180,

      type: "moon",
      radius: 584.7,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 266300,
      eccentricity: 0.0039,

      orbitalTilt: 0.13,
      axisTilt: 0,

      orbitalPeriod: 4.144,
      rotationPeriod: 4.144,

      color: "#5F5F63",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Titania",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 260,

      type: "moon",
      radius: 788.9,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 435910,
      eccentricity: 0.0011,

      orbitalTilt: 0.08,
      axisTilt: 0,

      orbitalPeriod: 8.706,
      rotationPeriod: 8.706,

      color: "#B9C0CB",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Oberon",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 330,

      type: "moon",
      radius: 761.4,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 583520,
      eccentricity: 0.0014,

      orbitalTilt: 0.07,
      axisTilt: 0,

      orbitalPeriod: 13.463,
      rotationPeriod: 13.463,

      color: "#86868B",
    }),
  );
