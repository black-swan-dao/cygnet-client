<script>
  import Select from "svelte-select"
  import { saveResource } from "$lib/api-interface.js"
  import LoadingIndicator from "./LoadingIndicator.svelte"
  import { compactDateTimeFormat } from "$lib/ui.js"
  import SveltyPicker from "svelty-picker"
  import { toPlainText, fromPlainText } from "$lib/sanity.js"
  import get from "lodash/get.js"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let resource = {}

  let title = resource.title || ""
  let text = toPlainText(get(resource, "text.content"))

  let lastSavedAt = resource._updatedAt

  let processing = false

  const closeEditor = () => {
    dispatch("close")
  }

  const validate = () => {
    let valid = true
    return valid
    if (!title) {
      validationErrors.title = true
      valid = false
    } else {
      validationErrors.title = false
    }
    if (!content) {
      validationErrors.description = true
      valid = false
    } else {
      validationErrors.description = false
    }
    if (!image._id && !imageRef) {
      validationErrors.image = true
      valid = false
    } else {
      validationErrors.image = false
    }
    return valid
  }

  const createResource = async () => {
    processing = true
    if (validate) {
      let message = {}
      message.id = resource._id || null
      message.title = title
      message.text = fromPlainText(text)
      let updatedResource = await saveResource(message)
      lastSavedAt = updatedResource._updatedAt
    }
    processing = false
  }
</script>

{#if processing}
  <LoadingIndicator dimmed={true} />
{/if}

<div class="editor">
  <div class="proposal-form" class:processing>
    <div class="form-section header">
      <div><strong>Edit resource</strong></div>
      <div class="close" on:click={closeEditor}>Close</div>
    </div>

    <!-- TITLE -->
    <div class="form-section">
      <label>Title</label>
      <input
        class="title"
        type="text"
        placeholder="Title of resource"
        bind:value={title}
      />
    </div>

    <!-- TEXT -->
    <div class="form-section">
      <label>Text</label>
      <textarea class="text-landing-page" bind:value={text} />
    </div>

    <!-- SUBMIT -->
    <div class="submission">
      <button class="submit" on:click={createResource}>
        {#if processing}Saving...{:else}Save resource{/if}
      </button>
      <div class="last-updated">
        Last saved: {lastSavedAt ? compactDateTimeFormat(lastSavedAt) : "Never"}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  .editor {
    margin-right: auto;
    margin-left: auto;
  }

  .form-section {
    margin-bottom: 20px;

    &.header {
      display: flex;
      justify-content: space-between;

      .close {
        cursor: pointer;
        font-size: $font-size-x-small;
        padding: 5px;
        border: 1px solid var(--main-color);

        &:hover {
          background: var(--main-color);
        }
      }
    }
  }

  label {
    display: block;
    font-size: $font-size-small;
    margin-bottom: 10px;
  }

  .proposal-form {
    font-size: $font-size-normal;
    width: 100%;
    height: 100%;
    color: $foreground-color;
    padding-bottom: 40px;

    &.processing {
      pointer-events: none;
      opacity: 0.5;
      filter: grayscale(1);
    }
  }

  input[type="text"] {
    color: $foreground-color;
    padding: 10px;
    border: none;
    outline: none;
    background: rgba(255, 255, 255, 1);

    &:focus {
      background: rgba(255, 255, 255, 1);
    }
  }

  *::placeholder {
    color: $secondary-three;
  }

  input {
    width: 100%;
    border: 2px solid var(--main-color);
    font-family: $secondary-font;
  }

  textarea {
    font-family: $secondary-font;
    padding: 10px;
    resize: none;
    width: 100%;
    height: 200px;
  }

  .validation-error {
    font-size: $font-size-small;
    margin-top: 5px;
    padding: 5px;
    background: $error-color;
  }

  .submission {
    display: flex;
    margin-top: 20px;
    align-items: center;

    .submit {
      cursor: pointer;
      background: transparent;
      font-weight: normal;
      padding: 30px;
      border: 2px solid var(--main-color);
      min-width: 180px;
      font-size: $font-size-normal;
      color: var(--main-color);
      user-select: none;

      &:hover {
        background: var(--main-color);
        color: $light-color;
      }
    }

    .last-updated {
      margin-left: 20px;
      font-size: $font-size-small;
    }
  }
</style>
