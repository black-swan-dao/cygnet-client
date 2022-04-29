<script>
  import { fade } from "svelte/transition"
  import tippy from "tippy.js"
  import "tippy.js/dist/tippy.css"
  import { currentCycle } from "$lib/cycles.js"
  import { intervalToDuration, isPast } from "date-fns"
  import { onMount } from "svelte"
  import { dateTimeFormat } from "$lib/ui.js"

  export let inline = false
  let months = 0
  let days = 0
  let hours = 0
  let minutes = 0
  let seconds = 0
  let duration = {}
  let targetTime = false
  $: {
    targetTime =
      $currentCycle.phase == "proposal"
        ? $currentCycle.midpoint
        : $currentCycle.end
    if (targetTime) {
      updateCounter()
    }
  }

  const updateCounter = () => {
    duration = intervalToDuration({
      start: new Date(),
      end: new Date(targetTime),
    })

    months = duration.months
    days = duration.days
    hours = String(duration.hours).padStart(2, "0")
    minutes = String(duration.minutes).padStart(2, "0")
    seconds = String(duration.seconds).padStart(2, "0")

    setTimeout(() => {
      updateCounter()
    }, 1000)
  }

  let cBElement = {}
  $: if (cBElement && cBElement._tippy) {
    cBElement._tippy.setContent(dateTimeFormat(targetTime))
  }
  onMount(async () => {
    tippy(cBElement, {
      content: dateTimeFormat(targetTime),
    })
  })
</script>

<div class="countdown" bind:this={cBElement} class:inline in:fade>
  {#if ($currentCycle.phase == "proposal" || $currentCycle.phase == "vote") && targetTime}
    <div class="counter">
      {#if isPast(new Date(targetTime))}
        Ended on {dateTimeFormat(targetTime)}
      {:else}{#if months > 0}{months} Months, {/if}{days} Days, {hours} Hours, {minutes}
        Minutes, {seconds} Seconds
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../../variables.scss";

  .countdown {
    font-size: $font-size-mid;
    font-family: $secondary-font;
    letter-spacing: -0.05em;
    word-spacing: -0.15em;
    color: $foreground-color;
    user-select: none;
    text-align: center;

    &.inline {
      font-size: $font-size-small;
      div {
        display: inline-block;
      }
    }
  }
</style>
