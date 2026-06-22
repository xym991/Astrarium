<script lang="ts">
  import AppState, { type AstrariumState } from "../state";
  import Slider from "./slider.svelte";
  import Toggle from "./toggle.svelte";
  const numericKeys = AppState.keys().filter((key) => {
    return typeof AppState.get(key as keyof AstrariumState) === "number";
  });
  const booleanKeys = AppState.keys().filter((key) => {
    return typeof AppState.get(key as keyof AstrariumState) === "boolean";
  });
</script>

<div class="ui-main">
  {#each numericKeys as key}
    <Slider {key}></Slider>
  {/each}

  {#each booleanKeys as key}
    <Toggle {key}></Toggle>
  {/each}
</div>

<style>
</style>
