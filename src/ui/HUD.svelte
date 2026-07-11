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

  const hexWidth = $derived(Math.min(width * 0.1, 300));

  const tipOffset = $derived(Math.min(width * 0.3, 900));

  const leftX = $derived(cx - hexWidth);
  const rightX = $derived(cx + hexWidth);

  const leftTipX = $derived(cx - tipOffset);
  const rightTipX = $derived(cx + tipOffset);

  const ringRadius = $derived(Math.min(width, height) * 0.04);

  const corner = 48;
</script>

<div class="hud">
  <svg class="frame" viewBox={`0 0 ${width} ${height}`}>
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
      class="line"
    />

    <!-- corner accents -->

    <path
      class="line strong"
      d={`
        M ${MARGIN} ${corner}
        V ${MARGIN}
        H ${corner}
      `}
    />

    <path
      class="line strong"
      d={`
        M ${width - corner} ${MARGIN}
        H ${width - MARGIN}
        V ${corner}
      `}
    />

    <path
      class="line strong"
      d={`
        M ${MARGIN} ${height - corner}
        V ${height - MARGIN}
        H ${corner}
      `}
    />

    <path
      class="line strong"
      d={`
        M ${width - corner} ${height - MARGIN}
        H ${width - MARGIN}
        V ${height - corner}
      `}
    />

    <!-- center structure -->

    <path
      class="line"
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

    <line class="line" x1={cx - ringRadius} y1={cy} x2={0} y2={cy} />

    <line class="line" x1={cx + ringRadius} y1={cy} x2={width} y2={cy} />

    <!-- <line class="line" x1={MARGIN} y1={cy} x2={width - MARGIN} y2={cy} /> -->
    <!-- side connectors -->

    <!-- <line class="line" x1={MARGIN} y1={cy} x2={leftTipX} y2={cy} />

    <line class="line" x1={rightTipX} y1={cy} x2={width - MARGIN} y2={cy} /> -->

    <!-- center ring -->

    <circle class="line strong" {cx} {cy} r={ringRadius} />

    <circle class="line faint" {cx} {cy} r={ringRadius * 0.7} />
  </svg>

  <div class="top-left">
    <slot name="top-left" />
  </div>

  <div class="top-right">
    <slot name="top-right" />
  </div>

  <div class="bottom-left">
    <slot name="bottom-left" />
  </div>

  <div class="bottom-center">
    <slot name="bottom-center" />
  </div>

  <div class="bottom-right">
    <slot name="bottom-right" />
  </div>
</div>

<style>
  .hud {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1000;
  }

  .frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .line {
    fill: none;
    stroke: var(--primary);
    stroke-width: 1;
    /* filter: url(#glow); */
  }

  .line.strong {
    stroke: var(--primary-strong);
  }

  .line.faint {
    stroke: var(--primary-faint);
  }

  .dot {
    fill: var(--primary-full);
    filter: url(#glow);
  }

  .top-left,
  .top-right,
  .bottom-left,
  .bottom-center,
  .bottom-right {
    position: absolute;
    pointer-events: auto;
  }

  .top-left {
    top: 32px;
    left: 32px;
  }

  .top-right {
    top: 32px;
    right: 32px;
  }

  .bottom-left {
    bottom: 48px;
    left: 48px;
  }

  .bottom-center {
    left: 50%;
    bottom: 48px;
    transform: translateX(-50%);
  }

  .bottom-right {
    right: 48px;
    bottom: 48px;
  }
</style>
