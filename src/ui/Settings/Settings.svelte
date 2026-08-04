<script lang="ts">
  import Frame from "./Frame.svelte";
  import TimeScale from "./TimeScale.svelte";
  import Toggles from "./Toggles.svelte";
  import {
    ScanEye,
    Settings2 as SettingsIcon,
    CircleGauge,
    Expand,
    Search,
    Shrink,
  } from "lucide-svelte";
  import Button from "../shared/Button.svelte";
  import CameraMode from "./CameraMode.svelte";
  import SearchPanel from "./Search.svelte";
  import Telemetry from "../../state/telemetry.svelte";
  import { getTimeScaleLabel } from "../../data";
  import InputController, {
    type InputAction,
  } from "../../engine/Input/inputController";
  import { inputController } from "../../main";

  type Panel = "camera" | "time" | "settings" | "search";
  type PanelAction = Extract<
    InputAction,
    "changeCamera" | "changeTime" | "showSettings" | "showSearch"
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

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
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
    const searchSubscription = handleAction("showSearch", "search");
    return () => {
      cameraSubscription();
      timeSubscription();
      settingsSubscription();
      searchSubscription();
    };
  });

  let fullscreen = $state(document.fullscreenElement !== null);
</script>

<svelte:window onkeydown={closeOnEscape} />
<svelte:document onfullscreenchange={() => (fullscreen = !fullscreen)} />

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

  <Button onclick={() => togglePanel("search")} class="gap-2 px-3">
    <Search size={20} strokeWidth={2} />
  </Button>

  <Button onclick={() => togglePanel("settings")} class="h-10 w-10 p-0">
    <SettingsIcon size={20} strokeWidth={2} />
  </Button>
  <Button onclick={() => toggleFullscreen()} class="h-10 w-10 p-0">
    {#if !fullscreen}<Expand size={20} strokeWidth={2} />{:else}
      <Shrink size={20} strokeWidth={2} />
    {/if}
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
        class="flex w-full max-h-[calc(90vh-8rem)] min-h-0 flex-col gap-12 overflow-y-auto overscroll-contain scrollbar-gutter-stable"
      >
        {#if openPanel === "camera"}
          <CameraMode />
        {:else if openPanel === "time"}
          <TimeScale />
        {:else if openPanel === "search"}
          <SearchPanel close={() => (openPanel = null)} />
        {:else}
          <Toggles />
        {/if}
      </div>
    </Frame>
  </div>
{/if}
