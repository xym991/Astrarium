<script lang="ts">
  import { ChevronRight, Circle, MoonStar, Orbit, Sun } from "lucide-svelte";
  import type { CelestialBody } from "../../engine/CelestialBody";
  import Button from "../shared/Button.svelte";
  import SearchNode from "./SearchNode.svelte";

  interface Props {
    body: CelestialBody;
    isExpanded: (body: CelestialBody) => boolean;
    toggleExpanded: (body: CelestialBody) => void;
    selectBody: (body: CelestialBody) => void;
  }

  let { body, isExpanded, toggleExpanded, selectBody }: Props = $props();

  const bodyTypeIcons = {
    star: Sun,
    planet: Orbit,
    moon: MoonStar,
    asteroid: Circle,
    dwarf: Circle,
  } as const;

  function getBodyTypeIcon(type: CelestialBody["type"]) {
    return bodyTypeIcons[type] ?? Circle;
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex w-full items-center gap-2">
    <button
      class="flex cursor-pointer min-w-0 flex-1 items-center justify-between border border-[var(--primary)] p-3 text-left transition duration-150 hover:border-[var(--primary-full)]"
      onclick={() => selectBody(body)}
    >
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center border border-[var(--primary)] text-[var(--primary-full)]"
        >
          <svelte:component this={getBodyTypeIcon(body.type)} size={16} />
        </div>
        <span
          class="truncate text-[0.9rem] uppercase tracking-[0.16em] text-[var(--primary-full)]"
        >
          {body.name}
        </span>
      </div>
      {#if body.children.length}
        <Button
          class="h-8 w-8 shrink-0 p-0 border-[var(--primary)] "
          onclick={(e) => {
            e.stopPropagation();
            toggleExpanded(body);
          }}
        >
          <div
            class={`flex items-center transition-transform duration-150 ${isExpanded(body) ? "rotate-90" : "rotate-0"}`}
          >
            <ChevronRight size={18} class="text-[var(--primary-full)]" />
          </div>
        </Button>
      {/if}
    </button>
  </div>

  {#if body.children.length && isExpanded(body)}
    <div
      class="flex flex-col gap-2 border-l border-[var(--primary-faint)] pl-4"
    >
      {#each body.children as child}
        <SearchNode body={child} {isExpanded} {toggleExpanded} {selectBody} />
      {/each}
    </div>
  {/if}
</div>
