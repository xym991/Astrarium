import type { CelestialBody } from "../engine/CelestialBody";

export interface AstrariumState {
  simulationSpeed: number;
  simulationRevolutionSpeed: number;
  simulationRotationSpeed: number;
  radiusScale: number;
  distanceScale: number;
  cameraMode: "overview" | "orbit" | "flight";
  focusedBody: CelestialBody | null;
  showOrbitPaths: boolean;
  showTrails: boolean;
  showLabels: boolean;
}

class AppState {
  private static instance: AppState;

  private state: AstrariumState = {
    simulationSpeed: 1,
    simulationRevolutionSpeed: 10,
    simulationRotationSpeed: 1,
    radiusScale: 1 / 1000,
    distanceScale: 1 / 50000,
    cameraMode: "overview",
    focusedBody: null,
    showOrbitPaths: true,
    showTrails: false,
    showLabels: true,
  };

  private constructor() {}

  static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }

    return AppState.instance;
  }

  get<K extends keyof AstrariumState>(key: K): AstrariumState[K] {
    return this.state[key];
  }

  set<K extends keyof AstrariumState>(
    key: K,

    value: AstrariumState[K],
  ) {
    this.state[key] = value;
  }
}

export default AppState.getInstance();
