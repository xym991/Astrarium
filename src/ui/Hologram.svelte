<script lang="ts">
  let width = $state(window.innerWidth);
  let height = $state(window.innerHeight);

  const MARGIN = 8;

  $effect(() => {
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  });

  const cx = $derived(width / 2);
  const cy = $derived(height / 2);

  const hexWidth = $derived(Math.min(height * 0.24, width * 0.3));

  const tipOffset = $derived(Math.min(height * 0.6, width * 0.9));

  const leftX = $derived(cx - hexWidth);
  const rightX = $derived(cx + hexWidth);

  const leftTipX = $derived(cx - tipOffset);
  const rightTipX = $derived(cx + tipOffset);

  const ringRadius = $derived(Math.min(width, height) * 0.04);

  const corner = 48;
</script>

<div class="fixed inset-0 z-[1000] pointer-events-none">
  <svg
    class="absolute inset-0 h-full w-full"
    viewBox={`0 0 ${width} ${height}`}
  >
    <defs>
      <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- outer frame -->
    <rect
      x={MARGIN}
      y={MARGIN}
      width={width - MARGIN * 2}
      height={height - MARGIN * 2}
      class="fill-none stroke-[var(--primary)] [stroke-width:1]"
    />

    <!-- corner accents -->

    <path
      class="fill-none stroke-[var(--primary-strong)] [stroke-width:1]"
      d={`
        M ${MARGIN} ${corner}
        V ${MARGIN}
        H ${corner}
      `}
    />

    <path
      class="fill-none stroke-[var(--primary-strong)] [stroke-width:1]"
      d={`
        M ${width - corner} ${MARGIN}
        H ${width - MARGIN}
        V ${corner}
      `}
    />

    <path
      class="fill-none stroke-[var(--primary-strong)] [stroke-width:1]"
      d={`
        M ${MARGIN} ${height - corner}
        V ${height - MARGIN}
        H ${corner}
      `}
    />

    <path
      class="fill-none stroke-[var(--primary-strong)] [stroke-width:1]"
      d={`
        M ${width - corner} ${height - MARGIN}
        H ${width - MARGIN}
        V ${height - corner}
      `}
    />

    <!-- center structure -->

    <!-- <path
      class="fill-none stroke-[var(--primary)] [stroke-width:1]"
      d={`
    M ${leftX} ${MARGIN}
    L ${leftTipX} ${cy}
    L ${leftX} ${height - MARGIN}
    L ${rightX} ${height - MARGIN}
    L ${rightTipX} ${cy}
    L ${rightX} ${MARGIN}
    Z
  `}
    />

    <line
      class="fill-none stroke-[var(--primary)] [stroke-width:1]"
      x1={cx - ringRadius}
      y1={cy}
      x2={MARGIN}
      y2={cy}
    />

    <line
      class="fill-none stroke-[var(--primary)] [stroke-width:1]"
      x1={cx + ringRadius}
      y1={cy}
      x2={width - MARGIN}
      y2={cy}
    />

    <circle
      class="fill-none stroke-[var(--primary-strong)] [stroke-width:1]"
      {cx}
      {cy}
      r={ringRadius}
    />

    <circle
      class="fill-none stroke-[var(--primary-faint)] [stroke-width:1]"
      {cx}
      {cy}
      r={ringRadius * 0.7}
    /> -->
  </svg>

  <div class="absolute top-8 left-8 pointer-events-auto">
    <slot name="top-left" />
  </div>

  <div class="absolute top-8 right-8 pointer-events-auto">
    <slot name="top-right" />
  </div>

  <div class="absolute bottom-12 left-12 pointer-events-auto">
    <slot name="bottom-left" />
  </div>

  <div class="absolute bottom-12 left-1/2 pointer-events-auto -translate-x-1/2">
    <slot name="bottom-center" />
  </div>

  <div class="absolute right-12 bottom-12 pointer-events-auto">
    <slot name="bottom-right" />
  </div>
</div>
