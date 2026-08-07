import { CelestialBodyData } from "../..";

export default new CelestialBodyData({
  name: "Saturn",

  ascendingNode: 113.665,
  argumentOfPeriapsis: 339.392,
  meanAnomalyAtEpoch: 317.02,

  type: "planet",
  radius: 58232,
  shapeScale: [1, 0.902, 1],

  semiMajorAxis: 1426666422,
  eccentricity: 0.0565,

  orbitalTilt: 2.49,
  axisTilt: 26.73,

  orbitalPeriod: 10759.22,
  rotationPeriod: 0.44401,

  color: "#C9AA55",
})
  .addChild(
    new CelestialBodyData({
      name: "Janus",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 89.5,
      shapeScale: [1.04, 0.96, 0.92],

      semiMajorAxis: 151472,
      eccentricity: 0.0068,

      orbitalTilt: 0.14,
      axisTilt: 0,

      orbitalPeriod: 0.6945,
      rotationPeriod: 0.6945,

      color: "#C7C6BD",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Mimas",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 25,

      type: "moon",
      radius: 198.2,
      shapeScale: [1.08, 0.96, 0.92],

      semiMajorAxis: 185539,
      eccentricity: 0.0196,

      orbitalTilt: 1.57,
      axisTilt: 0,

      orbitalPeriod: 0.942,
      rotationPeriod: 0.942,

      color: "#CFCFCF",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Enceladus",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 80,

      type: "moon",
      radius: 252.1,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 237948,
      eccentricity: 0.0047,

      orbitalTilt: 0.01,
      axisTilt: 0,

      orbitalPeriod: 1.37,
      rotationPeriod: 1.37,

      color: "#EEF3F8",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Tethys",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 140,

      type: "moon",
      radius: 531.1,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 294619,
      eccentricity: 0.0001,

      orbitalTilt: 1.09,
      axisTilt: 0,

      orbitalPeriod: 1.888,
      rotationPeriod: 1.888,

      color: "#D9DADD",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Dione",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 200,

      type: "moon",
      radius: 561.4,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 377396,
      eccentricity: 0.0022,

      orbitalTilt: 0.02,
      axisTilt: 0,

      orbitalPeriod: 2.737,
      rotationPeriod: 2.737,

      color: "#C9C7C3",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Rhea",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 260,

      type: "moon",
      radius: 763.8,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 527108,
      eccentricity: 0.001,

      orbitalTilt: 0.35,
      axisTilt: 0,

      orbitalPeriod: 4.518,
      rotationPeriod: 4.518,

      color: "#BDBEC2",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Titan",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 320,

      type: "moon",
      radius: 2574.7,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 1221870,
      eccentricity: 0.0288,

      orbitalTilt: 0.35,
      axisTilt: 0.3,

      orbitalPeriod: 15.945,
      rotationPeriod: 15.945,

      color: "#C98E3E",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Iapetus",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 110,

      type: "moon",
      radius: 734.5,
      shapeScale: [1.04, 0.97, 0.95],

      semiMajorAxis: 3560820,
      eccentricity: 0.0286,

      orbitalTilt: 15.47,
      axisTilt: 0,

      orbitalPeriod: 79.322,
      rotationPeriod: 79.322,

      color: "#9A8A76",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Hyperion",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 133.0,
      shapeScale: [1.08, 0.92, 0.9],

      semiMajorAxis: 1500934,
      eccentricity: 0.1042,

      orbitalTilt: 0.43,
      axisTilt: 0,

      orbitalPeriod: 21.2766,
      rotationPeriod: 21.2766,

      color: "#C7B59E",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Phoebe",

      ascendingNode: 0,
      argumentOfPeriapsis: 0,
      meanAnomalyAtEpoch: 0,

      type: "moon",
      radius: 106.6,
      shapeScale: [1.03, 0.98, 0.95],

      semiMajorAxis: 12952000,
      eccentricity: 0.156,

      orbitalTilt: 175.2,
      axisTilt: 0,

      orbitalPeriod: 550.4,
      rotationPeriod: 550.4,

      color: "#B1A89A",
    }),
  );
