<script lang="ts">
  import Frame from "./Frame.svelte";
  import Toggles from "./Toggles.svelte";
</script>

<Frame title="SETTINGS">
  <div class="content">
    <Toggles />
  </div>
</Frame>

<style>
  .content {
    display: flex;
    flex-direction: column;
    gap: 40px;

    width: 100%;
    height: 100%;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  h2 {
    margin: 0;

    color: var(--primary-full);

    font-family: "Oxanium", sans-serif;
    font-size: 18px;
    font-weight: 500;

    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
</style>
