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
  textureLoader.load(
    path + "_atmosphere.jpg",
    (texture) => {
      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),

        new THREE.MeshStandardMaterial({
          map: texture,
          alphaMap: texture,
          transparent: true,
          depthWrite: false,
        }),
      );

      atmosphere.scale.setScalar(1.01);

      atmosphere.userData = body;

      body.mesh.add(atmosphere);
    },
    undefined,
    () => {
      console.log(`No atmosphere texture found for ${body.name}`);
    },
  );
  textureLoader.load(
    path + "_ring.png",

    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.3, 2.4, 256),

        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );

      ring.rotation.x = Math.PI / 2;
      ring.userData = body;
      body.tiltGroup.add(ring);
    },

    undefined,

    () => {
      console.log(`No ring texture found for ${body.name}`);
    },
  );
}
