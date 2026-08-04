<script lang="ts">
  import {
    Circle,
    MoonStar,
    Orbit,
    Search as SearchIcon,
    Sun,
  } from "lucide-svelte";
  import type { CelestialBody } from "../../engine/CelestialBody";
  import { solarSystem } from "../../main";
  import AppState from "../../state";
  import SearchNode from "./SearchNode.svelte";

  let { close } = $props<{ close: () => void }>();

  let query = $state("");
  let expanded = $state<Record<string, boolean>>({ Sun: true });
  let searchInput: HTMLInputElement | null = $state(null);

  function normalize(value: string) {
    return value.trim().toLowerCase();
  }

  function matches(body: CelestialBody, needle: string) {
    return normalize(body.name).includes(needle);
  }

  function collectMatches(
    body: CelestialBody,
    needle: string,
    result: CelestialBody[] = [],
  ) {
    if (matches(body, needle)) result.push(body);

    body.children.forEach((child) => collectMatches(child, needle, result));
    return result;
  }

  const filteredBodies = $derived.by(() => {
    const needle = normalize(query);
    if (!needle) return [] as CelestialBody[];
    return collectMatches(solarSystem, needle);
  });

  function isExpanded(body: CelestialBody) {
    return expanded[body.name] ?? body.name === "Sun";
  }

  function toggleExpanded(body: CelestialBody) {
    if (!body.children.length) return;
    expanded[body.name] = !isExpanded(body);
  }

  function selectBody(body: CelestialBody) {
    AppState.set("focusedBody", body);
  }

  function handleSearchKeydown(event: KeyboardEvent) {
    if (event.key !== "Enter") return;

    const trimmedQuery = normalize(query);
    if (!trimmedQuery) return;

    const firstMatch = filteredBodies[0];
    if (firstMatch) {
      event.preventDefault();
      selectBody(firstMatch);
      close();
    }
  }

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

  $effect(() => {
    if (!searchInput) return;

    const frame = requestAnimationFrame(() => {
      searchInput?.focus();
    });

    return () => cancelAnimationFrame(frame);
  });
</script>

<section
  class="flex flex-col gap-4 max-w-[70vw] w-300 h-[50vh] pr-2 scrollbar-gutter-stable"
>
  <button
    type="button"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.stopPropagation()}
    onkeypress={(e) => e.stopPropagation()}
    onkeyup={(e) => e.stopPropagation()}
    class="flex items-center gap-3 border border-[var(--primary-full)] px-4 py-3 backdrop-blur-sm"
  >
    <SearchIcon size={18} class="text-[var(--primary-full)]" />
    <input
      bind:this={searchInput}
      bind:value={query}
      type="text"
      placeholder="Search"
      onkeydown={handleSearchKeydown}
      class="w-full border-0 bg-transparent text-[0.95rem] tracking-[0.12em] text-white outline-none placeholder:text-(--primary-full)/50"
    />
  </button>

  <div class="flex flex-col gap-2">
    {#if query.trim()}
      {#each filteredBodies as body}
        <button
          class="group flex w-full items-center justify-between border border-[var(--primary-faint)] px-4 py-3 text-left transition duration-150 hover:border-[var(--primary)] hover:bg-[rgba(130,220,255,0.06)]"
          onclick={() => selectBody(body)}
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-7 w-7 items-center justify-center border border-[var(--primary)] text-[var(--primary-full)]"
            >
              <svelte:component this={getBodyTypeIcon(body.type)} size={16} />
            </div>
            <span
              class="text-[0.9rem] uppercase tracking-[0.16em] text-[var(--primary-full)]"
            >
              {body.name}
            </span>
          </div>
          <span
            class="text-[0.7rem] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.45)]"
          >
            {body.type}
          </span>
        </button>
      {/each}
      {#if !filteredBodies.length}
        <div
          class="border border-dashed border-[var(--primary-faint)] px-4 py-6 text-center text-[0.8rem] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.45)]"
        >
          No matching bodies
        </div>
      {/if}
    {:else}
      <button onclick={close}
        ><SearchNode
          body={solarSystem}
          {isExpanded}
          {toggleExpanded}
          {selectBody}
        /></button
      >
    {/if}
  </div>
</section>
