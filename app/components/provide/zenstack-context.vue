<script lang="ts" setup>
import type { FetchFn } from '@zenstackhq/tanstack-query/runtime'

const headers = useRequestHeaders(['cookie'])
const {
  public: { site },
} = useRuntimeConfig()

const myFetch: FetchFn = (url, options) => {
  options = options ?? {}
  options.headers = {
    ...options.headers,
    ...headers,
  }
  return fetch(url, options)
}

provideHooksContext({
  endpoint: `${site.url}/api/model`,
  logging: true,
  fetch: myFetch,
})
</script>

<template>
  <slot />
</template>
