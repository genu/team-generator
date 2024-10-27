<script lang="ts" setup>
import { ModalsContainer } from 'vue-final-modal'

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
