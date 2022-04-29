<script>
  import Editor from "$lib/components/Editor.svelte"
  import Redirector from "$lib/components/Redirector.svelte"
  import { currentCycle } from "$lib/cycles.js"
</script>

{#if $currentCycle.phase == "proposal"}
  <Editor />
{:else}
  <Redirector />
{/if}
