<script>
  import { isAdmin } from "$lib/authentication.js"
  import { currentCycle } from "$lib/cycles.js"
  import Redirector from "$lib/components/Redirector.svelte"
  import CycleEditor from "$lib/components/CycleEditor.svelte"
  import AboutEditor from "$lib/components/AboutEditor.svelte"
  import List from "$lib/components/List.svelte"
  import { triggerCount } from "$lib/api-interface.js"
  import { currentSection, dateTimeFormat } from "$lib/ui.js"
  import { results, proposalsInCycle, usersInCycle, cycles } from "$lib/data.js"
  import { Tabs, TabList, TabPanel, Tab } from "$lib/components/tabs/tabs.js"
  import CycleDeleteButton from "$lib/components/CycleDeleteButton.svelte"
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"

  currentSection.set("admin")

  let showCycleEditor = false
  let cycleToEdit = {}

  let processing = false

  let currentResult = {}
  $: currentResult = $currentCycle
    ? $results.find(result => result.cycle._id === $currentCycle._id)
    : {}

  const countVote = async () => {
    processing = true
    const newResult = await triggerCount($currentCycle._id)
    console.log(newResult)
    currentResult = newResult
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
      <!-- <Tab>Votes</Tab> -->
      <Tab>Results</Tab>
    </TabList>

    <!-- ABOUT -->
    <TabPanel>
      <h2>About</h2>
      <div class="section">
        <AboutEditor />
      </div>
    </TabPanel>

    <!-- CYCLES -->
    <TabPanel>
      <h2>Cycles</h2>
      {#if showCycleEditor}
        <div class="section">
          <CycleEditor
            cycle={cycleToEdit}
            on:close={() => {
              showCycleEditor = false
              cycleToEdit = {}
            }}
          />
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
              <div class="cycle-list-item">
                <div
                  class="info"
                  on:click={() => {
                    cycleToEdit = cycle
                    showCycleEditor = true
                  }}
                >
                  <div class="title">{cycle.title}</div>
                  <div class="phase">
                    <strong>Phase:</strong>
                    {cycle.phase}
                  </div>
                </div>
                <CycleDeleteButton {cycle} />
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
        {#if $proposalsInCycle.length > 0}
          <List list={$proposalsInCycle} phase="proposal" />
        {/if}
      </div>
    </TabPanel>

    <!-- VOTES -->
    <!-- <TabPanel>
      <h2>Votes</h2>
      <div class="section">
        {#each $proposalsInCycle as proposal}
          <div class="list-item">
            <div class="title">{proposal.title}</div>
          </div>
        {/each}
      </div>
    </TabPanel> -->

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
    max-width: 900px;
  }

  .section {
    padding-bottom: 20px;
    width: 100%;
    max-width: 900px;
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
    margin-top: 20px;
  }

  .cycle-list-item {
    height: 80px;
    border: 2px solid var(--main-color);
    border-bottom: unset;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
      border-bottom: 2px solid var(--main-color);
    }

    .info {
      padding-left: 10px;
      padding-right: 10px;
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;

      div {
        margin-right: 20px;
      }

      &:hover {
        cursor: pointer;
        background: var(--main-color-three);
      }
    }
  }
</style>
