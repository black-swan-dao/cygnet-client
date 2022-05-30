<script>
  import { submitProposal, unsubmitProposal } from "$lib/api-interface.js"
  import Unlocked from "$lib/graphics/Unlocked.svelte"
  export let item = {}
</script>

<div
  class="submit-button"
  class:submitted={item.submitted}
  on:click={() => {
    if (item.submitted) {
      // item.submitted = false
      unsubmitProposal(item)
    } else {
      // item.submitted = true
      submitProposal(item)
    }
  }}
>
  <div>
    <span class="main-text">
      {#if item.submitted}✓{:else}Submit{/if}
    </span>
    <span class="unlock"><Unlocked /></span>
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

    .unlock {
      display: none;
    }

    &:hover {
      background: var(--main-color);
      color: $light-color;
    }

    &.submitted {
      // cursor: default;
      // pointer-events: none;
      background: var(--main-color);

      &:hover {
        background: unset;
        color: black;

        .unlock {
          display: block;
        }

        .main-text {
          display: none;
        }
      }
    }
  }
</style>
