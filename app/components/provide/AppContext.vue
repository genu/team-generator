<script lang="ts" setup>
  import { PiniaColadaDevtools } from "@pinia/colada-devtools"

  useHead({
    titleTemplate: (title) => title || "Team Generator",
    meta: [{ name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" }],
  })
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <PiniaColadaDevtools />
    <slot />
  </UApp>
</template>
