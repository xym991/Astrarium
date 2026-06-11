import * as THREE from "three";
import { CelestialBodyData } from "../data";
import addTextures from "./utils/addTextures";
import AppState from "../state";
import createOrbit from "./utils/createOrbit";
import { Line2 } from "three/addons/lines/Line2.js";
import createTrail, { type Trail } from "./utils/createTrail";

export class CelestialBody extends CelestialBodyData {
  children: CelestialBody[] = [];
  mesh: THREE.Mesh;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  group: THREE.Group;
  tiltGroup: THREE.Group;
  parent: CelestialBody | null = null;
  orbit: Line2;
  trail: Trail | null;
  private tempVector = new THREE.Vector3();
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
    this.group.position.set(
      this.semiMajorAxis * AppState.get("distanceScale"),
      0,
      0,
    );
    this.tiltGroup.rotation.z = THREE.MathUtils.degToRad(this.axisTilt);
    this.tiltGroup.add(this.mesh);
    this.group.add(this.tiltGroup);
    this.orbit = createOrbit(
      this.eccentricity,
      this.orbitalTilt,
      this.type === "planet" ? this.color : 0x999999,
    );
    if (this.parent && this.semiMajorAxis > 0) {
      this.parent.group.add(this.orbit);
      this.orbit.userData = this;
    }

    // if (this.type !== "moon") this.trail = createTrail(5000);

    this.trail = createTrail(
      this.type === "moon"
        ? 2000
        : this.type === "planet"
          ? 10000
          : this.type === "star"
            ? 30000
            : this.type === "dwarf"
              ? 6000
              : 0,
    );
    // this.trail.line.frustumCulled = false;
  }
  setBodyScale(radiusScale: number) {
    let scale = radiusScale * this.radius;
    this.mesh.scale.set(scale, scale, scale);
  }
  setOrbitScale(distanceScale: number) {
    if (this.parent && this.semiMajorAxis > 0) {
      this.orbit.scale.setScalar(this.semiMajorAxis * distanceScale);
    }
  }

  updateTrail(camera: THREE.PerspectiveCamera) {
    if (!this.trail) return;
    const pos = this.group.getWorldPosition(this.tempVector);
    let i = this.trail.index * 3;
    let _i = (this.trail.index - this.trail.length) * 3;
    this.trail.points[i] = pos.x;
    this.trail.points[i + 1] = pos.y;
    this.trail.points[i + 2] = pos.z;
    this.trail.points[_i] = pos.x;
    this.trail.points[_i + 1] = pos.y;
    this.trail.points[_i + 2] = pos.z;

    if (this.trail.count < this.trail.length) this.trail.count++;

    this.trail.line.geometry.setDrawRange(
      this.trail.index - this.trail.count + 11,
      (this.trail.count || 10) - 10,
    );

    this.trail.line.geometry.attributes.position.needsUpdate = true;
    this.trail.index++;
    if (this.trail.index >= this.trail.length * 2)
      this.trail.index = this.trail.length;
    if (this.type === "moon") {
      this.trail.line.visible = this.shouldShowTrail(camera);
    }
  }

  resetTrail() {
    if (!this.trail) return;
    this.trail.count = 0;
  }

  private shouldShowTrail(camera: THREE.PerspectiveCamera) {
    const distance = camera.position.distanceTo(
      this.mesh.getWorldPosition(this.tempVector),
    );
    return distance < this.semiMajorAxis / (10 ** 3 * 5);
  }

  private createCelestialBodyMesh(): [
    THREE.Mesh,
    THREE.BufferGeometry,
    THREE.Material,
  ] {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    let material: THREE.MeshStandardMaterial;
    if (this.name === "Sun") {
      material = new THREE.MeshStandardMaterial({
        emissive: "#FFffff",

        emissiveIntensity: 8,
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        color: this.color || "#FFFFFF",
        roughness: 1,
        metalness: 0,
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    return [mesh, geometry, material];
  }
}
