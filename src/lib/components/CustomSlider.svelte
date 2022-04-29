<script>
  import { remainingVoiceCredits } from "$lib/voting.js"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let voiceCredits = 0
  let blockerWidth = 0
  let markerPosition = 50
  let drag = false

  const setMarkerPosition = e => {
    let sliderWidth = e.target.offsetWidth
    let clickPosition = e.offsetX
    let clickPercentage = (clickPosition / sliderWidth) * 100
    // console.log(clickPercentage)
    let newVoiceCredits = Math.round((clickPercentage - 50) * 2)
    // console.log("newVoiceCredits", newVoiceCredits)
    dispatch("updateVoiceCredits", {
      voiceCredits: newVoiceCredits,
    })
  }

  const mouseEventListener = e => {
    setMarkerPosition(e)
  }

  const touchEventListener = e => {
    console.log(e)
    let sliderWidth = e.target.offsetWidth
    console.log("sliderWidth", sliderWidth)
    const bcr = e.target.getBoundingClientRect()
    const offsetX = e.targetTouches[0].clientX - bcr.x
    let touchPosition = e.touches[0].clientX
    console.log("touchPosition", touchPosition)
    console.log("offsetX ", offsetX)
    let touchPercentage = (offsetX / sliderWidth) * 100
    console.log("touchPercentage", touchPercentage)
    let newVoiceCredits = Math.round((touchPercentage - 50) * 2)
    console.log("newVoiceCredits", newVoiceCredits)
    // setMarkerPosition(e)
    dispatch("updateVoiceCredits", {
      voiceCredits: newVoiceCredits,
    })
  }

  $: {
    markerPosition = 50 + Math.round(voiceCredits / 2)
  }

  $: {
    if (voiceCredits > 0) {
      blockerWidth = Math.abs(
        50 - Math.round($remainingVoiceCredits / 2 + voiceCredits / 2)
      )
    } else {
      blockerWidth = Math.abs(
        50 - Math.round($remainingVoiceCredits / 2 - voiceCredits / 2)
      )
    }
  }

  const startDrag = () => {
    console.log("start drag")
    document.addEventListener("mousemove", mouseEventListener)
    document.addEventListener("touchmove", touchEventListener)
  }

  const endDrag = () => {
    console.log("end drag")
    document.removeEventListener("mousemove", mouseEventListener)
    document.removeEventListener("touchmove", touchEventListener)
  }

  // $: console.log("blockerWidth", blockerWidth)
</script>

<div class="custom-slider-container">
  <div
    class="slider"
    class:drag
    on:mousedown={e => {
      console.log("__ Mouse down", e)
      startDrag()
    }}
    on:mouseup={e => {
      console.log("__ Mouse up")
      endDrag()
    }}
    on:mouseleave={e => {
      console.log("__ Mouse leave")
      endDrag()
    }}
    on:mouseenter={e => {
      console.log("__ Mouse enter", e)
      if (e.buttons === 1) {
        startDrag()
      }
    }}
    on:touchstart={e => {
      console.log("__ Touch start", e)
      startDrag()
    }}
    on:touchend={e => {
      console.log("__ Touch end")
      endDrag()
    }}
    on:touchcancel={e => {
      console.log("__ Touch cancel")
      endDrag()
    }}
    on:click={e => {
      console.log("click")
      setMarkerPosition(e)
    }}
  />
  <div class="blocker-high" style={`width: ${blockerWidth}%;`} />
  <div class="blocker-low" style={`width: ${blockerWidth}%;`} />
  <div class="marker" style={`left: ${markerPosition}%;`} />
  <div class="center-line" />
  <!-- <div class="max-button">+</div>
  <div class="min-button">-</div> -->
</div>

<style lang="scss">
  @import "../../variables.scss";

  $slider-height: 24px;

  .max-button {
    position: absolute;
    right: -18px;
    top: 2px;
    // background: rgba(255, 255, 255, 0.8);
    width: 20px;
    height: 20px;
    text-align: center;
    cursor: pointer;
    color: $light-color;
    border: 1px solid $foreground-color;
    border-radius: 50%;
    line-height: 18px;
  }

  .min-button {
    position: absolute;
    left: -18px;
    top: 2px;
    // background: rgba(255, 255, 255, 0.8);
    width: 20px;
    height: 20px;
    text-align: center;
    cursor: pointer;
    color: $light-color;
    border: 1px solid $foreground-color;
    border-radius: 50%;
    line-height: 16px;
  }

  .custom-slider-container {
    width: calc(100% - 40px);
    height: 100%;
    position: relative;
    margin-left: 20px;
    margin-right: 20px;

    .slider {
      width: 100%;
      height: $slider-height;
      position: absolute;
      top: 50%;
      margin-top: -10px;
      left: 0;
      background: var(--main-color);
      cursor: grab;

      &.drag {
        cursor: grabbing;
      }
    }

    .blocker-high {
      width: 20%;
      height: $slider-height;
      background: $secondary-three;
      position: absolute;
      top: 50%;
      margin-top: -10px;
      right: 0;
    }

    .blocker-low {
      width: 20%;
      height: $slider-height;
      background: $secondary-three;
      position: absolute;
      top: 50%;
      margin-top: -10px;
      left: 0;
    }

    .marker {
      position: absolute;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      // background: var(--main-color);
      background: var(--highlight-color);
      border: 1px solid $background-color;
      left: 0;
      top: calc(50% + 2px);
      transform: translateX(-50%) translateY(-50%);
      pointer-events: none;

      .grip {
        position: relative;
        top: 30px;
        left: -6px;
        height: 20px;
        width: 20px;
        background: $secondary-three;
        border-radius: 50%;
      }
    }

    .center-line {
      position: absolute;
      height: 100%;
      width: 1px;
      background: $secondary-three;
      left: 50%;
      top: 0;
      pointer-events: none;
      transform: translateX(-50%);
    }
  }
</style>
