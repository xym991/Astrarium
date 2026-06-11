import type { AstrariumState } from "../state";

export const defaultState: AstrariumState = {
  simulationSpeed: 1,
  simulationRevolutionSpeed: 10,
  simulationRotationSpeed: 1,
  radiusScale: 1,
  distanceScale: 1,
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
  simulationRevolutionSpeed: [50, 500, 1],
  simulationRotationSpeed: [1, 10, 1],
  // radiusScale: [1, 10, 0.0001],
  // distanceScale: [1, 10, 0.000005],
  radiusScale: [1, 10, 0.000025],
  distanceScale: [1, 10, 0.0000025],
};

type CelestialBodyType = "star" | "planet" | "moon" | "asteroid" | "dwarf";

export interface CelestialBodydataInterface {
  name: string;
  radius: number;

  semiMajorAxis: number;
  eccentricity: number;

  orbitalPeriod: number | null;
  rotationPeriod: number;

  orbitalTilt: number;
  axisTilt: number;

  type: CelestialBodyType;
  color?: string;
}

export class CelestialBodyData implements CelestialBodydataInterface {
  declare name: string;
  declare radius: number;

  declare semiMajorAxis: number;
  declare eccentricity: number;

  declare orbitalPeriod: number | null;
  declare rotationPeriod: number;

