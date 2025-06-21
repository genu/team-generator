<script lang="ts" setup>
  const {
    public: { site },
  } = useRuntimeConfig()

  provideHooksContext({
    endpoint: `${site.url}/api/model`,
    logging: true,
  })

  useHead({
    titleTemplate: (title) => title || "Team Generator",
  })
</script>

<template>
  <ProvideZenstackContext>
    <UApp>
      <NuxtLoadingIndicator />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </ProvideZenstackContext>
</template>
