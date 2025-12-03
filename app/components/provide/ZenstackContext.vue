<script lang="ts" setup>
  import { type FetchFn, provideQuerySettingsContext } from "zenstack-pinia-colada"
  import type { NitroFetchOptions } from "nitropack"

  const headers = useRequestHeaders(["cookie"])

  const myFetch: FetchFn = async (url, options) => {
    options = options ?? {}
    options.headers = {
      ...options.headers,
      ...headers,
    }

    const response = await $fetch.raw(url, options as NitroFetchOptions<string>)

    // Create a new Response with the data from $fetch
    return new Response(JSON.stringify(response._data), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    })
  }
  provideQuerySettingsContext({
    endpoint: "/api/model",
    fetch: myFetch,
    logging: import.meta.env.DEV || false,
  })
</script>

<template>
  <slot />
</template>