  declare orbitalTilt: number;
  declare axisTilt: number;

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
  semiMajorAxis: 0,
  eccentricity: 0,
  orbitalPeriod: null,
  rotationPeriod: 25.38,
  orbitalTilt: 0,
  axisTilt: 0,
  type: "star",
  color: "#FFD27D",
})
  .addChild(
    new CelestialBodyData({
      name: "Mercury",
      radius: 2439.7,
      semiMajorAxis: 57909227,
      eccentricity: 0.20563,

      orbitalTilt: 7.0,
      axisTilt: 0.03,

      orbitalPeriod: 87.969,
      rotationPeriod: 58.646,
      type: "planet",
      color: "#b1aeaa",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Venus",
      radius: 6051.8,
      semiMajorAxis: 108209475,
      eccentricity: 0.006772,

      orbitalTilt: 3.39,
      axisTilt: 177.36,

      orbitalPeriod: 224.701,
      rotationPeriod: -243.025,
      type: "planet",
      color: "#C8B793",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Earth",
      type: "planet",
      radius: 6371.0,
      semiMajorAxis: 149598023,
      eccentricity: 0.0167086,
      orbitalPeriod: 365.256,
      orbitalTilt: 0,
      axisTilt: 23.44,
      rotationPeriod: 0.99726968,
      color: "#6390db",
    }).addChild(
      new CelestialBodyData({
        name: "Moon",
        type: "moon",
        radius: 1737.4,
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
      type: "planet",
      radius: 3389.5,
      semiMajorAxis: 227943824,
      eccentricity: 0.0934,

      orbitalTilt: 1.85,
      axisTilt: 25.19,

      orbitalPeriod: 686.98,
      rotationPeriod: 1.025957,
      color: "#b97e2e",
    })
      .addChild(
        new CelestialBodyData({
          name: "Phobos",
          type: "moon",
          radius: 11.3,
          semiMajorAxis: 9376,
          eccentricity: 0,

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
          type: "moon",
          radius: 6.2,
          semiMajorAxis: 23463,
          eccentricity: 0,

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
      type: "planet",
      radius: 69911,
      semiMajorAxis: 778340821,
      eccentricity: 0.0489,

      orbitalTilt: 1.3,
      axisTilt: 3.13,

      orbitalPeriod: 4332.59,
      rotationPeriod: 0.41354,
      color: "#C19A75",
    })
      .addChild(
        new CelestialBodyData({
          name: "Io",
          type: "moon",
          radius: 1821.6,
          semiMajorAxis: 421700,
          eccentricity: 0,

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
          type: "moon",
          radius: 1560.8,
          semiMajorAxis: 671100,
          eccentricity: 0,

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
          type: "moon",
          radius: 2634.1,
          semiMajorAxis: 1070400,
          eccentricity: 0,

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
          type: "moon",
          radius: 2410.3,
          semiMajorAxis: 1882700,
          eccentricity: 0,
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
      type: "planet",
      radius: 58232,
      semiMajorAxis: 1426666422,
      eccentricity: 0.0565,
      orbitalTilt: 2.49,
      axisTilt: 26.73,
      orbitalPeriod: 10759.22,
      rotationPeriod: 0.44401,
      color: "#B9A36A",
    })
      .addChild(
        new CelestialBodyData({
          name: "Mimas",
          type: "moon",
          radius: 198.2,
          semiMajorAxis: 185539,
          eccentricity: 0,
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
          type: "moon",
          radius: 252.1,
          semiMajorAxis: 237948,
          eccentricity: 0,
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
          type: "moon",
          radius: 531.1,
          semiMajorAxis: 294619,
          eccentricity: 0,

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
          type: "moon",
          radius: 561.4,
          semiMajorAxis: 377396,
          eccentricity: 0,

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
          type: "moon",
          radius: 763.8,
          semiMajorAxis: 527108,
          eccentricity: 0,

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
          type: "moon",
          radius: 2574.7,
          semiMajorAxis: 1221870,
          eccentricity: 0,

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
          type: "moon",
          radius: 734.5,
          semiMajorAxis: 3560820,
          eccentricity: 0,

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
      type: "planet",
      radius: 25362,
      semiMajorAxis: 2870658186,
      eccentricity: 0.0463,

      orbitalTilt: 0.77,
      axisTilt: 97.77,

      orbitalPeriod: 30688.5,
      rotationPeriod: -0.71833,
      color: "#87b7bf",
    })
      .addChild(
        new CelestialBodyData({
          name: "Miranda",
          type: "moon",
          radius: 235.8,
          semiMajorAxis: 129900,
          eccentricity: 0,

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
          type: "moon",
          radius: 578.9,
          semiMajorAxis: 191020,
          eccentricity: 0,

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
          type: "moon",
          radius: 584.7,
          semiMajorAxis: 266300,
          eccentricity: 0,

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
          type: "moon",
          radius: 788.9,
          semiMajorAxis: 435910,
          eccentricity: 0,

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
          type: "moon",
          radius: 761.4,
          semiMajorAxis: 583520,
          eccentricity: 0,

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
      type: "planet",
      radius: 24622,
      semiMajorAxis: 4498396441,
      eccentricity: 0.0086,

      orbitalTilt: 1.77,
      axisTilt: 28.32,

      orbitalPeriod: 60182,
      rotationPeriod: 0.67125,
      color: "#466ede",
    })
      .addChild(
        new CelestialBodyData({
          name: "Triton",
          type: "moon",
          radius: 1353.4,
          semiMajorAxis: 354759,
          eccentricity: 0,

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
          type: "moon",
          radius: 170,
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
      type: "dwarf",
      radius: 473,
      semiMajorAxis: 413767000,
      eccentricity: 0.0785,
      orbitalPeriod: 1680,
      rotationPeriod: 0.378,
      orbitalTilt: 10.59,
      axisTilt: 4,
      color: "#A9A39A",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Pluto",
      type: "dwarf",
      radius: 1188.3,
      semiMajorAxis: 5906380000,
      eccentricity: 0.2488,
      orbitalPeriod: 90560,
      rotationPeriod: -6.387,
      orbitalTilt: 17.16,
      axisTilt: 122.53,

      color: "#B8A48A",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Eris",
      type: "dwarf",
      radius: 1163,
      semiMajorAxis: 10125000000,
      eccentricity: 0.4407,
      orbitalPeriod: 203830,
      rotationPeriod: 1.08,
      orbitalTilt: 44.04,
      axisTilt: 78.0,
      color: "#D8D8D8",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Haumea",
      type: "dwarf",
      radius: 780,
      semiMajorAxis: 6452000000,
      eccentricity: 0.1913,
      orbitalPeriod: 103410,
      rotationPeriod: 0.163,
      orbitalTilt: 28.19,
      axisTilt: 126,
      color: "#E0D7C8",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Makemake",
      type: "dwarf",
      radius: 715,
      semiMajorAxis: 6850000000,
      eccentricity: 0.159,
      orbitalPeriod: 112900,
      rotationPeriod: 0.93,
      orbitalTilt: 28.98,
      axisTilt: 29,
      color: "#C98E6B",
    }),
  );
