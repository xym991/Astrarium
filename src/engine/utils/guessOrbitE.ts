export default function guessOrbitE(M: number, e: number): number {
  let E = M;

  for (let i = 0; i < 5; i++) {
    const error = E - e * Math.sin(E) - M;

    E = E - error / (1 - e * Math.cos(E));
  }

  return E;
}
