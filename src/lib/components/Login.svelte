<script>
  import get from "lodash/get.js"
  import { urlFor, renderBlockText } from "$lib/sanity"
  import { login } from "$lib/authentication.js"
  import { general } from "$lib/data.js"

  export let errorMessage = false
</script>

<div class="login-container">
  {#if $general.bigLogo}
    <div class="logo-container">
      <img
        src={urlFor($general.bigLogo)
          .width(400)
          .quality(100)
          .auto("format")
          .url()}
      />
    </div>
  {:else}
    <h1>{$general.siteTitle}</h1>
  {/if}

  {#if $general.preLoginText}
    <div class="pre-login-text">
      {@html renderBlockText(get($general, "preLoginText.content", []))}
    </div>
  {/if}
  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {/if}
  <div class="login" on:click={login}>Login</div>
</div>

<style lang="scss">
  @import "../../variables.scss";

  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    position: relative;
    z-index: 100;
    color: $foreground-color;

    .logo-container {
      max-width: 90%;

      img {
        max-width: 100%;
        height: 80px;
      }
    }

    .pre-login-text {
      width: 60ch;
      max-width: 90%;
      margin-bottom: 10px;
      text-align: center;
    }

    .login {
      padding-left: 30px;
      padding-right: 30px;
      padding-top: 20px;
      padding-bottom: 20px;
      border: 2px solid var(--main-color);
      cursor: pointer;
      z-index: 10000;
      font-family: $secondary-font;
      font-size: $font-size-normal;
      border-radius: 0;
      color: var(--main-color);

      &:hover {
        background: var(--main-color);
        color: $foreground-color;
      }
    }
  }

  .error {
    background: $error-color;
    padding: 20px;
    margin-bottom: 20px;
  }
</style>
