import * as THREE from "three";
import { CelestialBody } from "../CelestialBody";
import AppState from "../../state";
import { recursiveTransform } from "../utils";

export default class LabelController {
  private static instance: LabelController;
  private container: HTMLDivElement;
  private labels = new Map<CelestialBody, HTMLDivElement>();
  private temp = new THREE.Vector3();

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
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = body.name.toUpperCase();
    this.container.appendChild(label);
    this.labels.set(body, label);
    label.addEventListener("click", () => {
      AppState.set("focusedBody", body);
    });
  }

  update(camera: THREE.Camera) {
    this.labels.forEach((label, body) => {
      body.mesh.getWorldPosition(this.temp);
      const cameraDistance = camera.position.distanceTo(this.temp);

      if (!this.shouldShowLabel(body, cameraDistance)) {
        label.style.display = "none";
        return;
      }

      this.temp.project(camera);

      if (this.temp.z > 100) {
        label.style.display = "none";
        return;
      }

      label.style.display = "block";

      const x =
        (this.temp.x * 0.5 + 0.5) * window.innerWidth -
        label.textContent!.length * 5;
      const y =
        (-this.temp.y * 0.5 + 0.5) * window.innerHeight -
        (body.radius * AppState.get("radiusScale") * 0.1 + 20);
      label.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  shouldShowLabel(body: CelestialBody, cameraDistance: number) {
    if (body.type === "star") return true;
    const orbitRadius = body.distanceFromParent * AppState.get("distanceScale");
    return (
      cameraDistance < orbitRadius * 20 && cameraDistance > orbitRadius * 0.05
    );
  }

  destroy() {
    this.labels.forEach((label) => label.remove());

    this.labels.clear();
  }
}
