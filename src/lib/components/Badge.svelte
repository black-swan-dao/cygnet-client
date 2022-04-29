<script>
  export let text = ""
</script>

<span class="role-badge">{text}</span>

<style lang="scss">
  @import "../../variables.scss";

  .role-badge {
    border: 1px solid var(--main-color);
    color: var(--main-color);
    margin-right: 5px;
    padding: 4px 7px;
    border-radius: 5px;
    font-family: $secondary-font;
    font-size: $font-size-x-small;
    position: relative;
    top: 2px;
    white-space: nowrap;
  }
</style>
