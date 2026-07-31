import * as THREE from "three";
import { CelestialBodyData } from "../data";
import AppState from "../state";
import plugins from "./utils/celestialBodyPlugins";
import shouldShowElement from "./utils/shouldShowElement";
import {
  HighPrecisionLine,
  HighPrecisionLineGeometry,
  HighPrecisionLineMaterial,
} from "three-high-precision-lines";
import calculateOrbitalPosition from "./utils/calculateorbitalPosition";

export type Trail = {
  line: HighPrecisionLine;
  pointsHigh: Float32Array;
  pointsLow: Float32Array;
  index: number;
  length: number;
  count: number;
  distance: THREE.Vector3;
};

export class CelestialBody extends CelestialBodyData {
  static SphereGeometries = [
    new THREE.SphereGeometry(1, 8, 8),
    new THREE.SphereGeometry(1, 16, 16),
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.SphereGeometry(1, 128, 128),
    new THREE.SphereGeometry(1, 256, 256),
  ];
  public static trailMaterial = new HighPrecisionLineMaterial({
    color: new THREE.Color(0xffffff).multiplyScalar(2).convertLinearToSRGB(),
  });
  worldPosition = new THREE.Vector3();

  children: CelestialBody[] = [];
  mesh: THREE.Mesh;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  orbitalPlaneGroup: THREE.Group;
  orbitalGroup: THREE.Group;
  group: THREE.Group;
  tiltGroup: THREE.Group;
  parent: CelestialBody | null = null;
  orbit: HighPrecisionLine;
  trail: Trail;
  orbitGeometries: HighPrecisionLineGeometry[] = [];
  private orbitPeriapsis = 0;
  private orbitApoapsis = 0;
  LOD: number = 0;
  orbitLOD: number = 0;
  postUpdate: (
    camera: THREE.PerspectiveCamera,
    config: { showMoons: boolean; showTrails: boolean; showOrbits: boolean },
  ) => void;

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

    this.orbitalPlaneGroup.rotation.order = "YXZ";
    this.orbitalGroup.rotation.order = "YXZ";

    this.tiltGroup.rotation.z = THREE.MathUtils.degToRad(this.axisTilt);

    this.orbitalPlaneGroup.rotation.y = -THREE.MathUtils.degToRad(
      this.ascendingNode,
    );
    this.orbitalPlaneGroup.rotation.x = THREE.MathUtils.degToRad(
      this.orbitalTilt,
    );
    this.orbitalGroup.rotation.y = -THREE.MathUtils.degToRad(
      this.argumentOfPeriapsis,
    );

    this.parent?.group.add(this.orbitalPlaneGroup);
    this.parent?.children.push(this);

    this.orbitPeriapsis = this.semiMajorAxis * (1 - this.eccentricity);
    this.orbitApoapsis = this.semiMajorAxis * (1 + this.eccentricity);

    this.createOrbitGeometries();
    this.orbit = this.createOrbit();
    if (this.parent && this.semiMajorAxis > 0) {
      this.orbitalGroup.add(this.orbit);
      this.orbit.userData = this;
    }

    this.trail = this.createTrail();

    this.postUpdate = (() => {
      let pluginUpdate = plugins[this.name.toLowerCase()]?.(this);

      return (
        camera: THREE.PerspectiveCamera,
        { showMoons, showTrails, showOrbits },
      ) => {
        pluginUpdate?.(this);

        const distanceSq = camera.position.distanceToSquared(
          this.worldPosition,
        );

        if (this.type === "moon") {
          if (showMoons) {
            this.orbitalGroup.visible = true;
            this.trail.line.visible = true;
          } else {
            this.orbitalGroup.visible = false;
            this.trail.line.visible = false;
            return;
          }
        }

        if (showTrails) {
          this.trail.line.visible =
            this.type == "moon"
              ? shouldShowElement(this, distanceSq, 15, 20)
              : shouldShowElement(this, distanceSq, 15, 0);
        } else {
          this.trail.line.visible = false;
        }
        if (showOrbits) {
          this.orbit.visible =
            this.type == "moon"
              ? shouldShowElement(this, distanceSq, 15, 20)
              : shouldShowElement(this, distanceSq, 15, 0);
        } else {
          this.orbit.visible = false;
        }
      };
    })();

