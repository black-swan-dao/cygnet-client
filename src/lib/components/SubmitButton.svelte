<script>
  import { submitProposal } from "$lib/api-interface.js"
  export let item = {}
</script>

<div
  class="submit-button"
  class:submitted={item.submitted}
  on:click={() => {
    item.submitted = true
    submitProposal(item)
  }}
>
  <div>
    {#if item.submitted}✓{:else}Submit{/if}
  </div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  $bar-height: 80px;

  .submit-button {
    width: 100%;
    height: 100%;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;
    text-align: center;
    font-size: $font-size-normal;

    @include screen-size("small") {
      min-width: 60px;
    }

    &.submitted {
      cursor: default;
      pointer-events: none;
      background: var(--main-color);
    }

    &:hover {
      background: var(--main-color);
      color: $light-color;
    }
  }
</style>
