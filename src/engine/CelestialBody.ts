import * as THREE from "three";
import { CelestialBodyData } from "../data";
import addTextures from "./utils/addTextures";
import AppState from "../state";
import createOrbit from "./utils/createOrbit";
import { Line2 } from "three/addons/lines/Line2.js";

export class CelestialBody extends CelestialBodyData {
  children: CelestialBody[] = [];
  mesh: THREE.Mesh;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  group: THREE.Group;
  parent: CelestialBody | null = null;
  orbit: Line2;

  constructor(props: CelestialBodyData, parent: CelestialBody | null = null) {
    super(props);
    this.parent = parent;
    const [mesh, geometry, material] = createCelestialBodyMesh(this);
    this.mesh = mesh;
    this.mesh.userData = this;
    this.geometry = geometry;
    this.material = material;
    this.group = new THREE.Group();
    this.group.position.set(
      this.distanceFromParent * AppState.get("distanceScale"),
      0,
      0,
    );
    this.group.add(this.mesh);
    this.orbit = createOrbit(this.color);
    // this.orbit.rotation.z = Math.random() * 0.05;
    if (this.parent && this.distanceFromParent > 0) {
      this.parent.group.add(this.orbit);
      this.orbit.userData = this;
    }
  }
  setScale(scale: number) {
    this.mesh.scale.set(scale, scale, scale);
    if (this.parent && this.distanceFromParent > 0) {
      this.orbit.scale.setScalar(
        this.distanceFromParent * AppState.get("distanceScale"),
      );
    }
  }
}

function createCelestialBodyMesh(
  body: CelestialBodyData,
): [THREE.Mesh, THREE.BufferGeometry, THREE.Material] {
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  let material: THREE.MeshStandardMaterial;
  if (body.name === "Sun") {
    material = new THREE.MeshStandardMaterial({
      emissive: "#FFffff",

      emissiveIntensity: 8,
    });
    // material = new THREE.MeshStandardMaterial({
    //   emissive: "#FFd4a6",

    //   emissiveIntensity: 4,
    // });
    // sunMaterial.emissive.set("#ffffff");

    // sunMaterial.emissiveIntensity = 10;
  } else {
    material = new THREE.MeshStandardMaterial({
      color: body.color || "#FFFFFF",
      roughness: 1,
      metalness: 0,
    });
  }
  // addTextures(body, material);

  const mesh = new THREE.Mesh(geometry, material);
  // const axisHelper = new THREE.AxesHelper(3);
  // mesh.add(axisHelper);
  mesh.position.set(0, 0, 0);
  return [mesh, geometry, material];
}
