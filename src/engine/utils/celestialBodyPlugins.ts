import type { CelestialBody } from "../CelestialBody";
import * as THREE from "three";
import { textureLoader } from "./addTextures";

export interface CelestialBodyPlugins {
  [key: string]: (body: CelestialBody) => (() => void) | void;
}

export default {
  saturn: (body: CelestialBody) => {
    let shader: any = null;

    const bodyPos = new THREE.Vector3();
    const sunPos = new THREE.Vector3();
    const sunDir = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    const inverseQuat = new THREE.Quaternion();

    let root = body;

    while (root.parent) {
      root = root.parent;
    }

    const sun = root;

    textureLoader.load(
      "/textures/saturn_ring.png",

      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        const inner = 1.15;
        const outer = 2.4;
        const geometry = new THREE.RingGeometry(inner, outer, 256);

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

        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2;
        body.tiltGroup.add(ring);
      },

      undefined,

      () => {
        console.log("No Saturn ring texture");
      },
    );

    return () => {
      if (!shader) return;

      body.group.getWorldPosition(bodyPos);
      sun.group.getWorldPosition(sunPos);

      sunDir.copy(sunPos).sub(bodyPos).normalize();

      body.tiltGroup.getWorldQuaternion(worldQuat);

      inverseQuat.copy(worldQuat).invert();

      sunDir.applyQuaternion(inverseQuat);

      shader.uniforms.sunDirection.value.copy(sunDir.normalize());
    };
  },
  earth: (body: CelestialBody) => {
    let atmosphere: THREE.Mesh | null = null;

    createAtmosphere(body, "/textures/earth_atmosphere.jpg", 1.01, (mesh) => {
      atmosphere = mesh;
      atmosphere.userData = body;
    });

    let lastPlanetRotation = body.mesh.rotation.y;
    const atmosphereFactor = 0.05;

    return () => {
      if (!atmosphere) return;
      const currentRotation = body.mesh.rotation.y;
      const delta = currentRotation - lastPlanetRotation;
      atmosphere.rotation.y += delta * atmosphereFactor;
      lastPlanetRotation = currentRotation;
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

    return () => {
      if (!atmosphere) return;
      const currentRotation = body.mesh.rotation.y;
      const delta = currentRotation - lastPlanetRotation;
      atmosphere.rotation.y += delta * atmosphereFactor;
      lastPlanetRotation = currentRotation;
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
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),

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
