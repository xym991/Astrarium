import * as THREE from "three";
import { solarSystemData } from "../data";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FlyControls } from "three/addons/controls/FlyControls.js";
import { recursiveTransform, buildSolarSystem } from "./utils";
import { CelestialBody } from "./CelestialBody";
import AppState from "../state";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

export default function start(canvas: HTMLCanvasElement) {
  // scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // build solar system
  const solarSystem = buildSolarSystem(solarSystemData);
  solarSystem.group.position.set(0, 0, 0);

  // light
  const light = new THREE.PointLight("#FFFFFF", 10, 0);
  light.decay = 0.15;
  light.position.set(0, 0, 0);
  solarSystem.group.add(light);
  scene.add(solarSystem.group);

  const ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
  scene.add(ambientLight);

  // camera and controls
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100000000,
  );

  const orbitControls = new OrbitControls(camera, canvas);

  const flyControls = new FlyControls(camera, canvas);

  flyControls.movementSpeed = 500;
  flyControls.rollSpeed = Math.PI / 12;

  flyControls.enabled = false;

  camera.position.set(0, 100, 200);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    composer.setSize(window.innerWidth, window.innerHeight);
  });

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  const clock = new THREE.Clock();

  // camera helper
  function celestialBodyOrbitCamera(
    body: CelestialBody,

    camera: THREE.PerspectiveCamera,

    offset: number,
  ) {
    const pos = new THREE.Vector3();

    body.mesh.getWorldPosition(pos);

    const radius = body.radius * AppState.get("radiusScale") + offset;
    AppState.set("focusedBody", body);
    camera.position.copy(
      pos.clone().add(new THREE.Vector3(-radius, radius, radius)),
    );

    orbitControls.target.copy(pos);

    orbitControls.update();
  }

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
    0.01, // threshold
  );

  composer.addPass(bloomPass);
  function animate() {
    renderer.render(scene, camera);
    const delta = clock.getDelta();
    orbitControls.update(delta);
    flyControls.update(delta);
    const orbitDays =
      clock.getElapsedTime() * AppState.get("simulationRevolutionSpeed");
    const rotationDays =
      clock.getElapsedTime() * AppState.get("simulationRotationSpeed");

    // console.log(orbitDays, rotationDays);

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
      body.mesh.rotation.y = angle;
    });
    composer.render();
    requestAnimationFrame(animate);
  }
  animate();
  //key events
  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyF") {
      orbitControls.enabled = !orbitControls.enabled;

      flyControls.enabled = !flyControls.enabled;
    }
    if (Number(e.key) > 0 && Number(e.key) <= 8) {
      const index = parseInt(e.key);
      solarSystem.children.forEach((child, i) => {
        if (i + 1 === index) {
          celestialBodyOrbitCamera(child, camera, 10);
        }
      });
    }
    if (e.key === "0") {
      camera.position.set(0, 100, 200);
      camera.lookAt(0, 0, 0);
      solarSystem.group.add(camera);
      AppState.set("focusedBody", null);
    }
  });
}
