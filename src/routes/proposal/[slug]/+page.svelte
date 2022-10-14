<script context="module">
  export const load = async ({ params, fetch }) => {
    const res = await fetch(`/proposal/${params.slug}.json`)
    if (res.ok) {
      const item = await res.json()
      return {
        props: { item },
      }
    }
    const { message } = await res.json()
    return {
      error: new Error(message),
    }
  }
</script>

<script>
  import Single from "$lib/components/Single.svelte"
  export let item = {}
  import { currentSection } from "$lib/ui.js"
  currentSection.set("proposal")
</script>

<Single {item} />
