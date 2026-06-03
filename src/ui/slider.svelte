<script lang="ts">
  import AppState from "../state";
  import { RANGES, type NumericKeys } from "../data";

  let {
    key,
  }: {
    key: NumericKeys;
  } = $props();

  let value = $state(AppState.get(key));

  $effect(() => {
    AppState.set(key, value * RANGES[key][2]);
  });
  console.log(key, value * RANGES[key][2]);
</script>

<div>
  <label
    >{key}
    <input type="range" min={RANGES[key][0]} max={RANGES[key][1]} bind:value />
  </label>
</div>

<style>
  div {
    width: 300px;
    background: #333;
    padding: 8px;
    color: #fff;
  }
  input {
    width: 100%;
    z-index: 1;
  }
</style>
