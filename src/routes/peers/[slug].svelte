<script context="module">
  export const load = async ({ params, fetch }) => {
    const res = await fetch(`/peers/${params.slug}.json`)
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
  import { currentSection } from "$lib/ui.js"
  currentSection.set("peers")
  export let item = {}
</script>

<Single {item} />
