<script>
  import { urlFor } from "$lib/sanity.js"
  import { uploadImage } from "$lib/api-interface.js"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let imageRef
  let image = {}
  let imageInput = {}
  let file = {}
</script>

<div class="upload-container">
  <label class="custom-file-upload" class:active={imageRef || file.name}>
    <input
      type="file"
      bind:this={imageInput}
      on:input={async () => {
        file = imageInput.files[0]
        console.log(file)
        if (file) {
          image = await uploadImage(file)
          console.log("image", image)
          dispatch("updateImageRef", {
            ref: {
              _type: "image",
              asset: {
                _ref: image._id,
                _type: "reference",
              },
            },
          })
        }
      }}
    />
    <span class="text">Upload an image</span>
    {#if imageRef}
      <img src={urlFor(imageRef).quality(90).height(100).width(100).url()} />
    {/if}
  </label>
</div>

<style lang="scss">
  @import "../../variables.scss";

  input {
    width: 100%;
    border: 2px solid var(--main-color);
    font-family: $secondary-font;
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
</style>
