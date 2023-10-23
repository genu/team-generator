<template>
  <div class="flex flex-col justify-between h-screen bg-gray-100">
    <div class="z-20 w-full max-w-4xl mx-auto md:w-2/3">
      <slot />
    </div>
    <div class="py-2 text-sm text-center border">
      Project by
      <a href="https://twitter.com/eugenistoc" class="font-medium text-blue-600 hover:underline" target="_blank">
        Eugen Istoc
      </a>
      |
      <a
        href="https://github.com/genu/team-generator"
        class="font-medium text-blue-600 hover:underline"
        target="_blank"
      >
        Source Code
      </a>
    </div>
  </div>
</template>
