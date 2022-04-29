<script>
  import CountDown from "$lib/components/CountDown.svelte"
  import get from "lodash/get.js"
  import ArrowRight from "$lib/graphics/ArrowRight.svelte"
  import { currentSection } from "$lib/ui.js"
  import { currentCycle, currentCyclePhaseName } from "$lib/cycles.js"
  import { renderBlockText } from "$lib/sanity"
  import { general } from "$lib/data.js"
  currentSection.set("home")
</script>

<div class="landing-container">
  <div class="column left">
    {#if !$currentCycle.phase}
      <div class="warning">
        <h1>No cycle found!</h1>
        <p>
          This is probably because you have not been assigned the required role
          on the Discord server.
        </p>
        <p>
          Please get it touch with your administrator to solve this. Or try
          logging out and in again if you have recently been assigned the role.
        </p>
      </div>
    {:else}
      <!-- COUNTDOWN -->
      {#if $currentCycle.phase == "proposal" || $currentCycle.phase == "vote"}
        <div class="box countdown">
          <div class="label">Current phase ending in</div>
          <div class="content"><CountDown /></div>
        </div>
      {/if}
      <!-- LINK-->
      <a href={$currentCycle.phase} class="box goto">
        <div class="content">Go to {$currentCycle.phase} <ArrowRight /></div>
      </a>
    {/if}
  </div>
  <div class="column right">
    <!-- CYCLE TITLE -->
    {#if $currentCycle.title}
      <h1>{$currentCycle.title}</h1>
    {/if}
    <!-- CYCLE INTRODUCTION -->
    {#if $currentCycle.textLanding}
      <div class="cycle-introduction">
        {@html renderBlockText(get($currentCycle, "textLanding.content", []))}
      </div>
    {/if}
    <!-- MAIN TITLE -->
    {#if $general.siteTitle}
      <h1>{$general.siteTitle}</h1>
    {/if}
    <!-- GENERAL INTRODUCTION -->
    {#if $general.landingPageText}
      <div class="landing-text">
        {@html renderBlockText(get($general, "landingPageText.content", []))}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @import "../variables.scss";

  h1 {
    font-size: $font-size-normal;
    color: var(--main-color);
    margin-top: 0;
  }

  a {
    color: inherit;
  }

  .landing-container {
    display: flex;
    justify-content: center;

    @include screen-size("small") {
      flex-wrap: wrap;
    }

    .column {
      width: 50%;
      max-width: 600px;
      color: $foreground-color;

      &.left {
        margin-right: 20px;

        .warning {
          font-size: $font-size-normal;

          h1 {
            color: $error-color;
          }
        }
      }

      &.right {
        margin-left: 20px;
        font-size: $font-size-normal;
      }

      @include screen-size("small") {
        width: 100%;

        &.left {
          margin-right: 0;
          padding-bottom: 20px;
          padding-top: 20px;
        }

        &.right {
          margin-left: 0;
        }
      }
    }
  }

  .cycle-introduction {
    margin-top: 20px;
    margin-bottom: 40px;
    font-size: $font-size-normal;
  }

  .box {
    border: 2px solid var(--main-color);
    margin-bottom: 20px;

    .label {
      height: 25px;
      background: var(--main-color);
      font-size: $font-size-x-small;
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
      font-size: $font-size-normal;
      font-family: $primary-font;
      padding-left: 10px;
      padding-right: 10px;
    }

    &.goto {
      cursor: pointer;
      color: var(--main-color);
      display: block;
      text-decoration: none;

      &:hover {
        background: var(--main-color);
        color: $light-color;
      }
    }
  }
</style>
