<script lang="ts">
  import { Info } from "lucide-svelte";
  import Telemetry from "../state/telemetry.svelte";
  import Button from "./shared/Button.svelte";

  const body = $derived(Telemetry.get("focusedBody"));

  function formatNumber(value: number, maximumFractionDigits = 4) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits,
    }).format(value);
  }

  function formatDuration(days: number | null) {
    if (days === null) return "—";

    const prefix = days < 0 ? "−" : "";
    const value = Math.abs(days);
    if (value < 1) return `${prefix}${formatNumber(value * 24, 3)} h`;
    if (value < 365) return `${prefix}${formatNumber(value, 3)} d`;
    return `${prefix}${formatNumber(value / 365.25, 2)} yr`;
  }

  function formatDistance(kilometres: number) {
    if (kilometres === 0) return "System centre";
    return `${formatNumber(kilometres)} km`;
  }
</script>

{#if body}
  <section
    class="fixed right-6 bottom-6 z-[1001] w-fit lg:w-125 border border-(--primary-strong) p-4 font-[Oxanium,sans-serif] text-(--primary-full) backdrop-blur-xs backdrop-saturate-150"
    aria-label="Selected celestial body"
  >
    <header class="flex items-start justify-between gap-3 border-(--primary)">
      <div class="min-w-0 flex items-start justify-start flex-col gap-0.5">
        <div class="text-[0.66rem] tracking-[0.16em] text-white uppercase">
          {body.type}
        </div>
        <div class="flex items-center gap-2 justify-start">
          <div
            class="h-2.5 w-2.5 rounded-full"
            style={`background-color: ${body.color}`}
          ></div>
          <h2
            class="truncate text-lg leading-none font-medium tracking-[0.08em]"
          >
            {body.name}
          </h2>
        </div>
      </div>

      <Button
        class="h-8 w-8 shrink-0 p-0"
        ariaLabel={`Information about ${body.name}`}
      >
        <Info size={16} strokeWidth={1.8} />
      </Button>
    </header>

    <dl class="grid grid-cols-2 gap-2 lg:grid-cols-3 pt-1 lg:pt-3">
      {#each [{ label: "Radius", value: `${formatNumber(body.radius)} km` }, { label: "Semi-Major Axis", value: formatDistance(body.semiMajorAxis) }, { label: "Orbital Period", value: formatDuration(body.orbitalPeriod) }, { label: "Rotation Period", value: formatDuration(body.rotationPeriod) }, { label: "Axial Tilt", value: `${formatNumber(body.axisTilt, 2)}°` }, { label: "Orbit Eccentricity", value: formatNumber(body.eccentricity, 4) }] as item}
        <div
          class="
        flex flex-col gap-0.5
        rounded-none
        border border-(--primary)
        bg-[rgba(130,220,255,0.03)]
        p-2
        transition-colors
        hover:border-(--primary-full)
        hover:bg-[rgba(130,220,255,0.05)]
      "
        >
          <dt class="text-[0.58rem] uppercase tracking-[0.16em] text-white">
            {item.label}
          </dt>

          <dd
            class="text-sm font-medium tracking-[0.04em] text-(--primary-full)"
          >
            {item.value}
          </dd>
        </div>
      {/each}
    </dl>
  </section>
{/if}
