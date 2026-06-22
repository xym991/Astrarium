<script lang="ts">
  import AppState from "../state";

  import type { BooleanKeys } from "../data";

  let {
    key,
  }: {
    key: BooleanKeys;
  } = $props();

  let value = $state(AppState.get(key));

  $effect(() => {
    const unsubscribe = AppState.subscribe(key, (newValue) => {
      value = newValue as boolean;
    });

    return unsubscribe;
  });

  $effect(() => {
    AppState.set(key, value);
  });
</script>

<div class="toggle-container">
  <label class="toggle-label">
    <span>{key}</span>

    <button
      title={key}
      role="switch"
      aria-checked={value}
      class:active={value}
      class="toggle"
      onclick={() => (value = !value)}
      type="button"
    >
      <span class="thumb"></span>
    </button>
  </label>
</div>

<style>
  .toggle-container {
    width: 300px;
    background: rgba(30, 30, 30, 0.9);
    padding: 10px 14px;
    border-radius: 12px;
    color: #fff;
    border: 1px solid #444;
    backdrop-filter: blur(8px);
  }

  .toggle-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    text-transform: capitalize;
    font-size: 14px;
    user-select: none;
  }

  .toggle {
    width: 52px;
    height: 28px;
    border: none;
    border-radius: 999px;
    background: #555;
    padding: 3px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      box-shadow 0.2s ease;
    position: relative;
  }

  .toggle:hover {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
  }

  .toggle.active {
    background: #4f8cff;
  }

  .thumb {
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    display: block;
    transition: transform 0.2s ease;
    transform: translateX(0);
  }

  .toggle.active .thumb {
    transform: translateX(24px);
  }
</style>
