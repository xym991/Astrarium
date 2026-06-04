import * as THREE from "three";
import { solarSystemData } from "../data";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FlyControls } from "three/addons/controls/FlyControls.js";
import { recursiveTransform, buildSolarSystem } from "./utils";
import { CelestialBody } from "./CelestialBody";
import CameraController from "./camera";
import AppState from "../state";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
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
  const cameraController = CameraController.getInstance(canvas);
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
    0.01, // threshold
  );

  composer.addPass(bloomPass);
  setTimeout(() => {
    AppState.set("focusedBody", solarSystem);
  }, 10);

  ///////////// camera controller logic

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
    console.log(hits);
  });

  /////////////
  function animate() {
    // renderer.render(scene, camera);
    const delta = clock.getDelta();

    // orbitControls.update(delta);
    // flyControls.update(delta);
    const orbitDays =
      clock.getElapsedTime() * AppState.get("simulationRevolutionSpeed");
    const rotationDays =
      clock.getElapsedTime() * AppState.get("simulationRotationSpeed");

    // console.log(orbitDays, rotationDays);

    recursiveTransform(solarSystem, (body) => {
      if (body.orbitalPeriod !== null) {
        const angle = (orbitDays / body.orbitalPeriod) * Math.PI * 2;
        // const angle = 0 * Math.PI * 2;
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
  });
}
