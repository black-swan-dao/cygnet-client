<script>
  import { isAdmin } from "$lib/authentication.js"
  import { currentCycle } from "$lib/cycles.js"
  import Redirector from "$lib/components/Redirector.svelte"
  import { triggerCount } from "$lib/api-interface.js"
  import { currentSection, dateTimeFormat } from "$lib/ui.js"
  import { results } from "$lib/data.js"

  currentSection.set("admin")

  let currentResult = {}
  $: currentResult = $results.find(
    result => result.cycle._id === $currentCycle._id
  )

  const countVote = () => {
    triggerCount($currentCycle._id)
  }
</script>

{#if $isAdmin}
  <h2>Admin</h2>

  <div class="section count-vote">
    <div class="btn" on:click={countVote}>
      Count Vote for <strong>{$currentCycle.title}</strong>
    </div>
    {#if currentResult && currentResult._updatedAt}
      <div class="date">
        <strong>Calculated on:</strong>
        {dateTimeFormat(currentResult._updatedAt)}
      </div>
    {/if}
  </div>

  <div class="section">
    <div><strong>TODO:</strong> Edit general instance information</div>
  </div>

  <div class="section">
    <div><strong>TODO:</strong> Add/Edit cycles</div>
  </div>

  <div class="section">
    <div><strong>TODO:</strong> Edit proposals</div>
  </div>
{:else}
  <Redirector />
{/if}

<style lang="scss">
  @import "../../variables.scss";

  .section {
    border-bottom: 1px solid black;
    padding-bottom: 20px;
    padding-top: 20px;
  }

  .btn {
    padding: 10px;
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
</style>
