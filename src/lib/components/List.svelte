<script>
  import Row from "$lib/components/Row.svelte"
  export let list = []
  export let phase = ""
  export let initialVote = {}
</script>

<div class="list">
  <div class="body">
    {#each list as item (item._id)}
      <Row {item} {phase} {initialVote} />
    {/each}
  </div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  .list {
    padding-bottom: 40px;
    max-width: calc(100vw - 40px);

    .body {
      width: 100%;
      margin-right: auto;
      margin-left: auto;
      border-bottom: 2px solid var(--main-color);
    }
  }
</style>
