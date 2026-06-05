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
};

export type cameraMode = "overview" | "orbit" | "flight";
export type NumericKeys = {
  [K in keyof AstrariumState]: AstrariumState[K] extends number ? K : never;
}[keyof AstrariumState];

export const RANGES: Record<NumericKeys, number[]> = {
  simulationSpeed: [0.1, 10, 1],
  simulationRevolutionSpeed: [10, 100, 1],
  simulationRotationSpeed: [1, 10, 1],
  // radiusScale: [1, 10, 0.0001],
  // distanceScale: [1, 10, 0.000005],
  radiusScale: [1, 10, 0.000015],
  distanceScale: [1, 10, 0.00000025],
};

type CelestialBodyType = "star" | "planet" | "moon";

export interface CelestialBodydataInterface {
  name: string;
  radius: number;
  distanceFromParent: number;
  orbitalPeriod: number | null;
  rotationPeriod: number;
  type: CelestialBodyType;
  color?: string;
}

export class CelestialBodyData implements CelestialBodydataInterface {
  declare name: string;
  declare radius: number;
  declare distanceFromParent: number;
  declare orbitalPeriod: number | null;
  declare rotationPeriod: number;
  declare type: CelestialBodyType;
  declare color?: string;
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
  distanceFromParent: 0,
  orbitalPeriod: null,
  rotationPeriod: 25.38,
  type: "star",
  color: "#FFD27D",
})
  .addChild(
    new CelestialBodyData({
      name: "Mercury",
      radius: 2439.7,
      distanceFromParent: 57909227,
      orbitalPeriod: 87.969,
      rotationPeriod: 58.646,
      type: "planet",
      color: "#9A9A9A",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Venus",
      radius: 6051.8,
      distanceFromParent: 108209475,
      orbitalPeriod: 224.701,
      rotationPeriod: -243.025,
      type: "planet",
      color: "#E6C38A",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Earth",
      type: "planet",
      radius: 6371.0,
      distanceFromParent: 149598023,
      orbitalPeriod: 365.256,
      rotationPeriod: 0.99726968,
      color: "#3B82F6",
    }).addChild(
      new CelestialBodyData({
        name: "Moon",
        type: "moon",
        radius: 1737.4,
        distanceFromParent: 384400,
        orbitalPeriod: 27.3217,
        rotationPeriod: 27.3217,
        color: "#C8CCD0",
      }),
    ),
  )
  .addChild(
    new CelestialBodyData({
      name: "Mars",
      type: "planet",
      radius: 3389.5,
      distanceFromParent: 227943824,
      orbitalPeriod: 686.98,
      rotationPeriod: 1.025957,
      color: "#ec8360",
    })
      .addChild(
        new CelestialBodyData({
          name: "Phobos",
          type: "moon",
          radius: 11.3,
          distanceFromParent: 9376,
          orbitalPeriod: 0.319,
          rotationPeriod: 0.319,
          color: "#7A6A5A",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Deimos",
          type: "moon",
          radius: 6.2,
          distanceFromParent: 23463,
          orbitalPeriod: 1.263,
          rotationPeriod: 1.263,
          color: "#9A8A75",
        }),
      ),
  )
  .addChild(
    new CelestialBodyData({
      name: "Jupiter",
      type: "planet",
      radius: 69911,
      distanceFromParent: 778340821,
      orbitalPeriod: 4332.59,
      rotationPeriod: 0.41354,
      color: "#f1ba95",
    })
      .addChild(
        new CelestialBodyData({
          name: "Io",
          type: "moon",
          radius: 1821.6,
          distanceFromParent: 421700,
          orbitalPeriod: 1.769,
          rotationPeriod: 1.769,
          color: "#FFD54A",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Europa",
          type: "moon",
          radius: 1560.8,
          distanceFromParent: 671100,
          orbitalPeriod: 3.551,
          rotationPeriod: 3.551,
          color: "#E8D8B0",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Ganymede",
          type: "moon",
          radius: 2634.1,
          distanceFromParent: 1070400,
          orbitalPeriod: 7.155,
          rotationPeriod: 7.155,
          color: "#8A7B6B",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Callisto",
          type: "moon",
          radius: 2410.3,
          distanceFromParent: 1882700,
          orbitalPeriod: 16.689,
          rotationPeriod: 16.689,
          color: "#5A4538",
        }),
      ),
  )
  .addChild(
    new CelestialBodyData({
      name: "Saturn",
      type: "planet",
      radius: 58232,
      distanceFromParent: 1426666422,
      orbitalPeriod: 10759.22,
      rotationPeriod: 0.44401,
      color: "#F2D58A",
    })
      .addChild(
        new CelestialBodyData({
          name: "Mimas",
          type: "moon",
          radius: 198.2,
          distanceFromParent: 185539,
          orbitalPeriod: 0.942,
          rotationPeriod: 0.942,
          color: "#D8D8D8",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Enceladus",
          type: "moon",
          radius: 252.1,
          distanceFromParent: 237948,
          orbitalPeriod: 1.37,
          rotationPeriod: 1.37,
          color: "#F5F8FF",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Tethys",
          type: "moon",
          radius: 531.1,
          distanceFromParent: 294619,
          orbitalPeriod: 1.888,
          rotationPeriod: 1.888,
          color: "#E7E8EA",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Dione",
          type: "moon",
          radius: 561.4,
          distanceFromParent: 377396,
          orbitalPeriod: 2.737,
          rotationPeriod: 2.737,
          color: "#D9D7D2",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Rhea",
          type: "moon",
          radius: 763.8,
          distanceFromParent: 527108,
          orbitalPeriod: 4.518,
          rotationPeriod: 4.518,
          color: "#C7C8CC",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Titan",
          type: "moon",
          radius: 2574.7,
          distanceFromParent: 1221870,
          orbitalPeriod: 15.945,
          rotationPeriod: 15.945,
          color: "#E0A84D",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Iapetus",
          type: "moon",
          radius: 734.5,
          distanceFromParent: 3560820,
          orbitalPeriod: 79.322,
          rotationPeriod: 79.322,
          color: "#B0A08A",
        }),
      ),
  )
  .addChild(
    new CelestialBodyData({
      name: "Uranus",
      type: "planet",
      radius: 25362,
      distanceFromParent: 2870658186,
      orbitalPeriod: 30688.5,
      rotationPeriod: -0.71833,
      color: "#7FE7F2",
    })
      .addChild(
        new CelestialBodyData({
          name: "Miranda",
          type: "moon",
          radius: 235.8,
          distanceFromParent: 129900,
          orbitalPeriod: 1.413,
          rotationPeriod: 1.413,
          color: "#B8B0A8",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Ariel",
          type: "moon",
          radius: 578.9,
          distanceFromParent: 191020,
          orbitalPeriod: 2.52,
          rotationPeriod: 2.52,
          color: "#D8DDE5",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Umbriel",
          type: "moon",
          radius: 584.7,
          distanceFromParent: 266300,
          orbitalPeriod: 4.144,
          rotationPeriod: 4.144,
          color: "#66666A",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Titania",
          type: "moon",
          radius: 788.9,
          distanceFromParent: 435910,
          orbitalPeriod: 8.706,
          rotationPeriod: 8.706,
          color: "#BFC6D0",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Oberon",
          type: "moon",
          radius: 761.4,
          distanceFromParent: 583520,
          orbitalPeriod: 13.463,
          rotationPeriod: 13.463,
          color: "#8D8D92",
        }),
      ),
  )
  .addChild(
    new CelestialBodyData({
      name: "Neptune",
      type: "planet",
      radius: 24622,
      distanceFromParent: 4498396441,
      orbitalPeriod: 60182,
      rotationPeriod: 0.67125,
      color: "#6e92ed",
    })
      .addChild(
        new CelestialBodyData({
          name: "Triton",
          type: "moon",
          radius: 1353.4,
          distanceFromParent: 354759,
          orbitalPeriod: -5.877,
          rotationPeriod: -5.877,
          color: "#D9E8F5",
        }),
      )
      .addChild(
        new CelestialBodyData({
          name: "Nereid",
          type: "moon",
          radius: 170,
          distanceFromParent: 5513818,
          orbitalPeriod: 360.14,
          rotationPeriod: 360.14,
          color: "#8C95A8",
        }),
      ),
  );
