import * as THREE from "three";
import { CelestialBody } from "../CelestialBody";
import AppState from "../../state";
import { recursiveTransform } from "../utils";
import shouldShowElement from "../utils/shouldShowElement";

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
  private temp = new THREE.Vector3();
  private cameraPos = new THREE.Vector3();

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
    indicator.className = "indicator";
    indicator.style.borderColor = body.color;

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = body.name.toUpperCase();

    this.container.appendChild(indicator);
    this.container.appendChild(label);

    this.markers.set(body, {
      label,
      indicator,
    });

    indicator.addEventListener("click", () => {
      AppState.set("focusedBody", body);
    });

    label.addEventListener("click", () => {
      AppState.set("focusedBody", body);
    });
  }

  update(camera: THREE.Camera) {
    this.markers.forEach((marker, body) => {
      body.mesh.getWorldPosition(this.temp);

      const bodyPos = body.mesh.getWorldPosition(this.temp);

      camera.getWorldPosition(this.cameraPos);

      const cameraDistance = this.cameraPos.distanceTo(bodyPos);

      if (!shouldShowElement(body, cameraDistance)) {
        marker.label.style.display = "none";
        marker.indicator.style.display = "none";
        return;
      }

      this.temp.project(camera);

      if (this.temp.z < -1 || this.temp.z > 1) {
        marker.label.style.display = "none";
        marker.indicator.style.display = "none";
        return;
      }

      marker.label.style.display = "block";
      marker.indicator.style.display = "block";

      const x = (this.temp.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-this.temp.y * 0.5 + 0.5) * window.innerHeight;

      marker.indicator.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      marker.label.style.transform = `translate3d(${x + 16}px, ${y}px, 0) translate(0%, -50%)`;
    });
  }

  shouldShowLabel(body: CelestialBody, cameraDistance: number) {
    const bodyRadius = body.radius * AppState.get("radiusScale");
    const bodyOrbitalRadius =
      body.semiMajorAxis * AppState.get("distanceScale");
    if (body.type === "star") return cameraDistance > bodyRadius * 100;

    return (
      cameraDistance < bodyOrbitalRadius * 20 &&
      cameraDistance > bodyOrbitalRadius * 0.001 + bodyRadius * 100
    );
  }

  destroy() {
    this.markers.forEach((marker) => {
      this.container.removeChild(marker.indicator);
      this.container.removeChild(marker.label);
    });

    this.markers.clear();
  }
}
