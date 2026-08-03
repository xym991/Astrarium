<script lang="ts">
  import Clock from "./Clock.svelte";
  import HUD from "./HUD.svelte";
  import Settings from "./Settings/Settings.svelte";
</script>

<div
  class="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
></div>
<Clock />
<Settings />
<HUD />
