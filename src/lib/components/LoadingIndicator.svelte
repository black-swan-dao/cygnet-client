<script>
  import { Circle } from "svelte-loading-spinners"
</script>

<div class="loading-indicator">
  <Circle size="60" color="#191919" unit="px" duration="1s" />
</div>

<style lang="scss">
  @import "../../variables.scss";

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
</style>
