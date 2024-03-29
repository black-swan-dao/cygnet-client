<script>
  import { urlFor } from "$lib/sanity.js"
  import get from "lodash/get.js"
  import { marked } from "marked"
  import Badge from "$lib/components/Badge.svelte"
  import { submittedProposalsInCycle } from "$lib/data.js"
  import { currentCycle } from "$lib/cycles.js"
  export let item = {}

  let proposalIndex = false
  let nextProposalSlug = ""
  let prevProposalSlug = ""

  $: nextProposalSlug = $submittedProposalsInCycle[proposalIndex + 1]
    ? get($submittedProposalsInCycle[proposalIndex + 1], "slug.current", "")
    : get($submittedProposalsInCycle[0], "slug.current", "")
  $: prevProposalSlug = $submittedProposalsInCycle[proposalIndex - 1]
    ? get($submittedProposalsInCycle[proposalIndex - 1], "slug.current", "")
    : get(
        $submittedProposalsInCycle[$submittedProposalsInCycle.length - 1],
        "slug.current",
        ""
      )

  const renderer = new marked.Renderer()
  const linkRenderer = renderer.link
  renderer.link = (href, title, text) => {
    const localLink = href.startsWith(
      `${location.protocol}//${location.hostname}`
    )
    const html = linkRenderer.call(renderer, href, title, text)
    return localLink
      ? html
      : html.replace(
          /^<a /,
          `<a target="_blank" rel="noreferrer noopener nofollow" `
        )
  }

  $: if (item._type == "proposal") {
    proposalIndex = $submittedProposalsInCycle.findIndex(
      proposal => proposal._id == item._id
    )
  }
</script>

<div class="single">
  <!-- NAVIGATION -->
  {#if item._type == "proposal" && $submittedProposalsInCycle.length > 1}
    <div class="navigation">
      <a
        href={prevProposalSlug}
        data-sveltekit-prefetch
        class="nav-button previous"
      >
        PREV
      </a>
      <a
        href={"/" + $currentCycle.phase}
        data-sveltekit-prefetch
        class="nav-button return"
      >
        BACK TO {$currentCycle.phase}
      </a>
      <a
        href={nextProposalSlug}
        data-sveltekit-prefetch
        class="nav-button next"
      >
        NEXT
      </a>
    </div>
  {/if}
  <div class="body">
    <div class="column left">
      <!-- CYCLE -->
      {#if item.cycle}
        <div class="cycle">
          <span>{item.cycle.title}</span>
        </div>
      {/if}
      <!-- TITLE -->
      {#if item.title}
        <h1>{item.title}</h1>
      {/if}
      <!-- NAME -->
      {#if item.name}
        <h1>{item.name}</h1>
      {/if}
      <!-- AUTHORS -->
      {#if item.authors && Array.isArray(item.authors)}
        <div class="authors">
          {#each item.authors as author, index (author._id)}
            <a
              href={`/peers/${get(author, "slug.current")}`}
              data-sveltekit-prefetch>{author.name}</a
            >{#if index < item.authors.length - 1},&nbsp;{/if}
          {/each}
        </div>
      {/if}
      <!-- ROLES -->
      {#if item.roles && Array.isArray(item.roles)}
        <div class="roles">
          {#each item.roles.filter(r => r !== "Mod") as role}
            <Badge text={role} />
          {/each}
        </div>
      {/if}
      <!-- DESCRIPTION -->
      <div class="description">
        {#if item.content}
          {@html marked.parse(item.content, { renderer })}
        {/if}
      </div>
      <!-- RESOURCES -->
      {#if item.resources && Array.isArray(item.resources) && item.resources.length > 0}
        <div class="resources">
          <div class="resources-header">Resources</div>
          <div class="resources-inner">
            {#each item.resources as resource, index (resource._id)}
              <div class="resource">
                – <a
                  href={`/resources/${get(resource, "slug.current")}`}
                  data-sveltekit-prefetch
                  >{resource.title}
                </a>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <div class="column right">
      <div class="image">
        <!-- IMAGE -->
        {#if item.mainImage}
          <img src={urlFor(item.mainImage).quality(90).width(800).url()} />
        {/if}
        <!-- AVATAR -->
        {#if item.avatarURL}
          <img src={item.avatarURL} />
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  .navigation {
    margin-bottom: 40px;
    width: 100%;
    max-width: 1240px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid $foreground-color;
    user-select: none;

    .nav-button {
      font-family: $secondary-font;
      font-size: $font-size-small;
      border: 1px solid $foreground-color;
      padding: 5px 10px;
      border-radius: 3px;
      text-decoration: none;
      color: $foreground-color;
      text-transform: uppercase;
      text-align: center;
      &:hover {
        background: var(--main-color-two);
        border: 1px solid var(--main-color-two);
        color: $background-color;
      }
    }
  }

  .single {
    padding-bottom: 100px;
    color: $foreground-color;

    a {
      color: inherit;
    }

    h1 {
      font-size: $font-size-normal;
      color: var(--main-color);
    }

    .body {
      display: inline-block;
      width: 100%;
      display: flex;
      justify-content: center;

      @include screen-size("small") {
        flex-wrap: wrap;
      }

      .cycle {
        font-size: $font-size-small;
      }

      .authors {
        font-size: $font-size-small;
        margin-bottom: 30px;
      }

      .column {
        width: 50%;
        max-width: 600px;

        @include screen-size("small") {
          width: 100%;
        }

        &.left {
          margin-right: 20px;
          overflow: hidden;
          padding-bottom: 40px;

          @include screen-size("small") {
            order: 2;
          }

          .description {
            p {
              a {
                color: $foreground-color !important;
              }

              &:first-child {
                margin-top: 0;
              }
            }
          }

          @include screen-size("small") {
            margin-right: unset;
          }
        }

        &.right {
          margin-left: 20px;

          @include screen-size("small") {
            order: 1;
            margin-bottom: 20px;
          }

          .image {
            width: 100%;
          }

          img {
            max-width: 100%;
            max-height: 600px;
            display: block;
            margin-left: auto;
            margin-right: auto;

            @include screen-size("small") {
              max-height: 400px;
            }
          }

          @include screen-size("small") {
            margin-left: unset;
          }
        }

        @include screen-size("small") {
          width: 100%;
        }
      }
    }
  }

  .role-badge {
    font-family: $secondary-font;
    font-size: $font-size-x-small;
    border: 2px solid var(--main-color);
    margin-right: 5px;
    padding: 3px 7px;
    padding-top: 5px;
    border-radius: 3px;
    color: inherit;
    text-decoration: none;

    &.active {
      background: $foreground-color;
      color: $light-color;
    }
  }

  .resources {
    margin-top: 30px;
    border-top: 1px solid $foreground-color;
    padding-top: 10px;

    .resources-header {
      margin-bottom: 10px;
      // font-weight: bold;
      font-size: $font-size-small;
    }
  }

  .roles {
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
  }
</style>
