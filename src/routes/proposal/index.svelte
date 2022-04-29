<script>
  import get from "lodash/get.js"
  import List from "$lib/components/List.svelte"
  import SectionHeader from "$lib/components/SectionHeader.svelte"
  import Redirector from "$lib/components/Redirector.svelte"
  import CountDown from "$lib/components/CountDown.svelte"
  import { proposalsInCycleByUser } from "$lib/data.js"
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

  {#if $proposalsInCycleByUser && $proposalsInCycleByUser.length > 0}
    <div class="header">Your Proposals</div>
    <List list={$proposalsInCycleByUser} phase="proposal" />
  {:else}
    <div class="header">No proposals yet...</div>
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
      justify-content: flex-end;
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
