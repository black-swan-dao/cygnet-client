<script>
  import { deleteProposal } from "$lib/api-interface.js"
  import TrashCan from "$lib/graphics/TrashCan.svelte"
  export let item = {}
  let overlayActive = false

  const triggerOverlay = () => {
    overlayActive = !overlayActive
  }
</script>

<div
  class="delete-button"
  on:click={() => {
    triggerOverlay()
  }}
>
  <div><TrashCan /></div>
</div>

{#if overlayActive}
  <div
    class="delete-overlay"
    on:click={() => {
      triggerOverlay()
    }}
  >
    <div class="box">
      <div class="text">Are you sure you want to delete this proposal?</div>
      <div class="actions">
        <div
          class="btn cancel"
          on:click={() => {
            triggerOverlay()
          }}
        >
          Cancel
        </div>
        <div
          class="btn delete"
          on:click={() => {
            deleteProposal(item)
            triggerOverlay()
          }}
        >
          Delete
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @import "../../variables.scss";

  $bar-height: 80px;

  .delete-button {
    width: 50%;
    height: 100%;
    padding: 5px;
    display: flex;
    justify-content: center;
    border-left: 2px solid var(--main-color);
    align-items: center;
    user-select: none;
    cursor: pointer;
    text-align: center;
    font-size: $font-size-small;

    @include screen-size("small") {
      min-width: 60px;
    }

    &:hover {
      background: $error-color;
      // color: $light-color;
    }
  }

  .delete-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-normal;
    backdrop-filter: blur(10px);

    .box {
      background: $light-color;
      padding: 20px;
      max-width: 300px;

      .text {
        margin-bottom: 1em;
      }

      .actions {
        display: flex;
        justify-content: space-between;

        .btn {
          padding: 10px;
          margin-right: 10px;
          cursor: pointer;

          &.cancel {
            border: 1px solid var(--main-color);
            &:hover {
              background: var(--main-color);
            }
          }

          &.delete {
            border: 1px solid $error-color;

            &:hover {
              background: $error-color;
            }
          }
        }
      }
    }
  }
</style>