    const distanceScale = AppState.get("distanceScale");
    this.setBodyScale(distanceScale);
    this.setOrbitScale(distanceScale);
  }

  private createOrbitGeometries() {
    const a = 1;
    const e = this.eccentricity;
    const b = a * Math.sqrt(1 - e * e);

    for (let lod = 0; lod < 7; lod++) {
      const segments = 256 << lod;
      const positions: number[] = [];

      for (let i = 0; i <= segments; i++) {
        const E = (i / segments) * Math.PI * 2;
        positions.push(a * (Math.cos(E) - e), 0, b * Math.sin(E));
      }

      this.orbitGeometries.push(
        new HighPrecisionLineGeometry({
          positions,
        }),
      );
    }
  }

  private createOrbit() {
    const geometry = this.orbitGeometries[this.orbitLOD];

    const material = new HighPrecisionLineMaterial({
      color: new THREE.Color(this.type === "planet" ? this.color : 0x555555)
        .multiplyScalar(15)
        .convertLinearToSRGB(),
      transparent: true,
      opacity: 0.8,
    });

    return new HighPrecisionLine(geometry, material);
  }

  createTrail() {
    let length = 0;
    switch (this.type) {
      case "star":
        length = 1000;
        break;
      case "dwarf":
      case "planet":
        length = 600;
        break;
      case "moon":
        length = 200;
        break;
    }

    let pointsHigh = new Float32Array(length * 3 * 2);
    let pointsLow = new Float32Array(length * 3 * 2);

    let line = new HighPrecisionLine(
      new HighPrecisionLineGeometry({
        positionsHigh: pointsHigh,
        positionsLow: pointsLow,
      }),
      CelestialBody.trailMaterial,
    );

    if (this.type === "star") {
      line.frustumCulled = false;
    }

    return {
      line,
      pointsHigh,
      pointsLow,
      index: length,
      length,
      count: 0,
      distance: new THREE.Vector3(),
    };
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

  updateTrail() {
    if (!this.trail) return;

    const trail = this.trail;

    const high = trail.pointsHigh;
    const low = trail.pointsLow;

    const pos = this.worldPosition;

    if (
      Math.abs(pos.x - trail.distance.x) < 0.0001 &&
      Math.abs(pos.y - trail.distance.y) < 0.0001 &&
      Math.abs(pos.z - trail.distance.z) < 0.0001
    ) {
      return;
    }

    trail.distance.copy(pos);

    let i = trail.index * 3;
    let _i = (trail.index - trail.length) * 3;

    let hx = Math.fround(pos.x);
    let hy = Math.fround(pos.y);
    let hz = Math.fround(pos.z);
    let lx = pos.x - hx;
    let ly = pos.y - hy;
    let lz = pos.z - hz;

    high[i] = hx;
    high[i + 1] = hy;
    high[i + 2] = hz;
    high[_i] = hx;
    high[_i + 1] = hy;
    high[_i + 2] = hz;

    low[i] = lx;
    low[i + 1] = ly;
    low[i + 2] = lz;
    low[_i] = lx;
    low[_i + 1] = ly;
    low[_i + 2] = lz;

    if (trail.count < trail.length) trail.count++;

    trail.line.geometry.setDrawRange(
      trail.index - trail.count + 11,
      (trail.count || 10) - 10,
    );

    trail.line.geometry.attributes.positionHigh.needsUpdate = true;
    trail.line.geometry.attributes.positionLow.needsUpdate = true;

    trail.index++;
    if (trail.index >= trail.length * 2) trail.index = trail.length;
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
    const geometry = CelestialBody.SphereGeometries[this.LOD];
    let material;
    if (this.type === "star") {
      material = new THREE.MeshStandardMaterial({
        emissive: this.color,
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

  updatePosition(time: number) {
    const distanceScale = AppState.get("distanceScale");

    //rotation
    const angle = (time / this.rotationPeriod) * Math.PI * 2;
    this.mesh.rotation.y = angle;

    //revolution
    calculateOrbitalPosition({
      body: this,
      distanceScale,
      time,
      target: this.group.position,
    });
  }

  updateLOD(
    camera: THREE.PerspectiveCamera,
    distanceScale: number,
    focalLength: number,
  ) {
    const distanceSq = camera.position.distanceToSquared(this.worldPosition);

    const projectedRadius =
      (this.radius * distanceScale * focalLength) / Math.sqrt(distanceSq);

    let LOD = Math.min(
      Math.floor(
        (projectedRadius / 30) * CelestialBody.SphereGeometries.length,
      ),
      CelestialBody.SphereGeometries.length - 1,
    );

    if (this.LOD !== LOD) {
      this.mesh.geometry = CelestialBody.SphereGeometries[LOD];
    }
    this.LOD = LOD;

    if (!this.parent) return;

    const orbitCenter = this.parent.worldPosition;

    const cameraDistance = camera.position.distanceTo(orbitCenter);

    const periapsis = this.orbitPeriapsis * distanceScale;
    const apoapsis = this.orbitApoapsis * distanceScale;

    let distanceFromBand = 0;

    if (cameraDistance < periapsis) {
      distanceFromBand = periapsis - cameraDistance;
    } else if (cameraDistance > apoapsis) {
      distanceFromBand = cameraDistance - apoapsis;
    }

    let orbitLOD = 6;

    if (distanceFromBand > 30) {
      orbitLOD = Math.max(
        0,
        Math.min(6, 6 - Math.floor(Math.log2((distanceFromBand - 30) / 8 + 1))),
      );
    }

    if (this.orbitLOD !== orbitLOD) {
      this.orbit.geometry = this.orbitGeometries[orbitLOD];
      this.orbitLOD = orbitLOD;
    }
  }
}
