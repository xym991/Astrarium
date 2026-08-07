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
