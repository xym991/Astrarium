import type { CameraMode } from ".";
import type { CelestialBody } from "../engine/CelestialBody";
import type {
  MouseState,
  MovementState,
} from "../engine/Input/inputController";
import {
  defaultMouseState,
  defaultMovementState,
} from "../engine/Input/inputController";
import InputController from "../engine/Input/inputController";

export interface TelemetryState {
  currentTime: number;
  distanceFromSun: number;
  focusedBody: CelestialBody | null;
  timeScale: number;
  cameraMode: CameraMode;
  mouseState: MouseState;
  movementState: MovementState;
}

class Telemetry {
  private static instance: Telemetry;
  private timestamp = performance.now();

  private state = $state<TelemetryState>({
    currentTime: Date.now(),
    distanceFromSun: 0,
    focusedBody: null,
    timeScale: 1,
    cameraMode: "overview",
    mouseState: defaultMouseState,
    movementState: defaultMovementState,
  });

  private constructor() {}

  static getInstance() {
    if (!Telemetry.instance) {
      Telemetry.instance = new Telemetry();
    }

    return Telemetry.instance;
  }

  get<K extends keyof TelemetryState>(key: K): TelemetryState[K] {
    return this.state[key];
  }

  update(values: Partial<TelemetryState>) {
    let timestamp = performance.now();
    if (timestamp - this.timestamp < 30) return;
    for (const key in values) {
      const value = values[key as keyof TelemetryState];

      if (value !== undefined) {
        this.state[key as keyof TelemetryState] = value as never;
      }
    }
    this.timestamp = timestamp;
  }
}

export default Telemetry.getInstance();
