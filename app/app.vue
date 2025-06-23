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
    meta: [{ name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" }],
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
