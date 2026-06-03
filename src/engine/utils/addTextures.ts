import * as THREE from "three";
import type { CelestialBodyData } from "../data";
export const textureLoader = new THREE.TextureLoader();
export default function addTextures(
  body: CelestialBodyData,
  material: THREE.MeshStandardMaterial,
) {
  const path = `/textures/${body.name.toLowerCase()}.png`;
  console.log(`Loading texture for ${body.name} from ${path}`);
  const texture = textureLoader.load(path);
  console.log(`Texture for ${body.name} loaded:`, texture.id);
  material.map = texture;
  material.emissiveMap = texture;
  //   material.aoMap = texture;
  //   material.displacementMap = texture;
  material.displacementScale = 0.01;
}
