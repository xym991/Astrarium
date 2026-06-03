<script lang="ts">
  import AppState from "../state";
  import Slider from "./slider.svelte";
  const numericKeys = AppState.keys().filter((key) => {
    return typeof AppState.get(key) === "number";
  });
</script>

<div class="ui-main">
  {#each numericKeys as key}
    <Slider {key}></Slider>
  {/each}
</div>

<style>
</style>
