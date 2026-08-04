<script lang="ts">
  import Frame from "./Frame.svelte";
  import TimeScale from "./TimeScale.svelte";
  import Toggles from "./Toggles.svelte";
  import {
    Eye,
    MousePointerClick,
    ScanEye,
    Settings2 as SettingsIcon,
    CircleGauge,
    Expand,
  } from "lucide-svelte";
  import Button from "../shared/Button.svelte";
  import CameraMode from "./CameraMode.svelte";
  import Telemetry from "../../state/telemetry.svelte";
  import { getTimeScaleLabel } from "../../data";
  import InputController, {
    type InputAction,
  } from "../../engine/Input/inputController";
  import { inputController } from "../../main";

  type Panel = "camera" | "time" | "settings";
  type PanelAction = Extract<
    InputAction,
    "changeCamera" | "changeTime" | "showSettings"
  >;

  let openPanel = $state<Panel | null>(null);

  const cameraLabel = $derived(
    `${Telemetry.get("cameraMode").slice(0, 1).toUpperCase()}${Telemetry.get("cameraMode").slice(1)}`,
  );
  const timeScaleLabel = $derived(
    getTimeScaleLabel(Telemetry.get("timeScale")),
  );

  function togglePanel(panel: Panel) {
    openPanel = openPanel === panel ? null : panel;
  }

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key === "Escape") openPanel = null;
  }

  function closeOnBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) openPanel = null;
  }

  $effect(() => {
    const mouseCaptured = Telemetry.get("mouseState").isCaptured;

    if (mouseCaptured) openPanel = null;
  });

  function handleAction(action: PanelAction, panel: Panel): () => void {
    return inputController.subscribe(action, (_, state) => {
      if (!state.active) return;

      document.exitPointerLock();

      openPanel = openPanel === panel ? null : panel;
    });
  }

  $effect(() => {
    const cameraSubscription = handleAction("changeCamera", "camera");
    const timeSubscription = handleAction("changeTime", "time");
    const settingsSubscription = handleAction("showSettings", "settings");
    return () => {
      cameraSubscription();
      timeSubscription();
      settingsSubscription();
    };
  });
</script>

<svelte:window onkeydown={closeOnEscape} />

<div
  class="fixed right-6 top-6 z-[100001] flex gap-3 pointer-events-auto max-w-[50vw] flex-wrap items-end justify-end"
>
  <Button class="gap-2 px-3" onclick={() => togglePanel("camera")}>
    <ScanEye size={20} strokeWidth={2} />
    <span class="relative top-px"> {cameraLabel}</span>
  </Button>

  <Button class="gap-2 px-3" onclick={() => togglePanel("time")}>
    <CircleGauge size={20} strokeWidth={2} />
    <span class="relative top-px"> {timeScaleLabel}</span>
  </Button>

  <Button onclick={() => togglePanel("settings")} class="h-10 w-10 p-0">
    <SettingsIcon size={20} strokeWidth={2} />
  </Button>
  <Button
    onclick={() => document.body.requestFullscreen()}
    class="h-10 w-10 p-0"
  >
    <Expand size={20} strokeWidth={2} />
  </Button>
</div>

{#if openPanel}
  <div
    class="fixed inset-0 z-[100000] pointer-events-auto h-screen w-screen top-0 left-0"
    onclick={closeOnBackdropClick}
    onkeydown={closeOnEscape}
    role="dialog"
    aria-modal="true"
    aria-label="Settings"
    tabindex="-1"
  >
    <Frame title="SETTINGS">
      <div
        class="flex w-full max-h-[calc(90vh-8rem)] min-h-0 flex-col gap-12 overflow-y-auto overscroll-contain"
      >
        {#if openPanel === "camera"}
          <CameraMode />
        {:else if openPanel === "time"}
          <TimeScale />
        {:else}
          <Toggles />
        {/if}
      </div>
    </Frame>
  </div>
{/if}
