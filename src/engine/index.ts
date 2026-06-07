import * as THREE from "three";
import { solarSystemData } from "../data";
import { recursiveTransform, buildSolarSystem } from "./utils";
import { CelestialBody } from "./CelestialBody";
import CameraController from "./camera";
import AppState from "../state";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { FXAAPass } from "three/examples/jsm/Addons.js";
import LabelController from "./labels";
import addTextures from "./utils/addTextures";

export default async function start(canvas: HTMLCanvasElement) {
  // scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  function createStars(count: number) {
    const positions: number[] = [];
    const colors: number[] = [];

    const palette = [
      [0.7, 0.8, 1.0], // blue-white
      [1.0, 1.0, 1.0], // white
      [1.0, 0.95, 0.8], // yellow-white
      [1.0, 0.8, 0.6], // orange
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const radius = 1000000;

      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );

      const brightness = Math.pow(Math.random(), 4);
      const [r, g, b] = palette[Math.floor(Math.random() * palette.length)];
      colors.push(r * brightness, g * brightness, b * brightness);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    return geometry;
  }

  const material1 = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: false,
    vertexColors: true,
  });

  const material2 = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: false,
    vertexColors: true,
  });
  const material3 = new THREE.PointsMaterial({
    size: 3,
    sizeAttenuation: false,
    vertexColors: true,
  });

  const stars = new THREE.Points(createStars(15000), material1);
  const stars2 = new THREE.Points(createStars(10000), material2);
  const stars3 = new THREE.Points(createStars(500), material3);

  scene.add(stars3);
  scene.add(stars);
  scene.add(stars2);

  // build solar system
  const solarSystem = buildSolarSystem(solarSystemData);
  solarSystem.group.position.set(0, 0, 0);

  //add textures
  recursiveTransform(solarSystem, (body) => {
    addTextures(body);
  });

  // light
  const light = new THREE.PointLight("#FFFFFF", 18, 0);
  light.decay = 0.1;
  light.position.set(0, 0, 0);
  solarSystem.group.add(light);
  scene.add(solarSystem.group);

  const ambientLight = new THREE.AmbientLight("#ffffff", 1);
  scene.add(ambientLight);

  // camera and controls
  const cameraController = CameraController.getInstance(canvas, solarSystem);
  const camera = cameraController.camera;

  camera.position.set(0, 100, 200);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    composer.setSize(window.innerWidth, window.innerHeight);

    recursiveTransform(solarSystem, (body) => {
      if (body.orbit?.material instanceof LineMaterial) {
        body.orbit.material.resolution.set(
          window.innerWidth,
          window.innerHeight,
        );
      }
    });
  });

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    // alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  const clock = new THREE.Clock();

  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);

  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(
      window.innerWidth,

      window.innerHeight,
    ),
    0.075, // strength
    1, // radius
    0.05, // threshold
  );

  composer.addPass(bloomPass);

  composer.addPass(new FXAAPass());
  renderer.toneMapping = THREE.NoToneMapping;

  setTimeout(() => {
    AppState.set("focusedBody", solarSystem);
  }, 10);

  ///////////// camera controller logic

  // labels
  const labelContainer = document.getElementById("labels") as HTMLDivElement;
  const labelController = new LabelController(labelContainer);

  recursiveTransform(solarSystem, (body) => {
    labelController.addBody(body);
  });

  //raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let meshes: THREE.Mesh[] = [];
  recursiveTransform(solarSystem, (body) => {
    if (body.mesh instanceof THREE.Mesh) {
      meshes.push(body.mesh);
      meshes.push(body.orbit);
    }
  });

  canvas.addEventListener("click", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(
      mouse,

      cameraController.camera,
    );
    const hits = raycaster.intersectObjects(meshes);
    if (hits.length === 0) return;
    const body = hits[0].object.userData as CelestialBody;
    AppState.set("focusedBody", body);
    // console.log(hits);
  });

  /////////////
  function animate() {
    const delta = clock.getDelta();

    const orbitDays =
      clock.getElapsedTime() * AppState.get("simulationRevolutionSpeed");
    const rotationDays =
      clock.getElapsedTime() * AppState.get("simulationRotationSpeed");

    // const distance = camera.position.distanceTo(solarSystem.group.position);

    recursiveTransform(solarSystem, (body) => {
      if (body.orbitalPeriod !== null) {
        // const angle = (orbitDays / body.orbitalPeriod) * Math.PI * 2;
        const angle = 0 * Math.PI * 2;
        const radius = body.distanceFromParent * AppState.get("distanceScale");
        body.group.position.x = Math.cos(angle) * radius;
        body.group.position.z = Math.sin(angle) * radius;
      }
    });
    recursiveTransform(solarSystem, (body) => {
      body.setScale(AppState.get("radiusScale") * body.radius);
    });

    recursiveTransform(solarSystem, (body) => {
      const angle = (rotationDays / body.rotationPeriod) * Math.PI * 2;
      // body.mesh.rotation.y = angle;
      1;
    });
    stars.position.copy(camera.position);
    labelController.update(camera);
    cameraController.update(delta);

    composer.render();

    requestAnimationFrame(animate);
  }
  animate();
  //key events
  window.addEventListener("keydown", (e) => {
    if (Number(e.key) > 0 && Number(e.key) <= 8) {
      const index = parseInt(e.key);
      solarSystem.children.forEach((child, i) => {
        if (i + 1 === index) {
          AppState.set("focusedBody", child);
        }
      });
    }
    if (e.key === "0") {
      AppState.set("focusedBody", solarSystem);
    }
    if (e.code === "KeyR") {
      cameraController.setMode("overview");
    }
    if (e.code === "KeyT") {
      cameraController.setMode("orbit");
    }
    if (e.code === "KeyY") {
      cameraController.setMode("flight");
    }
    // if (e.code === "KeyM") {
    //   AppState.set("paused", !AppState.get("paused"));
    // }
  });
}
