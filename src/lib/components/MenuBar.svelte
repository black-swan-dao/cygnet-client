<script>
  import { profile, profileMeta, logout } from "$lib/authentication.js"
  import {
    currentCycle,
    currentCyclePhaseName,
    availableCycles,
    changeCycle,
  } from "$lib/cycles.js"
  import Menu from "$lib/graphics/Menu.svelte"
  import Close from "$lib/graphics/Close.svelte"
  import { currentSection } from "$lib/ui.js"
  import { general, resourcesInCycle } from "$lib/data.js"
  import { urlFor } from "$lib/sanity.js"
  import { onMount } from "svelte"
  import { goto } from "$app/navigation"

  // ===> DEBUG
  // $: console.log("$page", $page)
  // $: console.log("$profile", $profile)
  // $: console.log("$profileMeta", $profileMeta)
  // $: console.log("$currentSection", $currentSection)

  const proposalNav = {
    label: "Proposal",
    link: "/proposal",
    slug: "proposal",
  }

  const voteNav = {
    label: "Vote",
    link: "/vote",
    slug: "vote",
  }

  const resultNav = {
    label: "Result",
    link: "/result",
    slug: "result",
  }

  const resourcesNav = {
    label: "Resources",
    link: "/resources",
    slug: "resources",
  }

  const peersNav = {
    label: "Peers",
    link: "/peers",
    slug: "peers",
  }

  // Construct navigation
  let navList = []
  $: if ($currentCycle && $currentCycle.phase) {
    if ($currentCycle.phase == "proposal") {
      navList = [proposalNav]
    } else if ($currentCycle.phase == "vote") {
      navList = [voteNav]
    } else if ($currentCycle.phase == "result") {
      navList = [resultNav]
    }
    if ($resourcesInCycle.length > 0) {
      navList.push(resourcesNav)
    }
    navList.push(peersNav)
  }

  let showMobileMenu = false

  const toggleMobileMenu = () => {
    showMobileMenu = !showMobileMenu
  }

  let userSwitchActive = false
  let userSectionElement = {}
  // let userSwitchLeftPos = 30
  let userSwitchWidth = 100

  let cycleSwitchActive = false
  let cycleSectionElement = {}
  let cycleSwitchLeftPos = 30
  let cycleSwitchWidth = 100
  onMount(async () => {
    cycleSwitchLeftPos = cycleSectionElement.offsetLeft
    cycleSwitchWidth = cycleSectionElement.offsetWidth
    userSwitchWidth = userSectionElement.offsetWidth
  })
</script>

