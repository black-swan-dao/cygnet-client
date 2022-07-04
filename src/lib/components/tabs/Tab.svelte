<script>
  import { getContext } from "svelte"
  import { TABS } from "./Tabs.svelte"

  const tab = {}
  const { registerTab, selectTab, selectedTab } = getContext(TABS)

  registerTab(tab)
</script>

<button class:selected={$selectedTab === tab} on:click={() => selectTab(tab)}>
  <slot />
</button>

<style lang="scss">
  @import "../../../variables.scss";

  button {
    background: none;
    border: none;
    border: 1px solid $foreground-color-dimmed;
    border-radius: 0;
    margin: 0;
    padding: 10px;
    color: $foreground-color-dimmed;
    font-size: $font-size-normal;
    cursor: pointer;
    user-select: none;

    &:hover {
      border: 1px solid var(--main-color);
      color: $foreground-color;
    }
  }

  .selected {
    border: 1px solid var(--main-color);
    color: $foreground-color;
  }
</style>
