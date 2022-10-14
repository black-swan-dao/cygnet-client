<script context="module">
  export const load = async ({ params, fetch }) => {
    const res = await fetch(`/editor/${params.slug}.json`)
    if (res.ok) {
      const proposal = await res.json()
      return {
        props: { proposal },
      }
    }
    const { message } = await res.json()
    return {
      error: new Error(message),
    }
  }
</script>

<script>
  import Editor from "$lib/components/Editor.svelte"
  import Redirector from "$lib/components/Redirector.svelte"
  import { currentCycle } from "$lib/cycles.js"
  export let proposal = {}
</script>

{#if $currentCycle.phase == "proposal"}
  <Editor {proposal} />
{:else}
  <Redirector />
{/if}
