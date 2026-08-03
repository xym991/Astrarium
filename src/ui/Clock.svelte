<script lang="ts">
  import Telemetry from "../state/telemetry.svelte";
  import Button from "./shared/Button.svelte";
  const time = $derived(new Date(Telemetry.get("currentTime")));
</script>

<Button
  class="fixed top-6 left-6 font-normal text-[0.875rem] text-[var(--primary-full)] px-3"
>
  {time.toDateString().slice(4) + " " + time.toLocaleTimeString()}
</Button>
