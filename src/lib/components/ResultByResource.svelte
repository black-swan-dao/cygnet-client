<script>
  import Row from "$lib/components/Row.svelte"
  import { resourcesInCycle } from "$lib/data.js"
  import get from "lodash/get.js"
  export let list = []
  console.log(list)
  console.log($resourcesInCycle)
</script>

<div class="list">
  <div class="body">
    {#each $resourcesInCycle as resource}
      <div class="resource-container">
        <a
          href={"/resources/" + get(resource, "slug.current", "")}
          sveltekit:prefetch
          class="resource-header">{resource.title}</a
        >
        {#each list.filter(p => p.resources.filter(r => r._ref === resource._id).length > 0) as item}
          <Row phase="result" {item} />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  .list {
    padding-bottom: 40px;

    .body {
      width: 100%;
      margin-right: auto;
      margin-left: auto;

      .resource-container {
        margin-bottom: 40px;
        border-bottom: 2px solid var(--main-color);

        .resource-header {
          display: block;
          height: 40px;
          border-top: 2px solid var(--main-color);
          border-left: 2px solid var(--main-color);
          border-right: 2px solid var(--main-color);
          color: var(--main-color);
          padding-left: 10px;
          line-height: 40px;
          text-decoration: none;

          &:hover {
            background: var(--main-color-three);
          }
        }
      }
    }
  }
</style>
