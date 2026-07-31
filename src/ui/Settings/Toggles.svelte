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

<section>
  <h2>ELEMENTS</h2>

  <div class="table">
    {#each toggles as item}
      <div class="row">
        <span class="name">
          {item.label}
        </span>

        <button
          class="toggle"
          class:on={values[item.key]}
          class:off={!values[item.key]}
          onclick={() => {
            toggle(item.key);
          }}
        >
          <span class="text">
            {values[item.key] ? "ON" : "OFF"}
          </span>

          <div class="track">
            <div class="thumb"></div>
          </div>
        </button>

        <div class="shortcut">
          {toggleShortcuts[item.key]}
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  h2 {
    margin: 0;

    font-family: Oxanium, sans-serif;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: white;
  }

  .table {
    display: flex;
    flex-direction: column;
    padding: 0 32px;
  }

  .row {
    all: unset;

    display: grid;
    grid-template-columns: 40% 30% 30%;

    align-items: center;

    padding: 16px 0;

    border-bottom: 1px solid var(--primary-faint);

    cursor: pointer;

    transition: border-color 0.2s;
  }

  .row:hover {
    border-color: var(--primary);
  }

  .name {
    justify-self: start;

    color: var(--primary-full);

    text-transform: uppercase;

    font-size: 14px;

    letter-spacing: 0.08em;
  }

  .toggle {
    justify-self: center;
    display: flex;
    align-items: center;
    gap: 12px;
    width: 190px;
    background: none;
    outline: none;
    border: none;
    cursor: pointer;
  }

  .text {
    width: 28px;

    text-align: right;

    font-size: 12px;

    letter-spacing: 0.18em;

    font-weight: 600;
  }

  .toggle.on .text {
    color: var(--primary-full);
  }

  .toggle.off .text {
    color: var(--danger);
  }

  .track {
    position: relative;

    width: 120px;
    height: 30px;

    border: 2px solid var(--primary);

    padding: 2px;

    box-sizing: border-box;

    overflow: hidden;
  }

  .thumb {
    position: absolute;

    top: 2px;

    width: 50%;

    bottom: 2px;

    transition:
      left 0.18s ease,
      background 0.18s ease;
  }

  .toggle.on .thumb {
    left: 2px;

    background: var(--primary-full);

    box-shadow: 0 0 10px rgba(130, 220, 255, 0.25);
  }

  .toggle.off .thumb {
    left: calc(50% - 2px);

    background: var(--danger);
  }

  .shortcut {
    justify-self: center;

    width: 42px;
    height: 42px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: 1px solid var(--primary);

    color: var(--primary-full);

    font-family: Oxanium, sans-serif;

    font-size: 15px;

    font-weight: 600;

    letter-spacing: 0.08em;

    transition: 0.18s;
  }

  .row:hover .shortcut {
    background: rgba(130, 220, 255, 0.05);

    border-color: var(--primary-full);
  }
</style>
