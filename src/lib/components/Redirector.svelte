<script>
  import { currentCycle } from "$lib/cycles"
  import get from "lodash/get.js"
</script>

<div>
  This page is not available in the {get($currentCycle, "phase", "")} phase of the
  cycle.
</div>
