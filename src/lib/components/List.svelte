<script>
  import Row from "$lib/components/Row.svelte"
  export let list = []
  export let phase = ""
  export let readonly = false
  export let initialVote = {}
</script>

<div class="list">
  <div class="body">
    {#each list as item (item._id)}
      <Row {item} {phase} {initialVote} {readonly} />
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
      border-bottom: 2px solid var(--main-color);
    }
  }
</style>
