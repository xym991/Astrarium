import type { AstrariumState } from "../state";

export const defaultState: AstrariumState = {
  simulationSpeed: 1,
  simulationRevolutionSpeed: 1,
  simulationRotationSpeed: 0.1,
  radiusScale: 1,
  distanceScale: 10,
  cameraMode: "overview",
  focusedBody: null,
  showOrbitPaths: true,
  showTrails: false,
  showLabels: true,
  paused: false,
};

export type cameraMode = "overview" | "orbit" | "flight";
export type NumericKeys = {
  [K in keyof AstrariumState]: AstrariumState[K] extends number ? K : never;
}[keyof AstrariumState];

export const RANGES: Record<NumericKeys, number[]> = {
  simulationSpeed: [0.1, 10, 1],
  simulationRevolutionSpeed: [1, 500, 1],
  simulationRotationSpeed: [0.1, 10, 1],
  radiusScale: [1, 10, 0.0001],
  distanceScale: [1, 10, 0.00001],
};

type CelestialBodyType = "star" | "planet" | "moon" | "asteroid" | "dwarf";

export interface CelestialBodydataInterface {
  name: string;
  radius: number;
  shapeScale: [number, number, number];

  semiMajorAxis: number;
  eccentricity: number;

  orbitalPeriod: number | null;
  rotationPeriod: number;

  orbitalTilt: number;
  axisTilt: number;

  ascendingNode: number;
  argumentOfPeriapsis: number;
  meanAnomalyAtEpoch: number;

  type: CelestialBodyType;
  color?: string;
}

export class CelestialBodyData implements CelestialBodydataInterface {
  declare name: string;
  declare radius: number;
  declare shapeScale: [number, number, number];

  declare semiMajorAxis: number;
  declare eccentricity: number;

  declare orbitalPeriod: number | null;
  declare rotationPeriod: number;

  declare orbitalTilt: number;
  declare axisTilt: number;

  declare ascendingNode: number; // Ω
  declare argumentOfPeriapsis: number; // ω
  declare meanAnomalyAtEpoch: number;

  declare type: CelestialBodyType;
  declare color: string;
  children: CelestialBodyData[] = [];

  constructor(props: CelestialBodydataInterface) {
    Object.assign(this, props);
  }

  addChild(child: CelestialBodyData) {
    this.children.push(child);
    return this;
  }
}

export const solarSystemData = new CelestialBodyData({
  name: "Sun",
  radius: 696340,
  shapeScale: [1, 1, 1],
  semiMajorAxis: 0,
  eccentricity: 0,
  orbitalPeriod: null,
  rotationPeriod: 25.38,
  orbitalTilt: 0,
  axisTilt: 0,
  ascendingNode: 0,
  argumentOfPeriapsis: 0,
  meanAnomalyAtEpoch: 0,
  type: "star",
  color: "#FFD27D",
})
  .addChild(
    new CelestialBodyData({
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
    }),
  )
  .addChild(
    new CelestialBodyData({
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
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Earth",
      ascendingNode: -11.261,
      argumentOfPeriapsis: 114.208,
      meanAnomalyAtEpoch: 357.517,
      type: "planet",
      radius: 6371.0,
      shapeScale: [1, 0.9966, 1],
      semiMajorAxis: 149598023,
      eccentricity: 0.0167086,
      orbitalPeriod: 365.256,
      orbitalTilt: 0,
      axisTilt: 23.44,
      rotationPeriod: 0.99726968,
      color: "#0099FF",
    }).addChild(
      new CelestialBodyData({
        name: "Moon",
        ascendingNode: 125.045,
        argumentOfPeriapsis: 318.063,
        meanAnomalyAtEpoch: 115.365,
        type: "moon",
        radius: 1737.4,
        shapeScale: [1, 1, 1],
        semiMajorAxis: 384400,
        eccentricity: 0,
        orbitalPeriod: 27.3217,
        orbitalTilt: 5.15,
        axisTilt: 0,
        rotationPeriod: 27.3217,
        color: "#BFC2C7",
      }),
    ),
  )
  .addChild(
    new CelestialBodyData({
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
      ),
  )
  .addChild(
    new CelestialBodyData({
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
      ),
  )
  .addChild(
    new CelestialBodyData({
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
      ),
  )
  .addChild(
    new CelestialBodyData({
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
      ),
  )
  .addChild(
    new CelestialBodyData({
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
      ),
  )
  .addChild(
    new CelestialBodyData({
      name: "Ceres",

      ascendingNode: 80.305,
      argumentOfPeriapsis: 73.597,
      meanAnomalyAtEpoch: 95.989,

      type: "dwarf",
      radius: 473,
      shapeScale: [1, 0.93, 1],

      semiMajorAxis: 413767000,
      eccentricity: 0.0785,

      orbitalPeriod: 1680,
      rotationPeriod: 0.378,

      orbitalTilt: 10.59,
      axisTilt: 4,

      color: "#AEB6C4",
    }),
  )
  .addChild(
    new CelestialBodyData({
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
    }),
  )
  .addChild(
    new CelestialBodyData({
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
    }),
  )
  .addChild(
    new CelestialBodyData({
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
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Makemake",

      ascendingNode: 79.62,
      argumentOfPeriapsis: 294.834,
      meanAnomalyAtEpoch: 165.51,

      type: "dwarf",
      radius: 715,
      shapeScale: [1, 1, 1],

      semiMajorAxis: 6850000000,
      eccentricity: 0.159,

      orbitalPeriod: 112900,
      rotationPeriod: 0.93,

      orbitalTilt: 28.98,
      axisTilt: 29,
      color: "#C97952",
    }),
  );
