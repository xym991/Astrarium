import { mount } from "svelte";
import "./main.css";
import App from "./ui/index.svelte";
import Engine from "./engine";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const labels = document.getElementById("labels") as HTMLDivElement;
const engine = Engine.getInstance(canvas, labels);

export const cameraController = engine.cameraController;
export const labelController = engine.labelController;
export const inputController = engine.inputController;

const app = mount(App, {
  target: document.getElementById("ui")!,
});

export default app;
