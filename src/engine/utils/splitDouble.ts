export default function splitDouble(value: number) {
  const high = Math.fround(value);
  const low = value - high;

  return [high, low];
}
