<script>
  import Single from "$lib/components/Single.svelte"
  import { currentSection } from "$lib/ui.js"
  currentSection.set("resources")
  export let data
  let { item } = data
  $: ({ item } = data)
</script>

<Single {item} />
