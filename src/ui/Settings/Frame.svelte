<script lang="ts">
  const MARGIN = 14;
  const CORNER = 42;
</script>

<div class="backdrop">
  <svg class="frame" viewBox="0 0 1000 700" preserveAspectRatio="none">
    <!-- outer border -->

    <rect
      x={MARGIN}
      y={MARGIN}
      width={1000 - MARGIN * 2}
      height={700 - MARGIN * 2}
      class="border"
    />

    <!-- corners -->

    <path
      class="corner"
      d={`
                M ${MARGIN} ${CORNER}
                V ${MARGIN}
                H ${CORNER}
            `}
    />

    <path
      class="corner"
      d={`
                M ${1000 - CORNER} ${MARGIN}
                H ${1000 - MARGIN}
                V ${CORNER}
            `}
    />

    <path
      class="corner"
      d={`
                M ${MARGIN} ${700 - CORNER}
                V ${700 - MARGIN}
                H ${CORNER}
            `}
    />

    <path
      class="corner"
      d={`
                M ${1000 - CORNER} ${700 - MARGIN}
                H ${1000 - MARGIN}
                V ${700 - CORNER}
            `}
    />

    <!-- title cut -->

    <!-- <line class="border" x1="36" y1="70" x2="964" y2="70" /> -->
  </svg>

  <div class="body">
    <slot />
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width: min(1200px, 80vw);
    height: min(750px, 90vh);

    background: transparent;
    pointer-events: all;

    backdrop-filter: blur(16px) saturate(150%);

    -webkit-backdrop-filter: blur(16px) saturate(150%);
  }

  .frame {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;
    pointer-events: all;
  }

  .border {
    fill: none;

    stroke: var(--primary);

    stroke-width: 1;
  }

  .corner {
    fill: none;

    stroke: var(--primary-strong);

    stroke-width: 2;
  }

  .header {
    position: absolute;

    left: 42px;
    right: 42px;

    top: 28px;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    color: var(--primary-full);

    font-family: "Oxanium", sans-serif;

    font-size: 22px;

    font-weight: 600;

    letter-spacing: 0.25em;

    text-transform: uppercase;
  }

  .body {
    position: absolute;
    inset: 56px;
    overflow-y: auto;
  }

  .body::-webkit-scrollbar {
    width: 4px;
  }

  .body::-webkit-scrollbar-thumb {
    background: var(--primary);
  }
</style>
