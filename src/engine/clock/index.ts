import AppState from "../../state";
export default class Clock {
  declare private static instance: Clock;
  private time = Date.now();
  private timestamp = performance.now();
  private delta = 0;
  private J2K = Date.UTC(2000, 0, 1, 12, 0, 0);
  private constructor() {}
  static getInstance() {
    if (!Clock.instance) {
      Clock.instance = new Clock();
    }
    return Clock.instance;
  }
  update() {
    const now = performance.now();

    this.delta = now - this.timestamp;
    if (AppState.get("paused")) {
      this.delta = 0;
    }
    this.time += this.delta * AppState.get("timeScale");
    this.timestamp = now;
  }
  getTime() {
    return this.time;
  }
  getDays() {
    return (this.time - this.J2K) / 86400000;
  }
  getDelta() {
    return this.delta;
  }
  getDeltaDays() {
    return (this.delta * AppState.get("timeScale")) / 86400000;
  }
}
