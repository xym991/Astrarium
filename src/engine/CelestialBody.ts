import * as THREE from "three";
import { CelestialBodyData } from "../data";
import addTextures from "./utils/addTextures";
import AppState from "../state";

export class CelestialBody extends CelestialBodyData {
  children: CelestialBody[] = [];
  mesh: THREE.Mesh;
  group: THREE.Group;
  parent: CelestialBody | null = null;

  constructor(props: CelestialBodyData, parent: CelestialBody | null = null) {
    super(props);
    this.parent = parent;
    this.mesh = createCelestialBodyMesh(this);
    this.group = new THREE.Group();
    this.group.position.set(
      this.distanceFromParent * AppState.get("distanceScale"),
      0,
      0,
    );
    this.group.add(this.mesh);
  }
}

function createCelestialBodyMesh(body: CelestialBodyData): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(
    body.radius * AppState.get("radiusScale"),
    64,
    64,
  );
  let material: THREE.MeshStandardMaterial;
  if (body.name === "Sun") {
    material = new THREE.MeshStandardMaterial({
      emissive: "#FFc496",

      emissiveIntensity: 2,
    });
  } else {
    material = new THREE.MeshStandardMaterial({
      color: body.color || "#FFFFFF",
      roughness: 1,
      metalness: 0,
    });
  }
  addTextures(body, material);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  return mesh;
}
