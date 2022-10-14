<script>
  import List from "$lib/components/List.svelte"
  import SectionHeader from "$lib/components/SectionHeader.svelte"
  import { resourcesInCycle } from "$lib/data.js"
  import { currentSection } from "$lib/ui.js"
  currentSection.set("resources")
</script>

<SectionHeader title="Resources" />

{#if $resourcesInCycle && $resourcesInCycle.length > 0}
  <List list={$resourcesInCycle} />
{:else}
  <div class="header">No resources found</div>
{/if}

<style lang="scss">
  @import "../../variables.scss";

  .header {
    font-weight: bold;
    margin-bottom: 10px;
    color: $foreground-color;
  }
</style>
