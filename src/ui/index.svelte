<script lang="ts">
  import HUD from "./HUD.svelte";
  import Telemetry from "../state/telemetry.svelte";
  import Settings from "./Settings/Settings.svelte";
</script>

<div class="ui-main">
  <HUD />

  <div class="time">
    {new Date(Telemetry.get("currentTime")).toDateString() +
      " " +
      new Date(Telemetry.get("currentTime")).toLocaleTimeString()}
  </div>
</div>
<div>
  <Settings />
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

  .ui-main {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
