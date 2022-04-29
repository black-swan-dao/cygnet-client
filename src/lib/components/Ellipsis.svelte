<script>
  import { onMount, onDestroy } from "svelte"
  let text = ""
  let timer = {}
  const NUMBER_OF_PERIODS = 16
  onMount(async () => {
    timer = setInterval(() => {
      text = text.length < NUMBER_OF_PERIODS ? text + "." : ""
    }, 100)
  })
  onDestroy(() => {
    clearInterval(timer)
  })
</script>

<span>{text}</span>
