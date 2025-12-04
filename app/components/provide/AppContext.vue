<script lang="ts" setup>
  import { PiniaColadaDevtools } from "@pinia/colada-devtools"

  useHead({
    titleTemplate: (title) => title || "Team Generator",
    link: [{ rel: "manifest", href: "/manifest.webmanifest" }],
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" },
      { name: "theme-color", content: "#2563EB" },
    ],
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
