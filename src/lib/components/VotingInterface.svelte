<script>
  import CustomSlider from "$lib/components/CustomSlider.svelte"
  import tippy from "tippy.js"
  import "tippy.js/dist/tippy.css"
  import {
    remainingVoiceCredits,
    updateVoteAllocation,
    totalEffectiveVotes,
  } from "$lib/voting.js"
  import { onMount } from "svelte"
  import { profileMeta } from "$lib/authentication"

  export let proposal = {}
  export let initialVote = {}

  let voiceCredits = 0
  let voteSign = 1
  $: voteSign = voiceCredits > 0 ? 1 : -1
  // The quadratic voting function
  let effectiveVotes = 0
  $: effectiveVotes =
    Math.sqrt(Math.abs(voiceCredits)) *
    ($profileMeta.voteMultiplier || 1) *
    voteSign

  // Update when number of global state allocated vote credits changes
  $: updateVoteAllocation(proposal._id, voiceCredits)

  // Set the initial votes fetched from the server
  if (initialVote[proposal._id]) {
    voiceCredits = initialVote[proposal._id]
  }

  let effectiveVotesPercentage = 0
  $: effectiveVotesPercentage =
    effectiveVotes === 0
      ? 0
      : ((Math.abs(effectiveVotes) / $totalEffectiveVotes) * 100) /
        $profileMeta.voteMultiplier

  $: if (eVBar && eVBar._tippy) {
    eVBar._tippy.setContent(
      Math.round(effectiveVotesPercentage) + "% of effective votes"
    )
  }

  let eVBar = {}
  onMount(async () => {
    tippy(eVBar, {
      content: Math.round(effectiveVotesPercentage) + "% of effective votes",
    })
  })

  const zeroVoiceCredits = () => {
    voiceCredits = 0
  }

  const maxVoiceCredits = () => {
    voiceCredits = $remainingVoiceCredits
  }

  const minVoiceCredits = () => {
    voiceCredits = -$remainingVoiceCredits
  }
</script>

<div class="voting-interface">
  <!-- (2) VOICE CREDITS -->

  <div class="custom-slider">
    <CustomSlider
      {voiceCredits}
      on:maxVoiceCredits={maxVoiceCredits}
      on:minVoiceCredits={minVoiceCredits}
      on:updateVoiceCredits={e => {
        if (
          $remainingVoiceCredits +
            Math.abs(voiceCredits) -
            Math.abs(e.detail.voiceCredits) <
          0
        ) {
          console.log("!!! vote overflow", e.detail.voiceCredits)
        } else {
          voiceCredits = e.detail.voiceCredits
        }
      }}
    />
  </div>

  <div class="number-container">
    <!-- VOICE CREDITS -->
    <div class="voice-credits ">
      <div class="number" on:click={zeroVoiceCredits}>
        <div class="label">Voice credits</div>
        <div class="content">{voiceCredits}</div>
      </div>
    </div>
    <!-- (3) VOTE MULTIPLIER -->
    <div class="vote-multiplier" bind:this={eVBar}>
      <div class="number">
        <div class="label">Vote weight</div>
        <div class="content">{$profileMeta.voteMultiplier}×</div>
      </div>
    </div>
    <!-- (4) EFFECTIVE VOTES -->
    <div class="effective-votes" bind:this={eVBar}>
      <div class="number">
        <div class="label">Effective votes</div>
        <div class="content">{effectiveVotes.toFixed(2)}</div>
      </div>
      <div class="bar">
        <div
          class="inner"
          style={`height: ${Math.round(effectiveVotesPercentage)}%`}
        />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  $bar-height: 80px;

  .voting-interface {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    border-top: 2px solid var(--main-color);

    @include screen-size("small") {
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  }

  .custom-slider {
    width: calc(100% - 100px);
    float: left;
    height: 100%;
    padding: 0;
    position: relative;
    background: rgba(255, 255, 255, 0.8);

    @include screen-size("small") {
      width: 100%;
      height: 80px;
    }
  }

  .number-container {
    display: flex;

    @include screen-size("small") {
      width: 100%;
      display: flex;
    }

    .voice-credits {
      height: $bar-height;
      height: 100%;
      width: 100px;
      border-right: 2px solid var(--main-color);

      @include screen-size("small") {
        height: 80px;
        width: 33.33%;
        border-bottom: 2px solid var(--main-color);
      }

      .number {
        width: 100px;
        float: left;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        flex-direction: column;
        border-left: 2px solid var(--main-color);
        cursor: pointer;

        @include screen-size("small") {
          width: 100%;
        }

        .label {
          height: 25px;
          background: var(--main-color-two);
          font-size: $font-size-xx-small;
          font-family: $secondary-font;
          color: $light-color;
          width: 100%;
          text-align: center;
          line-height: 25px;
          overflow: hidden;
        }

        .content {
          height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .vote-multiplier {
      height: 100%;
      display: flex;
      width: 100px;

      @include screen-size("small") {
        height: 80px;
        width: 33.33%;
        border-bottom: 2px solid var(--main-color);
      }

      .number {
        width: 100px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 2px solid var(--main-color);
        flex-direction: column;

        @include screen-size("small") {
          width: 100%;
        }

        .label {
          height: 25px;
          background: var(--main-color-two);
          font-size: $font-size-xx-small;
          font-family: $secondary-font;
          color: $light-color;
          width: 100%;
          text-align: center;
          line-height: 25px;
          overflow: hidden;
        }

        .content {
          height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .effective-votes {
      height: 100%;
      display: flex;

      @include screen-size("small") {
        height: 80px;
        width: 33.33%;
        border-bottom: 2px solid var(--main-color);
      }

      .bar {
        width: 100px;
        height: 100%;
        padding: 0;
        display: flex;

        .inner {
          width: 100%;
          // background: var(--main-color);
          background: var(--highlight-color);
          align-self: flex-end;
        }

        @include screen-size("small") {
          display: none;
        }
      }

      .number {
        width: 100px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 2px solid var(--main-color);
        flex-direction: column;

        @include screen-size("small") {
          width: 100%;
        }

        .label {
          height: 25px;
          background: var(--main-color-two);
          font-size: $font-size-xx-small;
          font-family: $secondary-font;
          color: $light-color;
          width: 100%;
          text-align: center;
          line-height: 25px;
          overflow: hidden;
        }

        .content {
          height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
