<script lang="ts">
  const MARGIN = 14;
  const CORNER = 42;
</script>

<div
  class="fixed top-1/2 left-1/2 z-[1000] h-[min(46.875rem,90vh)] w-[min(75rem,80vw)] -translate-x-1/2 -translate-y-1/2 bg-transparent backdrop-blur-xs backdrop-saturate-150 pointer-events-auto"
>
  <svg
    class="absolute inset-0 h-full w-full pointer-events-auto"
    viewBox="0 0 1000 700"
    preserveAspectRatio="none"
  >
    <!-- outer border -->

    <rect
      x={MARGIN}
      y={MARGIN}
      width={1000 - MARGIN * 2}
      height={700 - MARGIN * 2}
      class="fill-none stroke-[var(--primary)] [stroke-width:1]"
    />

    <!-- corners -->

    <path
      class="fill-none stroke-[var(--primary-strong)] [stroke-width:2]"
      d={`
                M ${MARGIN} ${CORNER}
                V ${MARGIN}
                H ${CORNER}
            `}
    />

    <path
      class="fill-none stroke-[var(--primary-strong)] [stroke-width:2]"
      d={`
                M ${1000 - CORNER} ${MARGIN}
                H ${1000 - MARGIN}
                V ${CORNER}
            `}
    />

    <path
      class="fill-none stroke-[var(--primary-strong)] [stroke-width:2]"
      d={`
                M ${MARGIN} ${700 - CORNER}
                V ${700 - MARGIN}
                H ${CORNER}
            `}
    />

    <path
      class="fill-none stroke-[var(--primary-strong)] [stroke-width:2]"
      d={`
                M ${1000 - CORNER} ${700 - MARGIN}
                H ${1000 - MARGIN}
                V ${700 - CORNER}
            `}
    />

    <!-- title cut -->

    <!-- <line class="border" x1="36" y1="70" x2="964" y2="70" /> -->
  </svg>

  <div class="body absolute inset-[3.5rem] overflow-y-auto">
    <slot />
  </div>
</div>

<style>
  .body::-webkit-scrollbar {
    width: 4px;
  }

  .body::-webkit-scrollbar-thumb {
    background: var(--primary);
  }
</style>
