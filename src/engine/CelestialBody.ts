import * as THREE from "three";
import { CelestialBodyData } from "../data";
import addTextures from "./utils/addTextures";
import AppState from "../state";
import createOrbit from "./utils/createOrbit";
import { Line2 } from "three/addons/lines/Line2.js";
import createTrail, { type Trail } from "./utils/createTrail";
import plugins from "./utils/celestialBodyPlugins";

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
  trail: Trail | null;
  // additionalProps: Record<string, unknown> = {};
  customUpdate?: () => void;

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
    if (plugins[this.name.toLowerCase()]) {
      let updatefn = plugins[this.name.toLowerCase()]?.(this);
      if (updatefn) {
        this.customUpdate = updatefn;
      }
    }
  }
  setBodyScale(radiusScale: number) {
    let scale = radiusScale * this.radius;
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
    const geometry = CelestialBody.sphereGeometry;
    let material;
    if (this.name === "Sun") {
      material = new THREE.MeshStandardMaterial({
        emissive: this.color,
        // emissive: "#ffffff",
        emissiveIntensity: 20,
        // metalness: 1,
        // roughness: 1,
        // color: "#FFD27D",
        // color: "#ff0000",
      });
    } else {
      material = new THREE.MeshStandardMaterial({
        // color: this.color || "#FFFFFF",
        // color: "#ffffff",
        roughness: 1,
        metalness: 0,
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    return [mesh, geometry, material];
  }
}
