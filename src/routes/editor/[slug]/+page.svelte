<script>
  // throw new Error(
  //   "@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)"
  // )
  import Editor from "$lib/components/Editor.svelte"
  import Redirector from "$lib/components/Redirector.svelte"
  import { currentCycle } from "$lib/cycles.js"
  export let data
  let { proposal } = data
  $: ({ proposal } = data)
</script>

{#if $currentCycle.phase == "proposal"}
  <Editor {proposal} />
{:else}
  <Redirector />
{/if}
