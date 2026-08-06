import * as THREE from "three";
import AppState from "../../state";
import { DISTANCE_SCALE, SIMULATION_RADIUS } from "../../data/constants";

export interface Starfield {
  points: THREE.Points;
  update(camera: THREE.Camera): void;
}

// const STAR_RANGES = [
//   { weight: 0.015, min: 30000, max: 45000, size: [1.3, 2.5] },
//   { weight: 0.04, min: 10000, max: 30000, size: [1.2, 2.5] },
//   { weight: 0.08, min: 7500, max: 10000, size: [1.1, 2.3] },
//   { weight: 0.11, min: 6000, max: 7500, size: [1.1, 2.3] },
//   { weight: 0.17, min: 5200, max: 6000, size: [1.0, 2.1] },
//   { weight: 0.17, min: 3700, max: 5200, size: [1.0, 1.9] },
//   { weight: 0.13, min: 2400, max: 3700, size: [1.0, 1.6] },
// ] as const;
const STAR_RANGES = [
  { weight: 0.03, min: 30000, max: 45000, size: [1.3, 2.5] }, // O
  { weight: 0.08, min: 10000, max: 30000, size: [1.2, 2.5] }, // B
  { weight: 0.1, min: 7500, max: 10000, size: [1.1, 2.3] }, // A
  { weight: 0.13, min: 6000, max: 7500, size: [1.1, 2.3] }, // F
  { weight: 0.2, min: 5200, max: 6000, size: [1.0, 2.1] }, // G
  { weight: 0.18, min: 3700, max: 5200, size: [1.0, 1.9] }, // K
  { weight: 0.2, min: 2400, max: 3700, size: [1.0, 1.6] }, // M
] as const;

const vertexShader = `
uniform float uPixelRatio;

attribute float size;
attribute float intensity;

varying vec3 vColor;
varying float vIntensity;

void main() {
  vColor = color;
  vIntensity = intensity;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  gl_PointSize = max(min(size * 2.0, uPixelRatio * 3.0) , uPixelRatio);
}
`;

const fragmentShader = `
varying vec3 vColor;
varying float vIntensity;

uniform float uPixelRatio;

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(p, p);

  if (r2 > 1.0) discard;

  float alpha = exp(-r2 * (6.5 - (uPixelRatio * 2.5)));

  float brightness = sqrt(vIntensity);

  gl_FragColor = vec4(vColor * brightness, alpha);
}
`;

function randomDirection() {
  const theta = Math.random() * Math.PI * 2.0;
  const phi = Math.acos(Math.random() * 2.0 - 1.0);
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  );
}

function chooseStarRange() {
  const r = Math.random();

  let sum = 0;

  for (const range of STAR_RANGES) {
    sum += range.weight;

    if (r <= sum) return range;
  }

  return STAR_RANGES[STAR_RANGES.length - 1];
}

function kelvinToColor(kelvin: number, target = new THREE.Color()) {
  const temp = kelvin / 100;

  let r: number;
  let g: number;
  let b: number;

  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;

    if (temp <= 19) {
      b = 0;
    } else {
      b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
    }
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    b = 255;
  }

  target.setRGB(
    THREE.MathUtils.clamp(r, 0, 255) / 255,
    THREE.MathUtils.clamp(g, 0, 255) / 255,
    THREE.MathUtils.clamp(b, 0, 255) / 255,
  );

  return target;
}

function randomIntensity() {
  const r = Math.random();

  if (r > 0.997) return 15.0;
  // Bright stars
  if (r > 0.99) return 10.0;
  // Noticeable stars
  if (r > 0.98) return 5.0;

  return 0.25 + Math.pow(Math.random(), 3) * 2.0;
}

function createGeometry(count: number) {
  const positions: number[] = [];
  const colors: number[] = [];
  const sizes: number[] = [];
  const intensities: number[] = [];

  const radius = SIMULATION_RADIUS * DISTANCE_SCALE;

  for (let i = 0; i < count; i++) {
    const dir = randomDirection();
    positions.push(dir.x * radius, dir.y * radius, dir.z * radius);

    const star = chooseStarRange();

    const temperature = THREE.MathUtils.randFloat(star.min, star.max);

    const color = kelvinToColor(temperature);

    color.offsetHSL(
      THREE.MathUtils.randFloatSpread(0.03),
      THREE.MathUtils.randFloatSpread(0.05),
      THREE.MathUtils.randFloatSpread(0.03),
    );

    colors.push(color.r, color.g, color.b);

    let intensity = randomIntensity();

    const heat = (temperature - 2400) / (45000 - 2400);

    intensity *= THREE.MathUtils.lerp(0.95, 1.45, Math.sqrt(heat));

    intensities.push(intensity);

    const t = intensity / 5;

    const visualSize = Math.min(
      THREE.MathUtils.lerp(star.size[0], star.size[1], t),
      3.0,
    );

    sizes.push(visualSize);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute(
    "intensity",
    new THREE.Float32BufferAttribute(intensities, 1),
  );

  return geometry;
}

export function createStarfield(
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera,
): Starfield {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
  });

  const starCount =
    Math.pow(Math.min(window.innerHeight, window.innerWidth), 2) / 150;
  const points = new THREE.Points(createGeometry(starCount), material);
  points.frustumCulled = false;

  return {
    points,
    update(camera) {
      points.position.copy(camera.position);
    },
  };
}
