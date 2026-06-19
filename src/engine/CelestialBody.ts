import * as THREE from "three";
import { CelestialBodyData } from "../data";
import addTextures from "./utils/addTextures";
import AppState from "../state";
import createOrbit from "./utils/createOrbit";
import { Line2 } from "three/addons/lines/Line2.js";
import createTrail, { type Trail } from "./utils/createTrail";
import plugins from "./utils/celestialBodyPlugins";
import shouldShowElement from "./utils/shouldShowElement";
import { splitVector3 } from "./utils/splitVector3";
import splitDouble from "./utils/splitDouble";

export class CelestialBody extends CelestialBodyData {
  private static sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
  children: CelestialBody[] = [];
  mesh: THREE.Mesh;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;

  orbitalPlaneGroup: THREE.Group;
  orbitalGroup: THREE.Group;
  group: THREE.Group;
  tiltGroup: THREE.Group;

  parent: CelestialBody | null = null;
  orbit: Line2;
  trail: Trail;
  postUpdate: (camera: THREE.PerspectiveCamera) => void;

  private tempVector = new THREE.Vector3();
  private tempMatrix = new THREE.Matrix4();
  private cameraHigh = new THREE.Vector3();
  private cameraLow = new THREE.Vector3();

  constructor(props: CelestialBodyData, parent: CelestialBody | null = null) {
    super(props);
    this.parent = parent;
    const [mesh, geometry, material] = this.createCelestialBodyMesh();
    this.mesh = mesh;
    this.mesh.userData = this;

    this.geometry = geometry;
    this.material = material;

    this.group = new THREE.Group();
    this.tiltGroup = new THREE.Group();
    this.orbitalGroup = new THREE.Group();
    this.orbitalPlaneGroup = new THREE.Group();

    this.tiltGroup.add(this.mesh);
    this.group.add(this.tiltGroup);
    this.orbitalGroup.add(this.group);
    this.orbitalPlaneGroup.add(this.orbitalGroup);

    this.group.position.set(
      this.semiMajorAxis * AppState.get("distanceScale"),
      0,
      0,
    );
    this.tiltGroup.rotation.z = THREE.MathUtils.degToRad(this.axisTilt);
    this.orbitalGroup.rotation.y = THREE.MathUtils.degToRad(
      this.argumentOfPeriapsis,
    );
    this.orbitalPlaneGroup.rotation.y = THREE.MathUtils.degToRad(
      this.ascendingNode,
    );
    this.orbitalPlaneGroup.rotation.x = THREE.MathUtils.degToRad(
      this.orbitalTilt,
    );

    this.parent?.group.add(this.orbitalPlaneGroup);
    this.parent?.children.push(this);

    this.orbit = createOrbit(
      this.eccentricity,
      this.type === "planet" ? this.color : 0x555555,
    );
    if (this.parent && this.semiMajorAxis > 0) {
      this.orbitalGroup.add(this.orbit);
      this.orbit.userData = this;
    }

    this.trail = createTrail(
      this.type === "moon"
        ? 1000
        : this.type === "planet"
          ? 5000
          : this.type === "star"
            ? 10000
            : this.type === "dwarf"
              ? 5000
              : 0,
    );
    this.trail.line.frustumCulled = false;

    this.postUpdate = (() => {
      let pluginUpdate = plugins[this.name.toLowerCase()]?.(this);

      return (camera: THREE.PerspectiveCamera) => {
        pluginUpdate?.();

        const distance = camera.position.distanceTo(
          this.mesh.getWorldPosition(this.tempVector),
        );

        this.trail.line.visible =
          this.type == "moon"
            ? shouldShowElement(this, distance, 15, 20)
            : shouldShowElement(this, distance, 15, 0);
        this.orbit.visible =
          this.type == "moon"
            ? shouldShowElement(this, distance, 100, 20)
            : shouldShowElement(this, distance, 100, 0);
      };
    })();
  }
  setBodyScale(distanceScale: number) {
    let scale = distanceScale * this.radius;
    this.tiltGroup.scale.set(scale, scale, scale);
    this.mesh.scale.set(
      this.shapeScale[0],
      this.shapeScale[1],
      this.shapeScale[2],
    );
  }
  setOrbitScale(distanceScale: number) {
    if (this.parent && this.semiMajorAxis > 0) {
      this.orbit.scale.setScalar(this.semiMajorAxis * distanceScale);
    }
  }

  updateTrail(camera: THREE.PerspectiveCamera) {
    if (!this.trail) return;
    this.trail.line.material.setCamera(camera);

    const pos = this.group.getWorldPosition(this.tempVector);
    if (
      Math.abs(
        pos.x -
          this.trail.distance.x +
          pos.y -
          this.trail.distance.y +
          pos.z -
          this.trail.distance.z,
      ) < 0.01
    ) {
      return;
    }

    this.trail.distance.copy(pos);

    let i = this.trail.index * 3;
    let _i = (this.trail.index - this.trail.length) * 3;
    let { x, y, z } = pos;
    let [hx, lx] = splitDouble(x);
    let [hy, ly] = splitDouble(y);
    let [hz, lz] = splitDouble(z);

    this.trail.pointsHigh[i] = hx;
    this.trail.pointsHigh[i + 1] = hy;
    this.trail.pointsHigh[i + 2] = hz;
    this.trail.pointsHigh[_i] = hx;
    this.trail.pointsHigh[_i + 1] = hy;
    this.trail.pointsHigh[_i + 2] = hz;

    this.trail.pointsLow[i] = lx;
    this.trail.pointsLow[i + 1] = ly;
    this.trail.pointsLow[i + 2] = lz;
    this.trail.pointsLow[_i] = lx;
    this.trail.pointsLow[_i + 1] = ly;
    this.trail.pointsLow[_i + 2] = lz;

    if (this.trail.count < this.trail.length) this.trail.count++;

    this.trail.line.geometry.setDrawRange(
      this.trail.index - this.trail.count + 11,
      (this.trail.count || 10) - 10,
    );

    this.trail.line.geometry.attributes.positionHigh.needsUpdate = true;
    this.trail.line.geometry.attributes.positionLow.needsUpdate = true;

    this.trail.index++;
    if (this.trail.index >= this.trail.length * 2)
      this.trail.index = this.trail.length;
  }

  resetTrail() {
    if (!this.trail) return;
    this.trail.count = 0;
  }

  private createCelestialBodyMesh(): [
    THREE.Mesh,
    THREE.BufferGeometry,
    THREE.Material,
  ] {
    const geometry = CelestialBody.sphereGeometry;
    let material;
    if (this.name === "Sun") {
      material = new THREE.MeshStandardMaterial({
        emissive: this.color,
        // emissive: "#ffffff",
        emissiveIntensity: 20,
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 0,
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    return [mesh, geometry, material];
  }
}
