import { CelestialBody } from "../CelestialBody";
import * as THREE from "three";
import { textureLoader } from "./addTextures";

export interface CelestialBodyPlugins {
  [key: string]: (
    body: CelestialBody,
  ) => ((body: CelestialBody) => void) | void;
}

export default {
  saturn: (body: CelestialBody) => {
    let shader: any = null;

    const sunDir = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    const inverseQuat = new THREE.Quaternion();

    let LOD = body.LOD;
    const inner = 1.15;
    const outer = 2.4;
    const RingGeometries = [
      new THREE.RingGeometry(inner, outer, 16),
      new THREE.RingGeometry(inner, outer, 32),
      new THREE.RingGeometry(inner, outer, 64),
      new THREE.RingGeometry(inner, outer, 128),
      new THREE.RingGeometry(inner, outer, 256),
    ];

    for (let geometry of RingGeometries) {
      const pos = geometry.attributes.position;
      const uv = geometry.attributes.uv;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const r = Math.sqrt(x * x + y * y);
        const t = (r - inner) / (outer - inner);
        uv.setXY(i, t, 0.5);
      }

      uv.needsUpdate = true;
    }

    let ring: THREE.Mesh | null = null;

    textureLoader.load(
      "/textures/saturn_ring.png",

      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const material = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: true,
          depthTest: true,
          emissive: 0xffffff,
          emissiveIntensity: 0.1,
        });

        material.color.setScalar(5);

        material.onBeforeCompile = (_shader) => {
          shader = _shader;

          shader.uniforms.sunDirection = {
            value: new THREE.Vector3(1, 0, 0),
          };

          shader.vertexShader =
            `
            varying vec3 vLocalPos;
            ` +
            shader.vertexShader.replace(
              "#include <begin_vertex>",
              `
              #include <begin_vertex>
           vLocalPos = vec3(
                    -position.x,
                    -position.z,
                    -position.y
                    );
              `,
            );

          shader.fragmentShader =
            `
            varying vec3 vLocalPos;
            uniform vec3 sunDirection;
            ` +
            shader.fragmentShader.replace(
              "#include <dithering_fragment>",
              `
              float d = dot(vLocalPos, sunDirection);
              vec3 closest =
                vLocalPos - sunDirection * d;
              float shadow =
                step(length(closest), 1.0) *
                step(0.0, d);
              gl_FragColor.rgb *=
                mix(1.0, 0.35, shadow);
              #include <dithering_fragment>
              `,
            );
        };

        ring = new THREE.Mesh(RingGeometries[LOD], material);
        ring.rotation.x = Math.PI / 2;
        body.tiltGroup.add(ring);
      },

      undefined,

      () => {
        console.log("No Saturn ring texture");
      },
    );

    return (body) => {
      if (!shader || !ring) return;
      if (LOD !== body.LOD) {
        ring.geometry = RingGeometries[body.LOD];
        LOD = body.LOD;
      }

      sunDir
        .copy(body.parent!.worldPosition)
        .sub(body.worldPosition)
        .normalize();

      body.tiltGroup.getWorldQuaternion(worldQuat);

      inverseQuat.copy(worldQuat).invert();

      sunDir.applyQuaternion(inverseQuat);

      shader.uniforms.sunDirection.value.copy(sunDir);
    };
  },
  earth: (body: CelestialBody) => {
    let atmosphere: THREE.Mesh | null = null;

    createAtmosphere(body, "/textures/earth_atmosphere.jpg", 1.001, (mesh) => {
      (mesh.material as THREE.MeshStandardMaterial).opacity = 0.9;
      atmosphere = mesh;
      atmosphere.userData = body;
    });

    let lastPlanetRotation = body.mesh.rotation.y;
    const atmosphereFactor = 0.05;
    let LOD = body.LOD;

    return (body) => {
      if (!atmosphere) return;
      const currentRotation = body.mesh.rotation.y;
      const delta = currentRotation - lastPlanetRotation;
      atmosphere.rotation.y += delta * atmosphereFactor;
      lastPlanetRotation = currentRotation;

      if (LOD !== body.LOD) {
        atmosphere.geometry = CelestialBody.SphereGeometries[body.LOD];
        LOD = body.LOD;
      }
    };
  },
  venus: (body: CelestialBody) => {
    let atmosphere: THREE.Mesh | null = null;

    createAtmosphere(body, "/textures/venus_atmosphere.jpg", 1.01, (mesh) => {
      (mesh.material as THREE.MeshStandardMaterial).opacity = 1.2;
      atmosphere = mesh;
      atmosphere.userData = body;
    });

    let lastPlanetRotation = body.mesh.rotation.y;
    const atmosphereFactor = 60;
    let LOD = body.LOD;

    return (body) => {
      if (!atmosphere) return;
      const currentRotation = body.mesh.rotation.y;
      const delta = currentRotation - lastPlanetRotation;
      atmosphere.rotation.y += delta * atmosphereFactor;
      lastPlanetRotation = currentRotation;

      if (LOD !== body.LOD) {
        atmosphere.geometry = CelestialBody.SphereGeometries[body.LOD];
        LOD = body.LOD;
      }
    };
  },
} as CelestialBodyPlugins;

function createAtmosphere(
  body: CelestialBody,
  texturePath: string,
  scale: number,
  onReady?: (mesh: THREE.Mesh) => void,
) {
  textureLoader.load(texturePath, (texture) => {
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const atmosphere = new THREE.Mesh(
      CelestialBody.SphereGeometries[body.LOD],

      new THREE.MeshStandardMaterial({
        map: texture,
        alphaMap: texture,
        transparent: true,
        depthWrite: false,
      }),
    );

    atmosphere.scale.setScalar(scale);
    body.mesh.add(atmosphere);
    onReady?.(atmosphere);
  });
}
