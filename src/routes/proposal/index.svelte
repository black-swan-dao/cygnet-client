<script>
  import get from "lodash/get.js"
  import List from "$lib/components/List.svelte"
  import SectionHeader from "$lib/components/SectionHeader.svelte"
  import Redirector from "$lib/components/Redirector.svelte"
  import CountDown from "$lib/components/CountDown.svelte"
  import { proposalsInCycle } from "$lib/data.js"
  import { profileMeta } from "$lib/authentication.js"

  let proposalsInCycleByUser = []
  $: proposalsInCycleByUser = $proposalsInCycle.filter(p => {
    if (!p.authors || p.authors.length === 0) return false
    const authorIds = get(p, "authors", []).map(a => a._id)
    const isAuthor = authorIds.includes($profileMeta._id)
    if (isAuthor) return true
  })

  let proposalsInCycleByOthers = []
  $: proposalsInCycleByOthers = $proposalsInCycle.filter(p => {
    if (!p.authors || p.authors.length === 0) return false
    const authorIds = get(p, "authors", []).map(a => a._id)
    const isAuthor = !authorIds.includes($profileMeta._id)
    const isSubmitted = p.submitted
    if (isAuthor && isSubmitted) return true
  })

  import { currentCycle } from "$lib/cycles.js"
  import { currentSection } from "$lib/ui.js"
  currentSection.set("proposal")
</script>

{#if $currentCycle.phase == "proposal"}
  <SectionHeader title="Proposals" description={$currentCycle.textProposal} />

  <div class="proposal-header">
    <div class="item">
      <div class="label">Proposal phase closing in</div>
      <div class="content"><CountDown /></div>
    </div>
    <div>
      <a href="/editor" sveltekit:prefetch class="button">+ Make a proposal</a>
    </div>
  </div>

  {#if proposalsInCycleByUser && proposalsInCycleByUser.length > 0}
    <div class="header">Your Proposals</div>
    <List list={proposalsInCycleByUser} phase="proposal" />
  {:else}
    <div class="header">
      You have not created any proposals yet. <a
        href="/editor"
        sveltekit:prefetch>Click here to get started!</a
      >
    </div>
  {/if}

  {#if proposalsInCycleByOthers && proposalsInCycleByOthers.length > 0}
    <div class="header other-participants">Other Participants' Proposals</div>
    <List list={proposalsInCycleByOthers} phase="proposal" readonly={true} />
  {/if}
{:else}
  <Redirector />
{/if}

<style lang="scss">
  @import "../../variables.scss";

  .proposal-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;

    @include screen-size("small") {
      flex-wrap: wrap;
    }

    .item {
      display: flex;
      align-items: center;
      border: 2px solid var(--main-color);
      flex-direction: column;

      @include screen-size("small") {
        width: 100%;
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
      }
    }
  }

  .header {
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--main-color);
    &.other-participants {
      border-top: 1px solid var(--main-color);
      padding-top: 20px;
      margin-top: 20px;
    }
  }

  .button {
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
    user-select: none;

    @include screen-size("small") {
      margin-top: 20px;
    }

    &:hover {
      background: var(--main-color);
      color: $light-color;
    }
  }
</style>
