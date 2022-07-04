<script>
  import Select from "svelte-select"
  import { profile } from "$lib/authentication.js"
  import { usersInCycle, resourcesInCycle } from "$lib/data.js"
  import { currentCycle } from "$lib/cycles"
  import { saveCycle } from "$lib/api-interface.js"
  import LoadingIndicator from "./LoadingIndicator.svelte"
  import { compactDateTimeFormat } from "$lib/ui.js"
  import { goto } from "$app/navigation"

  export let cycle = {}
  let title = cycle.title ? cycle.title : ""
  let discordRole = ""
  let landingPageText = ""
  let proposalPhaseText = ""
  let votePhaseText = ""
  let resultPhaseText = ""
  // ... Phase select
  let phaseItems = [
    { value: "proposal", label: "Proposal" },
    { value: "vote", label: "Vote" },
    { value: "result", label: "Result" },
  ]
  let phaseValue = cycle.phase ? cycle.phase : null

  let cycleStart = ""
  let cycleMidpoint = ""
  let cycleEnd = ""

  //   let rankResultsByResource = false

  let processing = false
  let postId = false

  //   const validate = () => {
  //     let valid = true
  //     if (!title) {
  //       validationErrors.title = true
  //       valid = false
  //     } else {
  //       validationErrors.title = false
  //     }
  //     if (!content) {
  //       validationErrors.description = true
  //       valid = false
  //     } else {
  //       validationErrors.description = false
  //     }
  //     if (!image._id && !imageRef) {
  //       validationErrors.image = true
  //       valid = false
  //     } else {
  //       validationErrors.image = false
  //     }
  //     return valid
  //   }

  const prepareToSave = async () => {
    console.log("prepare to save")
    // if (validate()) {
    // processing = true
    // const messageBody = {}
    // messageBody.title = title
    // messageBody.content = content
    // messageBody.peers = peersValue
    // messageBody.resources = resourcesValue
    // messageBody.imageId = imageRef.asset ? imageRef.asset._ref : image._id
    // messageBody.cycleId = $currentCycle._id
    // if (postId) {
    //   messageBody.id = postId
    // }
    // const res = await saveCycle(messageBody)
    // cycle = res
    // processing = false
    // Redirect to listing after saving
    // }
  }

  // Restore editor state if we are editing an existing post
  //   if (proposal.title) {
  //     restoreEditor()
  //   }
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
      placeholder="Title of cycle"
      bind:value={title}
    />
    <!-- {#if validationErrors.title}
      <div class="validation-error">&#9888; Title required</div>
    {/if} -->
    <!-- DESCRIPTION -->
    <!-- <textarea
      class="description"
      placeholder="Write a short description for your proposal"
      bind:value={content}
    />
    {#if validationErrors.description}
      <div class="validation-error">&#9888; Description required</div>
    {/if} -->
    <!-- PEERS -->
    <div class="peer-container">
      <Select items={phaseItems} bind:value={phaseValue} placeholder="Phase." />
    </div>
    <div class="submission">
      <!-- SUBMIT -->
      <button class="submit" on:click={prepareToSave}>
        {#if processing}Saving...{:else}Save cycle{/if}
      </button>
      <div class="last-updated">
        Last saved: {cycle._updatedAt
          ? compactDateTimeFormat(cycle._updatedAt)
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

  .custom-file-upload {
    display: inline-block;
    margin-bottom: 20px;
    color: $foreground-color;
    padding: 40px;
    margin-right: 20px;
    box-sizing: border-box;
    border: 1px dashed $foreground-color;
    border-radius: 2px;
    margin-bottom: 0;
    cursor: pointer;
    min-width: 180px;

    &:hover {
      background: var(--main-color-two);
      color: $foreground-color;
      border: 1px solid var(--main-color-two);
    }

    .text {
      display: inline;
    }

    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      display: none;
      line-height: 0;
    }

    &.active {
      .text {
        display: none;
      }
      img {
        display: inline-block;
      }
    }
  }

  input[type="file"] {
    display: none;
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
