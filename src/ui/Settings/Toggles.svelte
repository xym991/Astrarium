<script lang="ts">
  import AppState, { toggleShortcuts } from "../../state";

  const values = $state({
    showLabels: AppState.get("showLabels"),
    showOrbits: AppState.get("showOrbits"),
    showTrails: AppState.get("showTrails"),
    showMoons: AppState.get("showMoons"),
    showIndicators: AppState.get("showIndicators"),
  });

  type ToggleKey = keyof typeof values;

  const toggles: {
    key: ToggleKey;
    label: string;
  }[] = [
    {
      key: "showLabels",
      label: "Planet Labels",
    },
    {
      key: "showOrbits",
      label: "Orbit Lines",
    },
    {
      key: "showTrails",
      label: "Orbit Trails",
    },
    {
      key: "showMoons",
      label: "Moons",
    },
    {
      key: "showIndicators",
      label: "Indicators",
    },
  ];

  function toggle(key: ToggleKey) {
    values[key] = !values[key];
    AppState.set(key, values[key]);
  }
</script>

<section class="flex flex-col gap-2">
  <div class="flex flex-col p-4">
    {#each toggles as item}
      <div
        class="group cursor-pointer flex flex-row justify-between items-center border-b border-[var(--primary-faint)] py-4 transition-colors duration-200 hover:border-[var(--primary)] max-w-[80vw] w-300"
      >
        <div class="flex gap-4 items-center">
          <div
            class="flex h-[2.625rem] w-[2.625rem] items-center justify-center justify-self-end border border-[var(--primary)] font-[Oxanium,sans-serif] text-[0.9375rem] font-semibold tracking-[0.08em] text-[var(--primary-full)] transition duration-[180ms] group-hover:border-[var(--primary-full)] group-hover:bg-[rgba(130,220,255,0.05)]"
          >
            {toggleShortcuts[item.key]}
          </div>
          <span
            class="justify-self-start text-[0.875rem] tracking-[0.08em] text-[var(--primary-full)] uppercase"
          >
            {item.label}
          </span>
        </div>

        <button
          class={`flex w-[11.875rem] cursor-pointer items-center justify-end gap-3 border-0 bg-transparent outline-none ${
            values[item.key]
              ? "text-[var(--primary-full)]"
              : "text-[var(--danger)]"
          }`}
          onclick={() => {
            toggle(item.key);
          }}
        >
          <span
            class="w-7 text-right text-[0.75rem] font-semibold tracking-[0.18em]"
          >
            {values[item.key] ? "ON" : "OFF"}
          </span>

          <div
            class="relative h-[1.875rem] w-[7.5rem] overflow-hidden border-1 border-(--primary) p-0.5 box-border"
          >
            <div
              class={`absolute top-0.5 bottom-0.5 w-1/2 transition-[left,background] duration-[180ms] ease-in-out ${
                values[item.key]
                  ? "left-0.5 bg-[var(--primary-full)] shadow-[0_0_0.625rem_rgba(130,220,255,0.25)]"
                  : "left-[calc(50%_-_0.125rem)] bg-[var(--danger)]"
              }`}
            ></div>
          </div>
        </button>
      </div>
    {/each}
  </div>
</section>
