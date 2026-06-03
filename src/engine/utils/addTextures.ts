import * as THREE from "three";
import type { CelestialBodyData } from "../../data";
export const textureLoader = new THREE.TextureLoader();
export default function addTextures(
  body: CelestialBodyData,
  material: THREE.MeshStandardMaterial,
) {
  const path = `/textures/${body.name.toLowerCase()}.png`;

  textureLoader.load(
    path,
    (texture) => {
      material.map = texture;
      if (body.type === "star") {
        material.emissiveMap = texture;
      }
      material.needsUpdate = true;
    },
    undefined,
    () => {
      console.log(`No texture found for ${body.name}`);
    },
  );
}
