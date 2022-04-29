<script>
  import { profileMeta } from "$lib/authentication.js"
  import get from "lodash/get.js"
  import debounce from "lodash/debounce.js"
  import List from "$lib/components/List.svelte"
  import SectionHeader from "$lib/components/SectionHeader.svelte"
  import Redirector from "$lib/components/Redirector.svelte"
  import CountDown from "$lib/components/CountDown.svelte"
  import Ellipsis from "$lib/components/Ellipsis.svelte"
  import Locked from "$lib/graphics/Locked.svelte"
  import { submittedProposalsInCycle } from "$lib/data.js"
  import { currentCycle } from "$lib/cycles.js"
  import { currentSection, compactDateTimeFormat } from "$lib/ui.js"
  currentSection.set("vote")
  import {
    remainingVoiceCredits,
    voteAllocation,
    totalEffectiveVotes,
  } from "$lib/voting.js"
  import { setVote, getVote } from "$lib/api-interface.js"
  import { onMount } from "svelte"

  let lastSavedAt = false
  let votesLoaded = false
  let saving = false
  let submitted = false

  // Save votes on change
  voteAllocation.subscribe(
    debounce(vA => {
      if (!votesLoaded) {
        console.log("!!! VOTES NOT LOADED YET")
        return
      }
      saving = true
      setVote(
        $currentCycle._id,
        $voteAllocation,
        $profileMeta.voteMultiplier,
        $profileMeta.voteMultiplierRole || "Audience",
        false
      ).then(v => {
        lastSavedAt = v._updatedAt
        saving = false
      })
    }, 1000)
  )

  const submitVote = () => {
    saving = true
    setVote(
      $currentCycle._id,
      $voteAllocation,
      $profileMeta.voteMultiplier,
      $profileMeta.voteMultiplierRole || "Audience",
      !submitted
    ).then(v => {
      lastSavedAt = v._updatedAt
      saving = false
      submitted = !submitted
    })
  }

  const voteDoc = getVote($currentCycle._id)

  voteDoc.then(vD => {
    lastSavedAt = vD.lastSavedAt
    submitted = vD.submitted
  })

  onMount(async () => {
    // !!! HACK
    setTimeout(() => {
      votesLoaded = true
    }, 2000)
  })
</script>