{#if cycleSwitchActive}
  <div
    class="cycle-switch"
    style={`transform: translateX(${cycleSwitchLeftPos}px); width: ${cycleSwitchWidth}px;`}
  >
    {#each $availableCycles as cycle (cycle._id)}
      <div
        class="cycle-switch-item"
        class:selected={$currentCycle.discordRole === cycle.discordRole}
        on:click={e => {
          changeCycle(cycle)
          cycleSwitchActive = !cycleSwitchActive
          goto("/")
        }}
      >
        {cycle.title}
      </div>
    {/each}
  </div>
{/if}

{#if userSwitchActive}
  <div class="user-switch" style={`min-width: ${userSwitchWidth}px;`}>
    {#if $general.showEthConnection}
      <a
        href="/connect-eth-address"
        class="user-switch-item"
        on:click={e => {
          userSwitchActive = false
        }}
      >
        Connect ETH address
      </a>
    {/if}
    <div class="user-switch-item" on:click={logout}>Log out</div>
  </div>
{/if}

<div class="menu-bar">
  <div class="left-side">
    <!-- (1) TITLE -->
    <a href="/" class="title">
      {#if $general.smallLogo}
        <div class="logo-container">
          <img
            src={urlFor($general.smallLogo)
              .width(100)
              .quality(90)
              .auto("format")
              .url()}
          />
        </div>
      {:else if $general.siteTitle}
        <div>{$general.siteTitle}</div>
      {:else}
        <div>Cygnet</div>
      {/if}
    </a>

    <!-- (2) CYCLE -->
    <div
      class="cycle"
      class:action={$availableCycles.length > 1}
      bind:this={cycleSectionElement}
      on:click={() => {
        if ($availableCycles.length > 1) {
          cycleSwitchLeftPos = cycleSectionElement.offsetLeft
          cycleSwitchWidth = cycleSectionElement.offsetWidth
          cycleSwitchActive = !cycleSwitchActive
        }
      }}
    >
      {#if $currentCycle && $currentCycle.title}
        <div class="cycle-title">
          <strong>Cycle:</strong>
          {$currentCycle.title}
          {#if $availableCycles.length > 1}
            <span class="arrow-down">⌄</span>
          {/if}
        </div>
      {:else}
        <div class="cycle-title"><strong>No cycle found</strong></div>
      {/if}
    </div>

    <!-- (3) PHASE -->
    <div class="phase">
      {#if $currentCycle && $currentCycle.phase}
        <div class="phase-title">
          <strong>Phase:</strong>
          {$currentCyclePhaseName}
        </div>
      {:else}
        <div class="phase-title"><strong>No phase found</strong></div>
      {/if}
    </div>
  </div>

  <div class="right-side">
    <!-- (5) NAVIGATION -->
    {#each navList as navItem}
      <a
        href={navItem.link}
        class:active={navItem.slug == $currentSection}
        sveltekit:prefetch
        class="nav-item"
      >
        <div><strong>{navItem.label}</strong></div>
      </a>
    {/each}

    <!-- (6) USER -->
    <div
      class="user"
      bind:this={userSectionElement}
      on:click={() => {
        // userSwitchLeftPos = userSectionElement.offsetLeft
        userSwitchWidth = userSectionElement.offsetWidth
        userSwitchActive = !userSwitchActive
      }}
    >
      {#if $profile.name}
        <div class="username">{$profile.name}</div>
      {/if}
      {#if $profileMeta.avatarURL}
        <div class="avatar-container">
          <img class="avatar" src={$profileMeta.avatarURL} />
        </div>
      {/if}
    </div>
  </div>

  <div class="hamburger" on:click={toggleMobileMenu}><Menu /></div>
</div>

{#if showMobileMenu}
  <div class="mobile-menu" on:click={toggleMobileMenu}>
    <div class="close-menu" on:click={toggleMobileMenu}><Close /></div>
    <div class="inner-menu">
      <!-- (5) NAVIGATION -->
      {#each navList as navItem}
        <a
          href={navItem.link}
          class:active={navItem.slug == $currentSection}
          sveltekit:prefetch
          class="menu-item"
        >
          <div>{navItem.label}</div>
        </a>
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  @import "../../variables.scss";

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--main-color);
    color: $light-color;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;

    .inner-menu {
      width: 100%;
      font-size: 48px;
      text-align: center;

      .menu-item {
        color: inherit;
        text-decoration: none;
        display: block;
        margin-bottom: 20px;

        div {
          display: inline-block;
          border-bottom: 2px solid var(--main-color);
        }

        &:active {
          background: var(--main-color);
        }
      }
    }

    .close-menu {
      position: fixed;
      top: 0;
      right: 0;
      height: 50px;
      padding-right: 20px;
      padding-left: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .menu-bar {
    background: var(--main-color);
    box-sizing: border-box;
    font-size: $font-size-small;
    position: fixed;
    top: 0;
    left: 0;
    height: 50px;
    width: 100%;
    z-index: 10000;
    color: $light-color;
    display: flex;
    justify-content: space-between;
    user-select: none;

    &.shadowed {
      box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.6);
    }

    .hamburger {
      display: none;
      color: $light-color;

      @include screen-size("small") {
        padding-left: 20px;
        padding-right: 20px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &:active {
          background: var(--main-color);
        }
      }
    }

    .left-side {
      width: 50%;
      display: flex;

      .title {
        height: 100%;
        display: flex;
        align-items: center;
        padding-right: 20px;
        padding-left: 20px;
        color: inherit;
        text-decoration: none;

        &:hover {
          background: var(--main-color-two);
        }

        .logo-container {
          display: inline-block;
          margin-right: 10px;
          height: 100%;
          padding-top: 5px;

          img {
            width: auto;
            height: 40px;
            object-fit: cover;
          }
        }
      }

      .cycle {
        height: 100%;
        display: flex;
        align-items: center;
        padding-right: 20px;
        padding-left: 20px;
        border-left: 1px solid $secondary-two;
        min-width: 140px;
        overflow: hidden;

        .cycle-title {
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &.action {
          cursor: pointer;

          &:hover {
            background: var(--main-color-two);
          }
        }

        @include screen-size("small") {
          display: none;
        }
      }

      .phase {
        height: 100%;
        display: flex;
        align-items: center;
        padding-right: 20px;
        padding-left: 20px;
        border-left: 1px solid $secondary-two;
        &:last-of-type {
          border-right: 1px solid $secondary-two;
        }

        .phase-title {
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        @include screen-size("small") {
          display: none;
        }
      }

      .role {
        height: 100%;
        display: flex;
        align-items: center;
        padding-right: 20px;
        padding-left: 20px;
        border-left: 1px solid $secondary-two;
        &:last-of-type {
          border-right: 1px solid $secondary-two;
        }

        @include screen-size("small") {
          display: none;
        }
      }
    }

    .right-side {
      display: flex;
      justify-content: flex-end;

      @include screen-size("small") {
        display: none;
      }

      .nav-item {
        height: 100%;
        display: flex;
        align-items: center;
        padding-right: 20px;
        padding-left: 20px;
        border-left: 1px solid $secondary-two;
        color: inherit;
        text-decoration: none;

        &:hover {
          background: var(--main-color-two);
        }

        &:last-of-type {
          border-right: 1px solid $secondary-two;
        }

        &.active {
          background: var(--main-color-two);
        }
      }

      .user {
        text-align: center;
        cursor: pointer;
        height: 100%;
        display: flex;
        align-items: center;
        padding-right: 20px;
        padding-left: 20px;
        justify-content: flex-end;

        a {
          color: $foreground-color;
        }

        &:hover {
          background: var(--main-color-two);
        }

        .avatar-container {
          display: inline-block;
          margin-left: 10px;
          height: 100%;
          padding-top: 10px;

          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
            background: var(--main-color-two);
          }
        }
      }
    }
  }

  .cycle-switch {
    position: fixed;
    top: 50px;
    left: 0px;
    background: var(--main-color);
    color: $light-color;
    font-size: $font-size-small;
    z-index: 100000;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.6);

    .cycle-switch-item {
      padding: 10px;
      cursor: pointer;
      border-top: 1px solid $light-color;

      &:hover {
        background: var(--main-color-two);
      }
    }
  }

  .user-switch {
    position: fixed;
    top: 50px;
    right: 0px;
    background: var(--main-color);
    color: $light-color;
    font-size: $font-size-small;
    z-index: 100000;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.6);

    .user-switch-item {
      padding: 10px;
      cursor: pointer;
      display: block;
      color: inherit;
      text-decoration: none;

      &:hover {
        background: var(--main-color-two);
      }
    }
  }

  .arrow-down {
    position: relative;
    top: -3px;
    margin-left: 3px;
  }
</style>
