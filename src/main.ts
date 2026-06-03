import { mount } from "svelte";
import "./main.css";
import App from "./ui/index.svelte";
import AppState from "./state/index";
import startEngine from "./engine";
startEngine(document.getElementById("canvas") as HTMLCanvasElement);
const app = mount(App, {
  target: document.getElementById("ui")!,
});

export default app;
