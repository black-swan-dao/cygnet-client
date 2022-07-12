<script>
  import { toPlainText, fromPlainText } from "$lib/sanity.js"
  import { isAdmin } from "$lib/authentication.js"
  import { currentCycle, setAvailableCycles } from "$lib/cycles.js"
  import Redirector from "$lib/components/Redirector.svelte"
  import CycleEditor from "$lib/components/CycleEditor.svelte"
  import ImageUpload from "$lib/components/ImageUpload.svelte"
  import List from "$lib/components/List.svelte"
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
  import { triggerCount, saveAbout } from "$lib/api-interface.js"
  import { currentSection, dateTimeFormat } from "$lib/ui.js"
  import {
    results,
    instance,
    proposalsInCycle,
    usersInCycle,
    cycles,
  } from "$lib/data.js"
  import { Tabs, TabList, TabPanel, Tab } from "$lib/components/tabs/tabs.js"
  import get from "lodash/get.js"

  let processing = false
  let bigLogoRef = $instance.bigLogo
  let smallLogoRef = $instance.smallLogo

  let cycleToEdit = {}

  currentSection.set("admin")

  let currentResult = {}
  $: currentResult = $currentCycle
    ? $results.find(result => result.cycle._id === $currentCycle._id)
    : {}

  let about = {
    mainColor: $instance.mainColor,
    highlightColor: $instance.highlightColor,
    preLoginText: toPlainText(get($instance, "preLoginText.content")),
    landingPageText: toPlainText(get($instance, "landingPageText.content")),
  }

  const countVote = () => {
    triggerCount($currentCycle._id)
  }

  let showCycleEditor = false

  const createCycle = () => {
    console.log("create cycle")
    // saveCycle()
  }

  const deleteCycle = () => {
    console.log("create cycle")
    // deleteCycle()
  }

  const updateAbout = async () => {
    processing = true
    console.log("Save about")
    console.log(about)
    console.log("bigLogoRef", bigLogoRef)
    console.log("smallLogoRef", smallLogoRef)
    const message = {
      mainColor: about.mainColor,
      highlightColor: about.highlightColor,
      bigLogo: bigLogoRef,
      smallLogo: smallLogoRef,
      preLoginText: {
        _type: "simpleEditor",
        content: fromPlainText(about.preLoginText),
      },
      landingPageText: {
        _type: "simpleEditor",
        content: fromPlainText(about.landingPageText),
      },
    }
    console.log(message)
    await saveAbout(message)
    processing = false
  }
</script>

