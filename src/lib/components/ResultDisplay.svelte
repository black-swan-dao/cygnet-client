<script>
  import tippy from "tippy.js"
  import "tippy.js/dist/tippy.css"
  import { onMount } from "svelte"

  export let item = {}
  let eVBar = {}
  onMount(async () => {
    tippy(eVBar, {
      content:
        Math.abs(item.percentageOfEffectiveVotes.toFixed(2)) +
        "% of effective votes",
    })
  })
</script>

<div class="result-display" bind:this={eVBar}>
  <div class="number">
    <div class="label">Effective votes</div>
    <div class="content">{item.effectiveVotes.toFixed(2)}</div>
  </div>
  <div class="bar">
    <div
      class="inner"
      style={`height: ${Math.abs(item.percentageOfEffectiveVotes)}%`}
    />
  </div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  .result-display {
    display: flex;
    width: 100%;
  }

  .bar {
    width: calc(100% - 100px);
    height: 100%;
    width: 100%;
    padding: 0;
    pointer-events: none;
    display: flex;
    border-top: 2px solid var(--main-color);

    .inner {
      width: 100%;
      background: var(--highlight-color);
      align-self: flex-end;
    }
  }

  .number {
    width: 160px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 2px solid var(--main-color);
    flex-direction: column;
    border-top: 2px solid var(--main-color);

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
    }
  }
</style>
