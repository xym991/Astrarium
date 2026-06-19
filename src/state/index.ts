import { defaultState, type cameraMode } from "../data";
import type { CelestialBody } from "../engine/CelestialBody";

export interface AstrariumState {
  timeScale: number;
  distanceScale: number;
  cameraMode: cameraMode;
  focusedBody: CelestialBody | null;
  showOrbitPaths: boolean;
  showTrails: boolean;
  showLabels: boolean;
  paused: boolean;
}

type DirtyState = Record<keyof AstrariumState, boolean>;

class AppState {
  private static instance: AppState;

  private state: AstrariumState = { ...defaultState };

  private dirty: DirtyState = Object.fromEntries(
    Object.keys(defaultState).map((key) => [key, false]),
  ) as DirtyState;

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
    this.dirty[key] = true;
    return true;
  }
  keys() {
    return Object.keys(this.state);
  }
  isDirty<K extends keyof AstrariumState>(key: K): boolean {
    let dirty = this.dirty[key];
    if (dirty) {
      this.dirty[key] = false;
    }
    return dirty;
  }
}

export default AppState.getInstance();
