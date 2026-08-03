<script lang="ts">
  import AppState, { type CameraMode } from "../../state";
  import Telemetry from "../../state/telemetry.svelte";
  import Selector from "../shared/Selector.svelte";

  const CameraModes: { label: string; value: CameraMode }[] = [
    {
      label: "Overview",
      value: "overview",
    },
    {
      label: "Orbit",
      value: "orbit",
    },
    {
      label: "Flight",
      value: "flight",
    },
  ];

  const cameraMode = $derived(Telemetry.get("cameraMode"));
</script>

<div class="flex w-full items-center justify-between gap-6 p-4">
  <Selector
    options={CameraModes}
    active={cameraMode}
    onSelect={(value) => {
      AppState.set(
        "cameraMode",
        value as (typeof CameraModes)[number]["value"],
      );
    }}
  />
</div>
