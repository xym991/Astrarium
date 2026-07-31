<script lang="ts">
  import HUD from "./HUD.svelte";
  import Telemetry from "../state/telemetry.svelte";
  import Settings from "./Settings/Settings.svelte";
</script>

<div class="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
  <HUD />

  <div class="fixed top-5 left-[6.25rem] font-normal text-[0.875rem] text-[var(--primary-full)]">
    {new Date(Telemetry.get("currentTime")).toDateString() +
      " " +
      new Date(Telemetry.get("currentTime")).toLocaleTimeString()}
  </div>
</div>
<div>
  <Settings />
</div>
