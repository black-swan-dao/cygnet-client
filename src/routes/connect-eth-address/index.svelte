<script>
  import get from "lodash/get.js"
  import { general } from "$lib/data.js"
  import SectionHeader from "$lib/components/SectionHeader.svelte"
  import { profileMeta } from "$lib/authentication.js"
  import { connectEthAddress } from "$lib/api-interface.js"
  import { currentSection } from "$lib/ui.js"
  currentSection.set("")

  let ethAddress = $profileMeta.ethAddress || ""
  let validationError = false
  let processing = false
  let submitted = false

  const isAddress = address => {
    // check if it has the basic requirements of an address
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      return false
    }
    return true
  }

  const prepareToSubmit = async () => {
    validationError = false
    processing = true
    if (!isAddress(ethAddress)) {
      console.log("eth address is invalid")
      validationError = true
      console.log("eth address is valid")
      processing = false
      return false
    }
    const messageBody = {}
    messageBody.ethAddress = ethAddress
    await connectEthAddress(messageBody)
    processing = false
    submitted = true
  }
</script>

<SectionHeader
  title="Connect Ethereum address"
  description={$general.ethConnectionText}
/>
<div class="connect-eth-address" class:processing>
  <input type="text" bind:value={ethAddress} placeholder="0xabc..." />
  {#if validationError}
    <div class="validation-error">&#9888; Invalid Ethereum address</div>
  {/if}
  <input
    type="submit"
    class="submit"
    value={submitted ? "Submitted" : "Submit"}
    on:click={prepareToSubmit}
  />
</div>

<style lang="scss">
  @import "../../variables.scss";

  *::placeholder {
    color: rgba(0, 0, 0, 0.35);
  }

  input {
    width: 100%;
    border: 2px solid var(--main-color);
    font-family: $secondary-font;
    padding: 10px;
    font-size: $font-size-normal;
  }

  .validation-error {
    font-size: $font-size-small;
    margin-top: 10px;
    padding: 5px;
    background: $error-color;
  }

  .submit {
    cursor: pointer;
    background: transparent;
    font-weight: normal;
    padding: 30px;
    border: 2px solid var(--main-color);
    min-width: 180px;
    width: auto;
    font-size: $font-size-normal;
    color: var(--main-color);
    display: inline-block;
    margin-top: 20px;

    &:hover {
      background: var(--main-color-two);
      color: $light-color;
    }
  }

  .connect-eth-address {
    &.processing {
      opacity: 0.5;
      pointer-events: none;
    }
  }
</style>
