<script>
  import List from "$lib/components/List.svelte"
  import SectionHeader from "$lib/components/SectionHeader.svelte"
  import Redirector from "$lib/components/Redirector.svelte"
  import { results } from "$lib/data.js"
  import { currentCycle } from "$lib/cycles.js"
  import { currentSection, dateTimeFormat } from "$lib/ui.js"
  currentSection.set("result")

  let currentResult = {}
  let list = []

  $: currentResult = $results.find(
    result => result.cycle._id === $currentCycle._id
  )

  $: {
    if (currentResult && currentResult.result) {
      list = currentResult.result.map(r => {
        r.proposal.effectiveVotes = r.effectiveVotes
        r.proposal.voteCredits = r.voteCredits
        r.proposal.percentageOfEffectiveVotes =
          (r.effectiveVotes / Math.abs(currentResult.totalEffectiveVotes)) * 100
        // r.proposal.percentageOfVoteCredits =
        //   (r.voteCredits / currentResult.totalVoteCredits) * 100
        return r.proposal
      })
    }
  }
</script>

{#if $currentCycle.phase == "result"}
  <SectionHeader title="Result" description={$currentCycle.textResult} />
  {#if currentResult}
    <div class="result-header">
      <div class="item small">
        <div class="label">Cycle</div>
        <div class="content">{currentResult.cycle.title}</div>
      </div>
      <div class="item">
        <div class="label">Counted on</div>
        <div class="content">
          {dateTimeFormat(currentResult._createdAt)}
        </div>
      </div>
      <div class="item small">
        <div class="label">Participants</div>
        <div class="content">{currentResult.numberOfParticipants}</div>
      </div>
      <div class="item small">
        <div class="label">Vote credits</div>
        <div class="content">{currentResult.totalVoteCredits}</div>
      </div>
      <div class="item small">
        <div class="label">Effective votes</div>
        <div class="content">
          {currentResult.totalEffectiveVotes.toFixed(2)}
        </div>
      </div>
    </div>

    <List {list} phase="result" />
  {:else}
    <div class="error">No result found</div>
  {/if}
{:else}
  <Redirector />
{/if}

<style lang="scss">
  @import "../../variables.scss";

  .result-header {
    width: 100%;
    height: 120px;
    border: 2px solid var(--main-color);
    display: flex;
    font-size: $font-size-x-small;
    font-family: $secondary-font;
    margin-bottom: 20px;

    @include screen-size("small") {
      flex-wrap: wrap;
      height: auto;
    }

    .item {
      width: 35%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 2px solid var(--main-color);

      @include screen-size("small") {
        width: 100%;
      }

      &.small {
        width: 260px;

        @include screen-size("small") {
          width: 100%;
        }
      }

      &.mid {
        width: 360px;

        @include screen-size("small") {
          width: 100%;
        }
      }

      &:last-child {
        border-right: none;
      }

      flex-direction: column;

      .label {
        height: 40px;
        background: var(--main-color);
        font-size: $font-size-xx-small;
        font-family: $secondary-font;
        color: $light-color;
        width: 100%;
        text-align: center;
        line-height: 40px;
      }

      .content {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $font-size-normal;
        font-family: $numeral-font;
        color: $foreground-color;

        @include screen-size("small") {
          height: 60px;
        }
      }
    }
  }

  .error {
    padding: 10px;
    border: 1px solid $error-color;
    display: inline-block;
    color: $error-color;
  }
</style>
