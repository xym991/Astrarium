import * as THREE from "three";
import type { CelestialBodyData } from "../../data";
import { CelestialBody } from "../CelestialBody";
export const textureLoader = new THREE.TextureLoader();
export default function addTextures(body: CelestialBody) {
  const path = `/textures/${body.name.toLowerCase()}`;

  textureLoader.load(
    path + ".jpg",
    (texture) => {
      const material = body.mesh.material as THREE.MeshStandardMaterial;
      texture.wrapS = THREE.RepeatWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;

      if (body.type === "star") {
        material.color.set("#ffffff");
        material.emissiveMap = texture;
      } else {
        material.map = texture;
      }
      material.needsUpdate = true;
    },
    undefined,
    () => {
      console.log(`No texture found for ${body.name}`);
    },
  );

  return function updateTextures() {};
}
