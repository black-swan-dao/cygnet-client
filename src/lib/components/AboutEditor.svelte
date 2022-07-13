<script>
  import { toPlainText, fromPlainText } from "$lib/sanity.js"
  import ImageUpload from "$lib/components/ImageUpload.svelte"
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte"
  import { saveAbout } from "$lib/api-interface.js"
  import { instance } from "$lib/data.js"
  import get from "lodash/get.js"
  import { compactDateTimeFormat } from "$lib/ui.js"

  let processing = false
  let bigLogoRef = $instance.bigLogo
  let smallLogoRef = $instance.smallLogo

  let about = {
    mainColor: $instance.mainColor,
    highlightColor: $instance.highlightColor,
    preLoginText: toPlainText(get($instance, "preLoginText.content")),
    landingPageText: toPlainText(get($instance, "landingPageText.content")),
  }

  const updateAbout = async () => {
    processing = true
    const message = {
      mainColor: about.mainColor,
      highlightColor: about.highlightColor,
      bigLogo: bigLogoRef,
      smallLogo: smallLogoRef,
      preLoginText: {
        _type: "simpleEditor",
        content: fromPlainText(about.preLoginText),
      },
      landingPageText: {
        _type: "simpleEditor",
        content: fromPlainText(about.landingPageText),
      },
    }
    const newInstance = await saveAbout(message)
    instance.set(newInstance)
    processing = false
  }
</script>

{#if processing}
  <LoadingIndicator dimmed={true} />
{/if}

<div>
  <!-- BIG LOGO -->
  <div class="sub-section">
    <label>Big logo</label>
    <ImageUpload
      imageRef={bigLogoRef}
      on:updateImageRef={e => {
        bigLogoRef = e.detail.ref
      }}
    />
  </div>
  <!-- SMALL LOGO -->
  <div class="sub-section">
    <label>Small logo</label>
    <ImageUpload
      imageRef={smallLogoRef}
      on:updateImageRef={e => {
        smallLogoRef = e.detail.ref
      }}
    />
  </div>
  <!-- MAIN COLOR -->
  <div class="sub-section">
    <label>Main color</label>
    <input type="color" bind:value={about.mainColor} />
  </div>
  <!-- HIGHLIGHT COLOR -->
  <div class="sub-section">
    <label>Highlight color</label>
    <input type="color" bind:value={about.highlightColor} />
  </div>
  <!-- PRE-LOGIN TEXT -->
  <div class="sub-section">
    <label>Pre-Login text</label>
    <textarea bind:value={about.preLoginText} />
  </div>
  <!-- LANDING PAGE TEXT -->
  <div class="sub-section">
    <label>Landing page text</label>
    <textarea bind:value={about.landingPageText} />
  </div>
  <!-- Show ETH address connection -->
  <!-- <div class="sub-section">
      <label>Show ETH address connection</label>
      <input type="checkbox" />
    </div> -->
  <!-- LANDING PAGE TEXT -->
  <!-- <div class="sub-section">
      <label>ETH address text</label>
      <textarea />
    </div> -->
  <!-- SAVE -->
  <div class="sub-section flexed">
    <div class="btn" on:click={updateAbout}>Save</div>
    <div class="last-updated">
      Last saved: {$instance._updatedAt
        ? compactDateTimeFormat($instance._updatedAt)
        : "Never"}
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  .btn {
    padding: 10px;
    padding-left: 30px;
    padding-right: 30px;
    border: 2px solid var(--main-color);
    display: inline-block;
    cursor: pointer;

    &:hover {
      background: var(--main-color);
      color: white;
    }
  }

  label {
    display: block;
    font-size: $font-size-small;
    margin-bottom: 5px;
  }

  .sub-section {
    margin-bottom: 20px;

    &.flexed {
      display: flex;
      align-items: center;
    }
  }

  textarea {
    width: 100%;
    height: 200px;
    resize: none;
    padding: 5px;
  }

  .last-updated {
    margin-left: 20px;
    font-size: $font-size-small;
  }
</style>
