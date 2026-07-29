<script lang="ts">
  import AppState, { type AstrariumState } from "../state";
  import HUD from "./HUD.svelte";
  import Slider from "./slider.svelte";
  import Toggle from "./toggle.svelte";

  import Telemetry from "../state/telemetry.svelte";

  const numericKeys = AppState.keys().filter((key) => {
    return typeof AppState.get(key as keyof AstrariumState) === "number";
  });
  const booleanKeys = AppState.keys().filter((key) => {
    return typeof AppState.get(key as keyof AstrariumState) === "boolean";
  });
</script>

<div class="ui-main">
  <!-- <HUD /> -->
  {#each numericKeys as key}
    <Slider {key}></Slider>
  {/each}

  {#each booleanKeys as key}
    <Toggle {key}></Toggle>
  {/each}

  <div class="time">
    {new Date(Telemetry.get("currentTime")).toDateString() +
      " " +
      new Date(Telemetry.get("currentTime")).toLocaleTimeString()}
  </div>
</div>

<style>
  .time {
    position: fixed;
    top: 20px;
    left: 100px;
    color: var(--primary-full);
    font-size: 14px;
    font-weight: 400;
  }
</style>