{#if $isAdmin}
  {#if processing}
    <LoadingIndicator dimmed={true} />
  {/if}

  <Tabs>
    <TabList>
      <Tab>About</Tab>
      <Tab>Cycles</Tab>
      <Tab>Users</Tab>
      <Tab>Proposals</Tab>
      <Tab>Votes</Tab>
      <Tab>Results</Tab>
    </TabList>

    <!-- ABOUT -->
    <TabPanel>
      <h2>About</h2>
      <div class="section">
        <div>
          <!-- BIG LOGO -->
          <div class="sub-section">
            <label>Big logo</label>
            <ImageUpload
              imageRef={bigLogoRef}
              on:updateImageRef={e => {
                bigLogoRef = e.detail.ref
              }}
            />
          </div>
          <!-- SMALL LOGO -->
          <div class="sub-section">
            <label>Small logo</label>
            <ImageUpload
              imageRef={smallLogoRef}
              on:updateImageRef={e => {
                smallLogoRef = e.detail.ref
              }}
            />
          </div>
          <!-- MAIN COLOR -->
          <div class="sub-section">
            <label>Main color</label>
            <input type="color" bind:value={about.mainColor} />
          </div>
          <!-- HIGHLIGHT COLOR -->
          <div class="sub-section">
            <label>Highlight color</label>
            <input type="color" bind:value={about.highlightColor} />
          </div>
          <!-- PRE-LOGIN TEXT -->
          <div class="sub-section">
            <label>Pre-Login text</label>
            <textarea bind:value={about.preLoginText} />
          </div>
          <!-- LANDING PAGE TEXT -->
          <div class="sub-section">
            <label>Landing page text</label>
            <textarea bind:value={about.landingPageText} />
          </div>
          <!-- Show ETH address connection -->
          <!-- <div class="sub-section">
            <label>Show ETH address connection</label>
            <input type="checkbox" />
          </div> -->
          <!-- LANDING PAGE TEXT -->
          <!-- <div class="sub-section">
            <label>ETH address text</label>
            <textarea />
          </div> -->
          <!-- SAVE -->
          <div class="sub-section">
            <div class="btn" on:click={updateAbout}>Save</div>
          </div>
        </div>
      </div>
    </TabPanel>

    <!-- CYCLES -->
    <TabPanel>
      <h2>Cycles</h2>
      {#if showCycleEditor}
        <div class="section">
          <CycleEditor cycle={cycleToEdit} />
        </div>
      {:else}
        <div class="section">
          <div
            class="btn"
            on:click={() => {
              showCycleEditor = true
            }}
          >
            Create new cycle
          </div>
          <div class="cycle-list">
            {#each $cycles as cycle}
              <div class="list-item">
                <div class="title">{cycle.title}</div>
                <div class="phase">
                  <strong>Phase:</strong>
                  {cycle.phase}
                </div>
                <div
                  class="edit-cycle"
                  on:click={() => {
                    cycleToEdit = cycle
                    showCycleEditor = true
                  }}
                >
                  Edit
                </div>
                <div class="delete-cycle">Delete</div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </TabPanel>

    <!-- USERS -->
    <TabPanel>
      <h2>Users</h2>
      <div class="section">
        {#if $usersInCycle.length > 0}
          <List list={$usersInCycle} />
        {/if}
      </div>
    </TabPanel>

    <!-- PROPOSALS -->
    <TabPanel>
      <h2>Proposals</h2>
      <div class="section">
        <List list={$proposalsInCycle} phase="proposal" />
      </div>
    </TabPanel>

    <!-- VOTES -->
    <TabPanel>
      <h2>Votes</h2>
      <div class="section">
        {#each $proposalsInCycle as proposal}
          <div class="list-item">
            <div class="title">{proposal.title}</div>
          </div>
        {/each}
      </div>
    </TabPanel>

    <!-- RESULTS -->
    <TabPanel>
      <h2>Results</h2>
      <div class="section count-vote">
        {#if $currentCycle}
          <div class="btn" on:click={countVote}>
            Count Vote for <strong>{$currentCycle.title}</strong>
          </div>
          {#if currentResult && currentResult._updatedAt}
            <div class="date">
              <strong>Calculated on:</strong>
              {dateTimeFormat(currentResult._updatedAt)}
            </div>
          {/if}
        {/if}
      </div>
    </TabPanel>
  </Tabs>
{:else}
  <Redirector />
{/if}

<style lang="scss">
  @import "../../variables.scss";

  h2 {
    border-bottom: 1px solid $foreground-color;
    max-width: 700px;
  }

  .section {
    padding-bottom: 20px;
    width: 100%;
    max-width: 700px;
  }

  .btn {
    padding: 10px;
    padding-left: 30px;
    padding-right: 30px;
    border: 2px solid var(--main-color);
    display: inline-block;
    cursor: pointer;

    &:hover {
      background: var(--main-color);
      color: white;
    }
  }

  .date {
    font-size: $font-size-x-small;
    margin-top: 10px;
  }

  label {
    display: block;
    font-size: $font-size-small;
    margin-bottom: 5px;
  }

  .sub-section {
    margin-bottom: 20px;
  }

  textarea {
    width: 100%;
    height: 200px;
    resize: none;
    padding: 5px;
  }

  .cycle-list {
    border-top: 1px solid $foreground-color-dimmed;
    margin-top: 20px;
  }

  .list-item {
    padding-top: 10px;
    padding-bottom: 20px;
    border-bottom: 1px solid $foreground-color-dimmed;
    display: flex;
    justify-content: space-between;

    .title,
    .phase,
    .edit-cycle {
      margin-right: 10px;
    }
  }

  .edit-cycle {
    cursor: pointer;
  }
</style>
