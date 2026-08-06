import { ThreePerf } from "three-perf";
import type { WebGLRenderer } from "three";

export default class ThreePerfManager {
  private perf: ThreePerf;

  constructor(
    renderer: WebGLRenderer,
    domElement: HTMLElement = document.body,
  ) {
    this.perf = new ThreePerf({
      renderer,
      domElement,
      visible: false,
      enabled: true,
      guiVisible: false,
      actionToCallUI: "perf",
      backgroundOpacity: 0.75,
      scale: 1,
      memory: true,
      showGraph: true,
      logsPerSecond: 10,
    });
  }

  begin(): void {
    this.perf.begin();
    (document.querySelector("#three-perf-ui") as HTMLDivElement).style.zIndex =
      "10000000";
  }

  end(): void {
    this.perf.end();
  }

  dispose(): void {
    this.perf.dispose();
  }
}
