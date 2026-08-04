<script lang="ts">
  import Telemetry from "../state/telemetry.svelte";
  import type { InputAction } from "../engine/Input/inputController";
  import { inputController } from "../main";
  import Button from "./shared/Button.svelte";
  import {
    ArrowDown,
    ArrowUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Redo2,
    Undo2,
  } from "lucide-svelte";

  type MovementAction = Extract<
    InputAction,
    | "moveForward"
    | "moveBackward"
    | "moveLeft"
    | "moveRight"
    | "moveUp"
    | "moveDown"
  >;

  type MovementButton = {
    action: MovementAction;
    label: string;
    icon:
      | "arrow-down"
      | "arrow-up"
      | "chevron-down"
      | "chevron-left"
      | "chevron-right"
      | "chevron-up"
      | "redo"
      | "redo-vertical"
      | "undo"
      | "undo-vertical";
  };

  const buttons: Record<MovementAction, MovementButton> = {
    moveForward: {
      action: "moveForward",
      label: "Move forward",
      icon: "chevron-up",
    },
    moveBackward: {
      action: "moveBackward",
      label: "Move backward",
      icon: "chevron-down",
    },
    moveLeft: { action: "moveLeft", label: "Move left", icon: "chevron-left" },
    moveRight: {
      action: "moveRight",
      label: "Move right",
      icon: "chevron-right",
    },
    moveUp: { action: "moveUp", label: "Move up", icon: "arrow-up" },
    moveDown: { action: "moveDown", label: "Move down", icon: "arrow-down" },
  };

  const orbitLayout: (MovementButton | null)[] = [
    null,
    { ...buttons.moveForward, label: "Orbit upward", icon: "undo-vertical" },
    null,
    { ...buttons.moveLeft, label: "Orbit left", icon: "undo" },
    { ...buttons.moveBackward, label: "Orbit downward", icon: "redo-vertical" },
    { ...buttons.moveRight, label: "Orbit right", icon: "redo" },
  ];

  const flightLayout: MovementButton[] = [
    buttons.moveUp,
    buttons.moveForward,
    buttons.moveDown,
    buttons.moveLeft,
    buttons.moveBackward,
    buttons.moveRight,
  ];

  let active = $state<Partial<Record<MovementAction, boolean>>>({});
  const cameraMode = $derived(Telemetry.get("cameraMode"));
  const layout = $derived<(MovementButton | null)[]>(
    cameraMode === "orbit"
      ? orbitLayout
      : cameraMode === "flight"
        ? flightLayout
        : [],
  );

  function formatKey(key: string) {
    return key
      .replace(/^Key/, "")
      .replace(/^Digit/, "")
      .replace(/^Shift(Left|Right)$/, "Shift")
      .replace(/^Control(Left|Right)$/, "Ctrl")
      .replace(/^Alt(Left|Right)$/, "Alt")
      .replace(/^Arrow/, "");
  }

  function bindings(action: MovementAction) {
    return inputController.getKey(action).map(formatKey).join(" / ");
  }

  function press(action: MovementAction, event: PointerEvent) {
    event.currentTarget instanceof HTMLElement &&
      event.currentTarget.setPointerCapture(event.pointerId);
    inputController.setActionActive(action, true);
  }

  function release(action: MovementAction) {
    inputController.setActionActive(action, false);
  }

  $effect(() => {
    const actions = Object.keys(buttons) as MovementAction[];
    const unsubscribers = actions.map((action) =>
      inputController.subscribe(action, (_, state) => {
        active[action] = state.active;
      }),
    );

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  });
</script>

{#if cameraMode !== "overview"}
  <section
    class="fixed bottom-6 left-6 z-[1001] pointer-events-auto font-[Oxanium,sans-serif] text-(--primary-full) uppercase"
    aria-label={`${cameraMode} movement controls`}
  >
    <div class="grid grid-cols-3 gap-[0.35rem]">
      {#each layout as button}
        {#if button}
          <Button
            class={`group p-0 min-h-[40px] min-w-[40px] ${
              active[button.action]
                ? "border-(--primary-full) bg-[rgba(130,220,255,.12)] shadow-[inset_0_0_10px_rgba(130,220,255,.05),0_0_10px_rgba(130,220,255,.08)]"
                : ""
            }`}
            ariaLabel={`${button.label} (${bindings(button.action)})`}
            onpointerdown={(event) => press(button.action, event)}
            onpointerup={() => release(button.action)}
            onpointercancel={() => release(button.action)}
            onlostpointercapture={() => release(button.action)}
          >
            <span aria-hidden="true">
              {#if button.icon === "chevron-up"}
                <ChevronUp size={22} />
              {:else if button.icon === "chevron-down"}
                <ChevronDown size={22} />
              {:else if button.icon === "chevron-left"}
                <ChevronLeft size={22} />
              {:else if button.icon === "chevron-right"}
                <ChevronRight size={22} />
              {:else if button.icon === "arrow-up"}
                <ArrowUp size={22} />
              {:else if button.icon === "arrow-down"}
                <ArrowDown size={22} />
              {:else if button.icon === "undo"}
                <Undo2 size={22} />
              {:else if button.icon === "redo"}
                <Redo2 size={22} />
              {:else if button.icon === "undo-vertical"}
                <span class="block rotate-90"><Undo2 size={22} /></span>
              {:else}
                <span class="block rotate-90"><Redo2 size={22} /></span>
              {/if}
            </span>
            <span
              class="pointer-events-none absolute bottom-[calc(100%+.45rem)] left-1/2 z-1 w-max max-w-48 -translate-x-1/2 translate-y-[.2rem] bg-[rgba(0,10,14,.94)] px-[.4rem] py-1 text-[.65rem] tracking-[.08em] opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
              >{bindings(button.action)}</span
            >
          </Button>
        {:else}
          <div aria-hidden="true"></div>
        {/if}
      {/each}
    </div>
  </section>
{/if}
