export interface CelestialBodydataInterface {
  name: string;
  radius: number;
  distanceFromParent: number;
  orbitalPeriod: number | null;
  rotationPeriod: number;
  color?: string;
}

export class CelestialBodyData implements CelestialBodydataInterface {
  declare name: string;
  declare radius: number;
  declare distanceFromParent: number;
  declare orbitalPeriod: number | null;
  declare rotationPeriod: number;
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
  color: "#FFD27D",
})
  .addChild(
    new CelestialBodyData({
      name: "Mercury",
      radius: 2439.7,
      distanceFromParent: 57909227,
      orbitalPeriod: 87.969,
      rotationPeriod: 58.646,
      color: "#8C8C8C",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Venus",
      radius: 6051.8,
      distanceFromParent: 108209475,
      orbitalPeriod: 224.701,
      rotationPeriod: -243.025,
      color: "#D9B38C",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Earth",
      radius: 6371.0,
      distanceFromParent: 149598023,
      orbitalPeriod: 365.256,
      rotationPeriod: 0.99726968,
      color: "#4B79D8",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Mars",
      radius: 3389.5,
      distanceFromParent: 227943824,
      orbitalPeriod: 686.98,
      rotationPeriod: 1.025957,
      color: "#C65D3B",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Jupiter",
      radius: 69911,
      distanceFromParent: 778340821,
      orbitalPeriod: 4332.59,
      rotationPeriod: 0.41354,
      color: "#D8B08C",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Saturn",
      radius: 58232,
      distanceFromParent: 1426666422,
      orbitalPeriod: 10759.22,
      rotationPeriod: 0.44401,
      color: "#E6D5A8",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Uranus",
      radius: 25362,
      distanceFromParent: 2870658186,
      orbitalPeriod: 30688.5,
      rotationPeriod: -0.71833,
      color: "#AEE7E8",
    }),
  )
  .addChild(
    new CelestialBodyData({
      name: "Neptune",
      radius: 24622,
      distanceFromParent: 4498396441,
      orbitalPeriod: 60182,
      rotationPeriod: 0.67125,
      color: "#4169E1",
    }),
  );
