import { CelestialBody } from "../CelestialBody";
export default function recursiveTransform(
  model: CelestialBody,
  fn: (body: CelestialBody) => void,
) {
  fn(model);
  if ("children" in model) {
    for (const child of model.children) {
      recursiveTransform(child, fn);
    }
  }
}
