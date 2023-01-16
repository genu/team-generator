<template>
  <div class="bg-gray-100 flex flex-col justify-between h-screen">
    <div class="z-20 w-full md:w-2/3 mx-auto max-w-4xl">
      <slot />
    </div>
    <div class="border text-center text-sm py-2">
      Project by
      <a href="https://twitter.com/eugenistoc" class="text-blue-600 font-medium hover:underline" target="_blank">
        Eugen Istoc
      </a>
      |
      <a
        href="https://github.com/genu/team-generator"
        class="text-blue-600 font-medium hover:underline"
        target="_blank"
      >
        Source Code
      </a>
    </div>
  </div>
</template>
