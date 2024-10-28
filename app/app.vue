<script lang="ts" setup>
import type { FetchFn } from '@zenstackhq/tanstack-query/runtime'
import { ModalsContainer } from 'vue-final-modal'

const {
  public: { site },
} = useRuntimeConfig()

provideHooksContext({
  endpoint: `${site.url}/api/model`,
  logging: true,
})

useHead({
  titleTemplate: (title) => title || 'Team Generator',
})
</script>

<template>
  <div>
    <!-- <UNotifications /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ModalsContainer />
  </div>
</template>

<style>
@import 'tailwindcss';
@import '@nuxt/ui';

@theme {
  --font-family-sans: 'Inter var', sans-serif;
}
</style>
