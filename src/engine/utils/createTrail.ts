import type { CelestialBody } from "../CelestialBody";
import * as THREE from "three";

export type Trail = {
  line: any;
  pointsHigh: Float32Array;
  pointsLow: Float32Array;
  index: number;
  length: number;
  count: number;
  material: THREE.ShaderMaterial;
};

export default function createTrail(length: number): Trail {
  if (!length) throw new Error("Trail length must be greater than 0");
  let geometry = new THREE.BufferGeometry();

  let pointsHigh = new Float32Array(length * 3 * 2);
  let pointsLow = new Float32Array(length * 3 * 2);

  geometry.setAttribute(
    "positionHigh",
    new THREE.BufferAttribute(pointsHigh, 3).setUsage(THREE.DynamicDrawUsage),
  );
  geometry.setAttribute(
    "positionLow",
    new THREE.BufferAttribute(pointsLow, 3).setUsage(THREE.DynamicDrawUsage),
  );
  const material = new THREE.ShaderMaterial({
    uniforms: {
      cameraHigh: {
        value: new THREE.Vector3(),
      },
      cameraLow: {
        value: new THREE.Vector3(),
      },
      rotation: {
        value: new THREE.Matrix4(),
      },
    },
    vertexShader: `
    attribute vec3 positionHigh;
    attribute vec3 positionLow;

    uniform vec3 cameraHigh;
    uniform vec3 cameraLow;

    uniform mat4 rotation;

    void main() {
      vec3 relative = (positionHigh - cameraHigh) + (positionLow - cameraLow);
      vec4 clipPos = projectionMatrix * rotation * vec4(relative, 1.0);
      // clipPos.xy += vec2(0.01, 0.01) * clipPos.w;
      gl_Position = clipPos;
    }
  `,
    fragmentShader: `
    void main() {
      gl_FragColor = vec4(3.0,3.0,3.0,1.0);
    }
  `,
  });
  material.toneMapped = false;
  const line = new THREE.Line(geometry, material);

  return {
    line,
    pointsHigh,
    pointsLow,
    index: length,
    length,
    count: 0,
    material,
  };
}
