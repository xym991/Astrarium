import { mount } from "svelte";
import "./main.css";
import App from "./ui/index.svelte";
import AppState from "./state/index";
import { Engine } from "./engine";
const engine = new Engine(
  document.getElementById("canvas") as HTMLCanvasElement,
  document.getElementById("labels") as HTMLDivElement,
);
const app = mount(App, {
  target: document.getElementById("ui")!,
});

export default app;
