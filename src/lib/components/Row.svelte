<script>
  import VotingInterface from "./VotingInterface.svelte"
  import ResultDisplay from "./ResultDisplay.svelte"
  import SubmitButton from "./SubmitButton.svelte"
  import DeleteButton from "./DeleteButton.svelte"
  import Information from "./Information.svelte"
  export let item = {}
  export let phase = ""
  export let initialVote = {}
</script>

<div class="row" class:vote={phase === "vote" && item._type === "proposal"}>
  <div class="information">
    <Information {item} {phase} />
  </div>

  {#if phase === "proposal" && item._type === "proposal"}
    <div class="actions">
      <SubmitButton {item} />
      {#if !item.submitted}
        <DeleteButton {item} />
      {/if}
    </div>
  {/if}

  {#if phase === "vote"}
    <div class="voting-interface">
      <VotingInterface proposal={item} {initialVote} />
    </div>
  {/if}

  {#if phase === "result"}
    <div class="result">
      <ResultDisplay {item} />
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../../variables.scss";

  $bar-height: 80px;

  .row {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    justify-content: space-between;
    height: $bar-height;
    color: $foreground-color;
    border-left: 2px solid var(--main-color);
    border-right: 2px solid var(--main-color);
    user-select: none;

    .information {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      overflow: hidden;
      color: inherit;
      text-decoration: none;
      border-right: 2px solid var(--main-color);
      border-top: 2px solid var(--main-color);

      &:last-child {
        border-right: none;
      }

      @include screen-size("small") {
        height: 80px;
      }
    }

    .voting-interface {
      width: 100%;
      height: $bar-height;
    }

    .actions {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 200px;
      border-top: 2px solid var(--main-color);

      @include screen-size("small") {
        min-width: 80px;
      }
    }

    &.vote {
      @include screen-size("small") {
        flex-wrap: wrap;
        height: 240px;
        flex-direction: column;
        margin-bottom: 20px;
      }

      .information {
        width: 50%;
        @include screen-size("small") {
          width: 100%;
        }
      }

      .voting-interface {
        @include screen-size("small") {
          flex-wrap: wrap;
          height: 160px;
        }
      }

      .role-badge {
        display: none;
      }
    }
  }

  .result {
    width: 40%;
    display: flex;
    height: 100%;
  }
</style>
