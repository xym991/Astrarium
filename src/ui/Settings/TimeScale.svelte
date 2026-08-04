<script lang="ts">
  import AppState from "../../state";
  import Telemetry from "../../state/telemetry.svelte";
  import Clock from "../../engine/clock";
  import { timeScaleOptions } from "../../data";
  import Button from "../shared/Button.svelte";
  import Selector from "../shared/Selector.svelte";

  const timeScale = $derived(Telemetry.get("timeScale"));
</script>

<div class="flex w-full items-center justify-between gap-6 p-4 flex-col">
  <!-- <span
    class="shrink-0 font-[Oxanium,sans-serif] text-md font-semibold tracking-[0.15em] text-[var(--primary-full)] uppercase"
  >
    1 SECOND =
  </span> -->

  <Selector
    options={timeScaleOptions}
    active={timeScale}
    onSelect={(value) => {
      AppState.set("timeScale", value);
    }}
  />
  <Button
    class="h-10 px-5! w-full"
    onclick={() => {
      Clock.getInstance().reset();
      AppState.set("timeScale", timeScaleOptions[0].value);
    }}
  >
    Reset Clock Time and Scale
  </Button>
</div>
