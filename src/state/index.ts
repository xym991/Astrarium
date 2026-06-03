import { defaultState, type cameraMode } from "../data";
import type { CelestialBody } from "../engine/CelestialBody";

export interface AstrariumState {
  simulationSpeed: number;
  simulationRevolutionSpeed: number;
  simulationRotationSpeed: number;
  radiusScale: number;
  distanceScale: number;
  cameraMode: cameraMode;
  focusedBody: CelestialBody | null;
  showOrbitPaths: boolean;
  showTrails: boolean;
  showLabels: boolean;
}

class AppState {
  private static instance: AppState;

  private state: AstrariumState = defaultState;

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

  set<K extends keyof AstrariumState>(key: K, value: AstrariumState[K]) {
    if (this.state[key] === value) {
      return;
    }
    this.state[key] = value;
  }
  keys() {
    return Object.keys(this.state);
  }
}

export default AppState.getInstance();
