import type { AstrariumState } from "../state";

export type NumericKeys = {
  [K in keyof AstrariumState]: AstrariumState[K] extends number ? K : never;
}[keyof AstrariumState];

export type BooleanKeys = {
  [K in keyof AstrariumState]: AstrariumState[K] extends boolean ? K : never;
}[keyof AstrariumState];

export const timeScaleOptions: { label: string; value: number }[] = [
  { label: "1 Second", value: 1 },
  { label: "30 Sec", value: 30 },
  { label: "1 Min", value: 60 },
  { label: "10 Min", value: 600 },
  { label: "30 Min", value: 1800 },
  { label: "1 Hour", value: 3600 },
  { label: "6 Hours", value: 21600 },
  { label: "12 Hours", value: 43200 },
  { label: "1 Day", value: 86400 },
  { label: "2 Days", value: 172800 },
  { label: "3 Days", value: 259200 },
  { label: "5 Days", value: 432000 },
  { label: "10 Days", value: 864000 },
  { label: "15 Days", value: 1296000 },
  { label: "1 Month", value: 2629800 },
  { label: "2 Months", value: 5259600 },
  { label: "3 Months", value: 7889400 },
  { label: "6 Months", value: 15778800 },
  { label: "9 Months", value: 23668200 },
  { label: "1 Year", value: 31557600 },
  { label: "2 Years", value: 63115200 },
  { label: "3 Years", value: 94672800 },
  { label: "5 Years", value: 157788000 },
  { label: "10 Years", value: 315576000 },
  { label: "20 Years", value: 631152000 },
  { label: "30 Years", value: 946728000 },
  { label: "40 Years", value: 1262304000 },
  { label: "50 Years", value: 1577880000 },
  { label: "75 Years", value: 2366820000 },
  { label: "100 Years", value: 3155760000 },
];

export function getTimeScaleLabel(timeScale: number) {
  return (
    timeScaleOptions.find((option) => option.value === timeScale)?.label ??
    `${timeScale}x`
  );
}

export type CelestialBodyType =
  | "star"
  | "planet"
  | "moon"
  | "asteroid"
  | "dwarf";

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
      // .addChild(
      //   new CelestialBodyData({
      //     name: "Epimetheus",

      //     ascendingNode: 0,
      //     argumentOfPeriapsis: 0,
      //     meanAnomalyAtEpoch: 0,

      //     type: "moon",
      //     radius: 58.1,
      //     shapeScale: [1.05, 0.95, 0.9],

      //     semiMajorAxis: 151422,
      //     eccentricity: 0.0098,

      //     orbitalTilt: 0.34,
      //     axisTilt: 0,

      //     orbitalPeriod: 0.6942,
      //     rotationPeriod: 0.6942,

      //     color: "#B8B3AD",
      //   }),
      // )
      // .addChild(
      //   new CelestialBodyData({
      //     name: "Pandora",

      //     ascendingNode: 0,
      //     argumentOfPeriapsis: 0,
      //     meanAnomalyAtEpoch: 0,

      //     type: "moon",
      //     radius: 55.0,
      //     shapeScale: [1.04, 0.96, 0.92],

      //     semiMajorAxis: 141720,
      //     eccentricity: 0.0042,

      //     orbitalTilt: 0.0,
      //     axisTilt: 0,

      //     orbitalPeriod: 0.6285,
      //     rotationPeriod: 0.6285,

      //     color: "#C6BFB5",
      //   }),
      // )
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
      ),
  )
  // .addChild(
  //   new CelestialBodyData({
  //     name: "Ceres",

  //     semiMajorAxis: 414010000,
  //     eccentricity: 0.0758,
  //     orbitalTilt: 10.593,

  //     ascendingNode: 80.305,
  //     argumentOfPeriapsis: 73.597,
  //     meanAnomalyAtEpoch: 77.372,

  //     type: "dwarf",
  //     radius: 473,
  //     shapeScale: [1, 0.93, 1],

  //     orbitalPeriod: 1681.63,
  //     rotationPeriod: 0.378,

  //     axisTilt: 4,

  //     color: "#AEB6C4",
  //   }),
  // )
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
    ),
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
    ),
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
      ),
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
