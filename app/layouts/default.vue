<template>
  <div class="flex flex-col justify-between h-screen">
    <FloatieBasic />
    <div class="w-full max-w-4xl mx-auto md:w-2/3">
      <slot />
    </div>
    <div class="flex flex-col items-center justify-around">
      <!-- <UDivider /> -->
      <div class="text-sm">
        Project by
        <NuxtLink to="https://twitter.com/eugenistoc" target="_blank">
          <UButton color="primary" variant="link">Eugen Istoc</UButton>
        </NuxtLink>
        |
        <NuxtLink to="https://github.com/genu/team-generator" target="_blank">
          <UButton color="primary" variant="link">Source Code</UButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
