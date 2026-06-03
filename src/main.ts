import { mount } from "svelte";
import "./main.css";
import App from "./ui/index.svelte";
const app = mount(App, {
  target: document.getElementById("ui ")!,
});

export default app;
