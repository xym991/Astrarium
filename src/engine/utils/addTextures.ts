import * as THREE from "three";
import { CelestialBody } from "../CelestialBody";
import { DDSLoader } from "three/examples/jsm/loaders/DDSLoader.js";

export const textureLoader = new THREE.TextureLoader();
export const ddsLoader = new DDSLoader();

function loadTexture(path: string): Promise<THREE.Texture | null> {
  return new Promise((resolve) => {
    const loader = path.endsWith(".dds") ? ddsLoader : textureLoader;
    loader.load(
      path,

      (texture) => {
        if (!texture.image || !(texture.image as any).width) {
          resolve(null);

          return;
        }

        resolve(texture);
      },

      undefined,

      () => resolve(null),
    );
  });
}

function setupTexture(
  texture: THREE.Texture,
  renderer: THREE.WebGLRenderer,
  srgb = false,
) {
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  // texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  if (srgb) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
}

export default async function addTextures(
  body: CelestialBody,
  renderer: THREE.WebGLRenderer,
) {
  const base = `/textures/${body.name}`;

  const material = body.mesh.material as THREE.MeshStandardMaterial;

  const [color, normalDDS, normalPNG, heightDDS, heightPNG, biome] =
    await Promise.all([
      loadTexture(`${base}Color.dds`),
      loadTexture(`${base}_NRM.dds`),
      loadTexture(`${base}_NRM.png`),
      // null,
      // null,
      loadTexture(`${base}Height.dds`),
      loadTexture(`${base}Height.png`),
      loadTexture(`${base}Biomes.png`),
      // null,
      // null,
      // null,
    ]);

  if (color) {
    setupTexture(color, renderer, true);

    if (body.type === "star") {
      material.map = color;
      material.emissiveMap = color;
      material.emissive.setScalar(1);
      material.toneMapped = false;
    } else {
      material.map = color;
    }
  }

  // const normal = normalDDS ?? normalPNG;

  // if (normal) {
  //   setupTexture(normal, renderer);
  //   material.normalMap = normal;
  //   material.normalScale.set(0.01, 0.01);
  // }

  const height = heightDDS ?? heightPNG;

  if (height) {
    setupTexture(height, renderer);

    material.displacementMap = height;

    material.displacementScale = 0.001;
    material.displacementBias = 0;
  }

  // if (biome) {
  //   setupTexture(biome, renderer);

  //   material.map = biome;
  // }

  material.metalness = 0;
  material.roughness = 1;

  material.needsUpdate = true;

  return function updateTextures() {};
}
