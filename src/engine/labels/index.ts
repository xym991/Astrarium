import * as THREE from "three";
import { CelestialBody } from "../CelestialBody";
import AppState from "../../state";
import { recursiveTransform } from "../utils";
import shouldShowElement from "../utils/shouldShowElement";

interface VisibleLabel {
  body: CelestialBody;
  marker: {
    label: HTMLDivElement;
    indicator: HTMLDivElement;
  };
  x: number;
  y: number;
  width: number;
  height: number;
  priority: number;
}

export default class LabelController {
  private static instance: LabelController;

  private container: HTMLDivElement;

  private markers = new Map<
    CelestialBody,
    {
      label: HTMLDivElement;
      indicator: HTMLDivElement;
    }
  >();

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  static getInstance(container: HTMLDivElement, solarSystem: CelestialBody) {
    if (!LabelController.instance) {
      LabelController.instance = new LabelController(container);

      recursiveTransform(solarSystem, (body) => {
        this.instance.addBody(body);
      });
    }

    return LabelController.instance;
  }

  addBody(body: CelestialBody) {
    const indicator = document.createElement("div");

    indicator.className =
      "absolute z-[1] h-4 w-4 shrink-0 cursor-pointer select-none rounded-full border border-white pointer-events-auto lg:border-2 transition-opacity";

    indicator.style.borderColor = body.color;

    const label = document.createElement("div");

    label.className =
      "absolute z-[1] shrink-0 cursor-pointer select-none whitespace-nowrap font-medium text-[0.9rem] tracking-[0.15em] text-white pointer-events-auto transition-opacity";

    label.textContent = body.name.toUpperCase();

    indicator.style.opacity = "0";
    label.style.opacity = "0";
    indicator.style.willChange = "opacity";
    label.style.willChange = "opacity";

    this.container.appendChild(indicator);
    this.container.appendChild(label);

    this.markers.set(body, {
      label,
      indicator,
    });

    indicator.onclick = () => AppState.set("focusedBody", body);
    label.onclick = () => AppState.set("focusedBody", body);
  }

  private overlaps(a: VisibleLabel, b: VisibleLabel) {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }

  update(camera: THREE.Camera) {
    const visible: VisibleLabel[] = [];

    this.markers.forEach((marker, body) => {
      const distance = body.cached.distanceFromCamera;
      const screen = body.cached.screenPosition;

      if (
        !shouldShowElement(body, distance) ||
        !body.orbitalGroup.visible ||
        screen.z <= -1 ||
        screen.z >= 1 ||
        this.isOccluded(body)
      ) {
        marker.label.style.opacity = "0";
        marker.indicator.style.opacity = "0";
        return;
      }

      const x = (screen.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-screen.y * 0.5 + 0.5) * window.innerHeight;

      visible.push({
        body,
        marker,
        x,
        y,
        width: marker.label.offsetWidth + 16,
        height: marker.label.offsetHeight,
        priority:
          body.cached.projectedRadius +
          (AppState.get("focusedBody") === body ? 100000 : 0) +
          (body.type === "star" ? 5000 : 0) +
          (body.type === "planet" ? 1000 : 0),
      });
    });

    visible.sort((a, b) => b.priority - a.priority);

    const accepted: VisibleLabel[] = [];

    for (const label of visible) {
      const collides = accepted.some((other) => this.overlaps(label, other));

      if (collides) {
        label.marker.label.style.opacity = "0";
        label.marker.indicator.style.opacity = "0";
        continue;
      }

      accepted.push(label);

      label.marker.label.style.opacity = AppState.get("showLabels") ? "1" : "0";

      label.marker.indicator.style.opacity = AppState.get("showIndicators")
        ? "1"
        : "0";

      label.marker.indicator.style.transform = `translate3d(${label.x}px, ${label.y}px, 0) translate(-50%, -50%)`;

      label.marker.label.style.transform = `translate3d(${label.x + 16}px, ${label.y}px, 0) translate(0%, -50%)`;
    }
  }
  private isOccluded(body: CelestialBody): boolean {
    const bodyScreen = body.cached.screenPosition;

    const bodyX = (bodyScreen.x * 0.5 + 0.5) * window.innerWidth;
    const bodyY = (-bodyScreen.y * 0.5 + 0.5) * window.innerHeight;

    for (const other of this.markers.keys()) {
      if (other === body) continue;
      if (!other.orbitalGroup.visible) continue;

      if (other.cached.distanceFromCamera >= body.cached.distanceFromCamera) {
        continue;
      }

      if (other.cached.projectedRadius < 5) continue;

      const otherScreen = other.cached.screenPosition;

      const otherX = (otherScreen.x * 0.5 + 0.5) * window.innerWidth;
      const otherY = (-otherScreen.y * 0.5 + 0.5) * window.innerHeight;

      const dx = bodyX - otherX;
      const dy = bodyY - otherY;

      if (dx * dx + dy * dy < (other.cached.projectedRadius + 100) ** 2) {
        return true;
      }
    }

    return false;
  }
  destroy() {
    this.markers.forEach((marker) => {
      this.container.removeChild(marker.indicator);
      this.container.removeChild(marker.label);
    });

    this.markers.clear();
  }
}
