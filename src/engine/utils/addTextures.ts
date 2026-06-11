import * as THREE from "three";
import type { CelestialBodyData } from "../../data";
import { CelestialBody } from "../CelestialBody";
export const textureLoader = new THREE.TextureLoader();
export default function addTextures(body: CelestialBody) {
  const path = `/textures/${body.name.toLowerCase()}`;

  textureLoader.load(
    path + ".png",
    (texture) => {
      const material = body.mesh.material as THREE.MeshStandardMaterial;
      texture.wrapS = THREE.RepeatWrapping;
      material.map = texture;
      material.color.set(body.color);
      material.color = material.color.multiplyScalar(0.5);
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
