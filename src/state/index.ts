import type { CelestialBody } from "../engine/CelestialBody";

export interface AstrariumState {
  timeScale: number;
  distanceScale: number;
  cameraMode: CameraMode;
  focusedBody: CelestialBody | null;
  showOrbits: boolean;
  showTrails: boolean;
  showLabels: boolean;
  showMoons: boolean;
  showIndicators: boolean;
  paused: boolean;
}

export const toggleShortcuts: Partial<Record<keyof AstrariumState, string>> = {
  showOrbits: "O",
  showIndicators: "I",
  showMoons: "M",
  showLabels: "L",
  showTrails: "T",
};

export const defaultAppState: AstrariumState = {
  timeScale: 1,
  distanceScale: 0.00001,
  cameraMode: "overview",
  focusedBody: null,
  showOrbits: true,
  showTrails: true,
  showLabels: true,
  showMoons: true,
  showIndicators: true,
  paused: false,
};

export type CameraMode = "overview" | "orbit" | "flight";

type DirtyState = Record<keyof AstrariumState, boolean>;

type Listener = (value: AstrariumState[keyof AstrariumState]) => void;

class AppState {
  private static instance: AppState;

  private listeners: {
    [K in keyof AstrariumState]?: Set<Listener>;
  } = {};

  private state: AstrariumState = { ...defaultAppState };

  private dirty: DirtyState = Object.fromEntries(
    Object.keys(defaultAppState).map((key) => [key, false]),
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
    this.listeners[key]?.forEach((listener) => listener(value));
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

  subscribe<K extends keyof AstrariumState>(key: K, listener: Listener) {
    if (!this.listeners[key]) {
      this.listeners[key] = new Set<Listener>();
    }

    this.listeners[key]?.add(listener);

    return () => {
      this.listeners[key]?.delete(listener);
    };
  }
}

export default AppState.getInstance();
