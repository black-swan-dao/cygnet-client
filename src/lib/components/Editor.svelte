<script>
  import Select from "svelte-select"
  import { profile } from "$lib/authentication.js"
  import { usersInCycle, resourcesInCycle, instance } from "$lib/data.js"
  import { currentCycle } from "$lib/cycles"
  import { saveProposal, uploadImage } from "$lib/api-interface.js"
  import LoadingIndicator from "./LoadingIndicator.svelte"
  import { compactDateTimeFormat } from "$lib/ui.js"
  import { goto } from "$app/navigation"
  import ImageUpload from "$lib/components/ImageUpload.svelte"

  export let proposal = {}
  let title = ""
  let content = ""
  let processing = false
  let postId = false
  let imageRef = ""
  const validationErrors = {
    title: false,
    description: false,
    image: false,
  }
  // ... Peers select
  let peersItems = $usersInCycle
    .filter(u => u.name !== $profile.name)
    .map(u => {
      return { value: u, label: u.name }
    })
  let peersValue = null
  // ... Resources select
  let resourcesItems = $resourcesInCycle.map(r => {
    return { value: r, label: r.title }
  })
  let resourcesValue = null

  const restoreEditor = () => {
    title = proposal.title
    content = proposal.content
    if (proposal.authors && Array.isArray(proposal.authors)) {
      peersValue = proposal.authors
        .filter(a => a.name !== $profile.name)
        .map(a => {
          return { label: a.name, value: a }
        })
    }
    if (proposal.resources && Array.isArray(proposal.resources)) {
      resourcesValue = proposal.resources.map(a => {
        return { label: a.title, value: a }
      })
    }
    postId = proposal._id
    imageRef = proposal.mainImage
  }

  const validate = () => {
    let valid = true
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
    if ($instance.mandatoryImageUpload && !imageRef) {
      validationErrors.image = true
      valid = false
    } else {
      validationErrors.image = false
    }
    return valid
  }

  const prepareToSave = async () => {
    if (validate()) {
      processing = true
      const messageBody = {}
      messageBody.title = title
      messageBody.content = content
      messageBody.peers = peersValue
      messageBody.resources = resourcesValue
      messageBody.imageId = imageRef.asset ? imageRef.asset._ref : null
      messageBody.cycleId = $currentCycle._id
      if (postId) {
        messageBody.id = postId
      }
      const res = await saveProposal(messageBody)
      proposal = res
      processing = false
      // Redirect to listing after saving
      goto("/proposal")
    }
  }

  // Restore editor state if we are editing an existing post
  if (proposal.title) {
    restoreEditor()
  }
</script>

{#if processing}
  <LoadingIndicator dimmed={true} />
{/if}

<div class="editor">
  <div class="proposal-form" class:processing>
    <!-- TITLE -->
    <input
      class="title"
      type="text"
      placeholder="Title of your proposal"
      bind:value={title}
    />
    {#if validationErrors.title}
      <div class="validation-error">&#9888; Title required</div>
    {/if}
    <!-- MARKDOWN INFO -->
    <div class="markdown-info">
      * Use <a
        href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
        target="_blank">markdown</a
      > to format text
    </div>
    <!-- DESCRIPTION -->
    <textarea
      class="description"
      placeholder="Write a short description for your proposal"
      bind:value={content}
    />
    {#if validationErrors.description}
      <div class="validation-error">&#9888; Description required</div>
    {/if}
    <!-- PEERS -->
    <div class="peer-container">
      <Select
        items={peersItems}
        bind:value={peersValue}
        placeholder="Add peers..."
        isMulti={true}
      />
    </div>
    <!-- RESOURCES -->
    <div
      class="resource-container"
      class:visible={$resourcesInCycle.length > 0}
    >
      <Select
        items={resourcesItems}
        bind:value={resourcesValue}
        placeholder="Add resources..."
        isMulti={true}
      />
    </div>
    <!-- IMAGE -->
    <div class="upload-container">
      <ImageUpload
        {imageRef}
        on:updateImageRef={e => {
          imageRef = e.detail.ref
        }}
      />
    </div>
    {#if validationErrors.image}
      <div class="validation-error">&#9888; Image required</div>
    {/if}
    <div class="submission">
      <!-- SUBMIT -->
      <button class="submit" on:click={prepareToSave}>
        {#if processing}Saving...{:else}Save proposal{/if}
      </button>
      <div class="last-updated">
        Last saved: {proposal._updatedAt
          ? compactDateTimeFormat(proposal._updatedAt)
          : "Never"}
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

  .description {
    width: 100%;
    min-height: 400px;
    border: none;
    outline: none;
    color: $foreground-color;
    background: rgba(255, 255, 255, 1);
    &:focus {
      background: rgba(255, 255, 255, 1);
    }
  }

  .title {
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

  .peer-container {
    margin-bottom: 20px;
    font-size: $font-size-small;
    color: $foreground-color;
  }

  .resource-container {
    margin-bottom: 20px;
    font-size: $font-size-small;
    color: $foreground-color;
    display: none;

    &.visible {
      display: block;
    }
  }

  .peer-container {
    margin-top: 20px;
  }

  .upload-container {
    font-size: $font-size-small;
  }

  @keyframes flash {
    50% {
      opacity: 0;
    }
  }

  .markdown-info {
    margin-top: 10px;
    font-size: $font-size-x-small;
    text-align: right;
    padding: 10px;
    font-family: $secondary-font;

    a {
      color: $foreground-color;
      text-decoration: underline;

      &:hover {
        text-decoration: none;
      }
    }
  }

  textarea {
    font-family: $secondary-font;
    padding: 10px;
    resize: none;
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
