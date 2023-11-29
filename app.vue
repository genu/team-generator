<script lang="ts" setup>
useHead({
  titleTemplate: (title) => title || 'Team Generator',
})
</script>

<template>
  <NuxtLayout>
    <UNotifications />
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="postcss">
#__nuxt {
  @apply h-screen;
}
</style>
