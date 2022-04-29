<script>
  import get from "lodash/get.js"
  import { renderBlockText } from "$lib/sanity"
  export let title = ""
  export let description = false
</script>

<div class="section-header">
  <h2>{title}</h2>
  {#if description}
    <div class="description">
      {@html renderBlockText(get(description, "content", []))}
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../../variables.scss";

  .section-header {
    margin-bottom: 40px;
    max-width: 90ch;
    color: $foreground-color;
    font-size: $font-size-normal;

    @include screen-size("small") {
      font-size: $font-size-mid;
    }

    h2 {
      font-size: $font-size-normal;
      color: var(--main-color);
    }
  }
</style>
