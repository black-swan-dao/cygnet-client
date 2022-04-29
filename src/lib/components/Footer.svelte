<script>
  import { currentSection } from "$lib/ui.js"
  import { general } from "$lib/data.js"
</script>

<footer>
  <div class="left">
    {#if $general.siteTitle}
      <div>{$general.siteTitle}</div>
    {:else}
      <div>Cygnet</div>
    {/if}
  </div>

  <div class="right">
    <a href="https://cyg.network" target="_blank">Cygnet</a>
  </div>
</footer>

<style lang="scss">
  @import "../../variables.scss";

  footer {
    width: calc(100% - 40px);
    margin-left: auto;
    margin-right: auto;
    max-width: 1240px;
    border-top: 1px solid $foreground-color;
    padding-bottom: 40px;
    padding-top: 10px;
    font-size: $font-size-x-small;
    font-family: $secondary-font;
    color: $foreground-color;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 100;

    a {
      color: inherit;
    }

    @include screen-size("small") {
      margin-top: 40px;
    }
  }
</style>
