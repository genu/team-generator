<template>
  <NuxtLayout>
    <UNotifications />
    <NuxtPage :key="$route.fullPath" />
  </NuxtLayout>
</template>

<style lang="postcss">
#__nuxt {
  @apply h-screen;
}
</style>
