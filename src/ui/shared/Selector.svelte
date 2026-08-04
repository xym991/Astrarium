<script context="module" lang="ts">
  export interface SelectorOption<T> {
    label: string;
    value: T;
  }
</script>

<script lang="ts" generics="T">
  import { onMount, tick } from "svelte";

  const {
    options,
    active,
    onSelect,
  }: {
    options: SelectorOption<T>[];
    active: T;
    onSelect: (value: T) => void;
  } = $props();

  let viewport!: HTMLDivElement;
  let itemRefs = $state<HTMLElement[]>([]);
  let selected = $state(0);
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let shouldCommit = false;
  let synchronizingIndex: number | undefined;
  let observedActive: T | undefined;
  let hasObservedActive = false;

  const SETTLE_DELAY = 60;

  function previous() {
    selectIndex(selected - 1);
  }

  function next() {
    selectIndex(selected + 1);
  }

  function clamp(index: number) {
    return Math.min(Math.max(index, 0), options.length - 1);
  }

  function centerIndex(index: number, behavior: ScrollBehavior = "smooth") {
    index = clamp(index);
    const el = itemRefs[index];
    if (!el || !viewport) return;

    viewport.scrollTo({
      left: el.offsetLeft + el.offsetWidth / 2 - viewport.clientWidth / 2,
      behavior,
    });
  }

  function selectIndex(index: number) {
    const nextIndex = clamp(index);
    if (nextIndex === selected) return;

    synchronizingIndex = undefined;
    selected = nextIndex;
    shouldCommit = true;
    centerIndex(selected);
    scheduleSettlement();
  }

  function nearestIndex() {
    const centerX = viewport.scrollLeft + viewport.clientWidth / 2;
    let minDist = Infinity;
    let nearest = selected;
    for (let i = 0; i < itemRefs.length; ++i) {
      const el = itemRefs[i];
      if (!el) continue;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(centerX - elCenter);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    }
    return nearest;
  }

  function scheduleSettlement() {
    if (settleTimer !== undefined) clearTimeout(settleTimer);
    settleTimer = setTimeout(commitSettledSelection, SETTLE_DELAY);
  }

  function handleScroll() {
    if (!viewport) return;
    // Ignore native scroll events produced while centering a prop-driven value.
    if (synchronizingIndex !== undefined) return;

    selected = nearestIndex();
    // Native touch/trackpad scrolling has no reliable "start" event. Every
    // non-programmatic scroll is therefore a potential user selection.
    shouldCommit = true;
    scheduleSettlement();
  }

  function handleWheel(event: WheelEvent) {
    // Trackpads already send deltaX for sideways gestures. A mouse wheel
    // usually only provides deltaY, so translate that into horizontal motion.
    if (event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY))
      return;

    const distance =
      event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? event.deltaY * 16
        : event.deltaY;

    event.preventDefault();
    viewport.scrollBy({ left: distance, behavior: "auto" });
  }

  function commitSettledSelection() {
    settleTimer = undefined;
    const settledIndex = nearestIndex();
    selected = settledIndex;

    // Prop-driven changes are display updates, never a new user selection.
    if (synchronizingIndex !== undefined) {
      synchronizingIndex = undefined;
      shouldCommit = false;
      return;
    }

    if (!shouldCommit || !options[settledIndex]) return;
    shouldCommit = false;
    onSelect(options[settledIndex].value);
  }

  $effect(() => {
    const activeChanged =
      !hasObservedActive || !Object.is(active, observedActive);
    observedActive = active;
    hasObservedActive = true;
    if (!activeChanged || !viewport) return;

    const index = options.findIndex((option) =>
      Object.is(option.value, active),
    );
    if (index !== -1 && index !== selected) {
      synchronizingIndex = index;
      selected = index;
      centerIndex(index, "auto");
      scheduleSettlement();
    }
  });

  onMount(() => {
    const index = options.findIndex((o) => Object.is(o.value, active));
    if (index !== -1) {
      selected = index;
      synchronizingIndex = index;
    }

    void (async () => {
      await tick();
      itemRefs = Array.from(
        viewport.querySelectorAll<HTMLElement>("[data-index]"),
      );
      requestAnimationFrame(() => {
        const initialIndex = index === -1 ? selected : index;
        selected = initialIndex;
        synchronizingIndex = initialIndex;
        centerIndex(initialIndex, "auto");
        scheduleSettlement();
      });
    })();

    return () => {
      if (settleTimer !== undefined) clearTimeout(settleTimer);
    };
  });
</script>

<div class="relative">
  <div
    class="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-40 -translate-x-1/2 border border-[var(--primary-full)]"
    style="pointer-events:none;"
  ></div>

  <div
    class="group flex h-10 min-h-10 w-140 border border-[var(--primary-strong)] transition-colors hover:border-[var(--primary-full)] cursor-pointer"
  >
    <button
      class="flex h-10 w-10 items-center justify-center border-r border-[var(--primary-strong)] text-[var(--primary-full)] transition-colors group-hover:border-[var(--primary-full)]"
      onclick={previous}
      type="button"
      aria-label="Previous option"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="lucide lucide-chevron-left"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><polyline points="15 18 9 12 15 6" /></svg
      >
    </button>

    <div
      class="relative min-w-0 flex-1 h-10 shrink-0 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide"
      style="touch-action: pan-x; scroll-snap-type:x mandatory; scroll-padding-inline:160px;"
      bind:this={viewport}
      role="presentation"
      onscroll={handleScroll}
      onwheel={handleWheel}
    >
      <div
        class="inline-flex h-10"
        role="listbox"
        style="min-width:max-content;"
      >
        <div class="h-10 w-40 shrink-0"></div>
        {#each options as option, i}
          <div
            class="flex h-10 w-40 shrink-0 items-center justify-center font-[Oxanium,sans-serif] text-sm tracking-[0.08em] uppercase transition-opacity transition-transform"
            style={`
              scroll-snap-align: center;
              opacity: ${i === selected ? 1 : i === selected - 1 || i === selected + 1 ? 0.92 : 0.72};
              transform: scale(${i === selected ? 1.03 : 0.98});
              color: ${i === selected ? "var(--primary-full)" : "var(--primary-strong)"};
              font-weight: ${i === selected ? 700 : 600};
              text-shadow: ${i === selected ? "0 0 14px rgba(130,220,255,.55)" : "0 0 4px rgba(130,220,255,.15)"};
            `}
            data-index={i}
            role="option"
            aria-selected={i === selected}
          >
            {option.label}
          </div>
        {/each}
        <div class="h-10 w-40 shrink-0"></div>
      </div>
    </div>

    <button
      class="flex h-10 w-10 items-center justify-center border-l border-[var(--primary-strong)] text-[var(--primary-full)] transition-colors group-hover:border-[var(--primary-full)]"
      onclick={next}
      type="button"
      aria-label="Next option"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="lucide lucide-chevron-right"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg
      >
    </button>
  </div>
</div>

<style>
  .scrollbar-hide {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
