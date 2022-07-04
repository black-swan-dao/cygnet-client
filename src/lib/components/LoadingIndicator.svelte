<script>
  import { Circle } from "svelte-loading-spinners"
  import { instance } from "$lib/data.js"
  export let dimmed = false
  const color = $instance.mainColor ? $instance.mainColor : "#191919"
</script>

<div class="processing-indicator" class:dimmed>
  <div class="inner">
    <div class="loading-indicator">
      <Circle size="60" {color} unit="px" duration="1s" />
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  .processing-indicator {
    position: fixed;
    top: 0%;
    left: 0%;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100000000;

    &.dimmed {
      background: rgba(0, 0, 0, 0.5);
    }

    .inner {
      font-size: 48px;
      color: white;
      animation: flash 1s linear infinite;

      .loading-indicator {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32px;
      }
    }
  }
</style>
