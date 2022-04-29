<script>
  import get from "lodash/get.js"
  import Badge from "$lib/components/Badge.svelte"
  import { urlFor } from "$lib/sanity.js"
  export let item = {}
  export let phase = ""
  let path = ""
  if (item._type === "resource") path = "resources"
  if (item._type === "user") path = "peers"
  if (item._type === "proposal") {
    if (phase === "proposal") path = "editor"
    if (phase === "vote") path = "proposal"
    if (phase === "result") path = "proposal"
  }
</script>

<a
  sveltekit:prefetch
  href={`/${path}/${get(item, "slug.current")}`}
  class="information"
>
  <span class="image">
    <!-- AVATAR -->
    {#if item.avatarURL}
      <img src={item.avatarURL} />
    {/if}
    <!-- MAIN IMAGE -->
    {#if item.mainImage}
      <img
        src={urlFor(item.mainImage).quality(90).height(100).width(100).url()}
      />
    {/if}
  </span>
  <!-- TITLE / NAME -->
  <span class="title">{item.title ? item.title : item.name}</span>
  <!-- AUTHORS -->
  {#if phase !== "vote" && item.authors && Array.isArray(item.authors)}
    {#each item.authors as author (author._id)}
      <Badge text={author.name} />
    {/each}
  {/if}
  <!-- ROLES -->
  {#if item.roles && Array.isArray(item.roles)}
    <div class="roles">
      {#each item.roles.filter(r => r !== "Mod") as role (role)}
        <Badge text={role} />
      {/each}
    </div>
  {/if}
</a>

<style lang="scss">
  @import "../../variables.scss";

  $bar-height: 80px;

  .information {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 5px;
    cursor: pointer;
    color: inherit;
    text-decoration: none;

    &:hover {
      background: var(--main-color-three);
    }

    .image {
      width: 50px;
      height: 50px;
      min-width: 50px;
      overflow: hidden;
      margin-right: 10px;
      margin-left: 10px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: $font-size-normal;
      margin-right: 10px;
      position: relative;
      top: 2px;
      min-width: 100px;
    }

    .author {
      font-size: $font-size-small;
      margin-right: 2px;
      position: relative;
      position: relative;
      top: 2px;

      @include screen-size("small") {
        display: none;
      }
    }

    .roles {
      display: flex;
      @include screen-size("small") {
        display: none;
      }
    }
  }
</style>
