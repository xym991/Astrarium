import splitDouble from "./splitDouble";
import * as THREE from "three";

export function splitVector3(
  v: THREE.Vector3,
  high: THREE.Vector3,
  low: THREE.Vector3,
): void {
  const [hx, lx] = splitDouble(v.x);
  const [hy, ly] = splitDouble(v.y);
  const [hz, lz] = splitDouble(v.z);

  high.set(hx, hy, hz);
  low.set(lx, ly, lz);
}
