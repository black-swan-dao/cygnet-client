<script>
  import get from "lodash/get.js"
  import List from "$lib/components/List.svelte"
  import SectionHeader from "$lib/components/SectionHeader.svelte"
  import { usersInCycle } from "$lib/data.js"
  import { currentSection } from "$lib/ui.js"
  currentSection.set("peers")
</script>

<SectionHeader title="Peers" />
<List list={$usersInCycle} />
