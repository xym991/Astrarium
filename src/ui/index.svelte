<script lang="ts">
  import Clock from "./Clock.svelte";
  import Hologram from "./Hologram.svelte";
  import Settings from "./Settings/Settings.svelte";
  import Movement from "./Movement.svelte";
  import BodyInfo from "./BodyInfo.svelte";
</script>

<div
  class="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
></div>
<Clock />
<Settings />
<Hologram />
<Movement />
<BodyInfo />
