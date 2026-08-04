import * as THREE from "three";
import type InputController from "../Input/inputController";
import type Clock from "../clock";
import type { CelestialBody } from "../CelestialBody";
export default class MovementController {
  constructor(
    camera: THREE.PerspectiveCamera,
    inputController: InputController,
    body: CelestialBody,
  ) {}

  update(
    camera: THREE.PerspectiveCamera,
    clock: Clock,
    input: InputController,
  ): void {}

  exit(inputController: InputController): void {}
}