{#if $currentCycle.phase == "vote"}
  <SectionHeader title="Vote" description={$currentCycle.textVote} />
  {#await voteDoc then voteDoc}
    <!-- <div class="submit-header">
      <div class="role-section">
        <div class="item">
          <div class="label">Vote role</div>
          <div class="content">
            {#if $profileMeta && $profileMeta.voteMultiplierRole}
              {$profileMeta.voteMultiplierRole}
            {:else}
              🍇 Audience
            {/if}
          </div>
        </div>
        <div class="item vote-weight">
          <div class="label">Vote weight</div>
          <div class="content">
            {$profileMeta.voteMultiplier}×
          </div>
        </div>
      </div> -->
    <!-- <div class="submit-vote" class:submitted on:click={submitVote}>
        {#if submitted}<Locked /> Vote submitted on {compactDateTimeFormat(
            lastSavedAt
          )}{:else}Submit vote{/if}
      </div> -->
    <!-- </div> -->
    <div class="vote-header">
      <div class="item small">
        <div class="label">Remaining voice credits</div>
        <div class="content">{$remainingVoiceCredits}</div>
      </div>
      <div class="item small">
        <div class="label">Total effective votes</div>
        <div class="content">{$totalEffectiveVotes.toFixed(2)}</div>
      </div>
      <div class="item">
        <div class="label">Vote closing in</div>
        <div class="content"><CountDown /></div>
      </div>
      <div class="item mid">
        <div class="label">Last saved</div>
        <div class="content last-saved">
          {#if saving}
            <Ellipsis />
          {:else}
            <div>
              {lastSavedAt ? compactDateTimeFormat(lastSavedAt) : ""}
            </div>
          {/if}
        </div>
      </div>
    </div>
    <div class="vote-container" class:submitted>
      <List
        list={$submittedProposalsInCycle}
        phase="vote"
        initialVote={voteDoc.votes}
      />
    </div>
    <div class="main-submit" class:submitted on:click={submitVote}>
      {#if submitted}<Locked /> Vote submitted on {compactDateTimeFormat(
          lastSavedAt
        )}{:else}Submit vote{/if}
    </div>
  {/await}
{:else}
  <Redirector />
{/if}

<style lang="scss">
  @import "../../variables.scss";

  .vote-header {
    width: 100%;
    height: 120px;
    border: 2px solid var(--main-color);
    display: flex;
    font-size: $font-size-x-small;
    font-family: $secondary-font;
    margin-bottom: 20px;

    @include screen-size("small") {
      height: 240px;
      flex-wrap: wrap;
      margin-bottom: 60px;
    }

    .item {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 2px solid var(--main-color);

      @include screen-size("small") {
        width: 100%;
        height: 80px;
      }

      &.small {
        width: 260px;

        @include screen-size("small") {
          width: 50%;
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

        @include screen-size("small") {
          height: 25px;
          line-height: 25px;
        }
      }

      .content {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $font-size-normal;
        font-family: $primary-font;
        color: $foreground-color;
        padding-left: 10px;
        padding-right: 10px;

        @include screen-size("small") {
          height: 55px;
        }
      }
    }
  }

  .submit-header {
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;

    @include screen-size("small") {
      justify-content: stretch;
    }

    .role-section {
      display: flex;

      @include screen-size("small") {
        width: 100%;
      }

      .item {
        display: flex;
        align-items: center;
        border: 2px solid var(--main-color);
        flex-direction: column;

        @include screen-size("small") {
          width: 50%;
        }

        &.vote-weight {
          min-width: 100px;
        }

        &:last-child {
          border-left: none;
        }

        .label {
          height: 25px;
          background: var(--main-color);
          font-size: $font-size-xx-small;
          font-family: $secondary-font;
          color: $light-color;
          width: 100%;
          text-align: center;
          line-height: 25px;
        }

        .content {
          height: 55px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: $font-size-small;
          font-family: $primary-font;
          padding-left: 20px;
          padding-right: 20px;
          color: $foreground-color;
        }
      }
    }
  }

  .submit-vote {
    display: inline-block;
    padding-left: 20px;
    padding-right: 20px;
    height: 80px;
    border: 2px solid var(--main-color);
    color: inherit;
    text-decoration: none;
    line-height: 80px;
    color: var(--main-color);
    font-size: $font-size-normal;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: var(--main-color);
      color: $foreground-color;
    }

    // &.submitted {
    //   pointer-events: none;
    // }
  }

  .vote-container {
    &.submitted {
      opacity: 0.65;
      // filter: grayscale(1);
      pointer-events: none;
      cursor: not-allowed;
    }
  }

  .last-saved {
    font-size: $font-size-mid !important;
    font-family: $secondary-font;
    letter-spacing: -0.05em;
  }

  .main-submit {
    display: block;
    padding-left: 20px;
    padding-right: 20px;
    // border: 2px solid var(--main-color);
    color: inherit;
    text-decoration: none;
    line-height: 80px;
    font-size: $font-size-large;
    cursor: pointer;
    user-select: none;
    text-align: center;
    margin-bottom: 80px;
    background: var(--main-color);
    color: $light-color;
    border: 2px solid var(--main-color);

    &.submitted {
      border: 2px solid var(--main-color);
      color: var(--main-color);
      background: transparent;
    }

    &:hover {
      border: 2px solid var(--main-color-two);
      background: var(--main-color-two);
      color: $foreground-color;
    }

    @include screen-size("small") {
      height: auto;
      line-height: 1.4em;
      padding: 30px 10px;
    }
  }
</style>
