<script lang="ts" setup>
  import type { ModalProps } from "@nuxt/ui"

  const { size = "md", dismissible = false } = defineProps<{
    title: string
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "full"
    bodyClass?: string
    modalContentClass?: string
    dismissible?: boolean
    ui?: ModalProps["ui"]
  }>()

  const sizeClass = computed(() => {
    switch (size) {
      case "xs":
        return "sm:max-w-lg"
      case "sm":
        return "sm:max-w-xl"
      case "md":
        return "sm:max-w-3xl"
      case "lg":
        return "sm:max-w-4xl"
      case "xl":
        return "sm:max-w-3xl"
      default:
        return "max-w-3xl"
    }
  })
</script>

<template>
  <UModal
    :title="title"
    :dismissible="dismissible"
    :ui="{
      ...ui,
      content: `${sizeClass} ${ui?.content}`,
    }">
    <template #body>
      <slot />
    </template>
    <template #footer>
      <div class="flex justify-between w-full">
        <div class="flex gap-2">
          <slot name="footer-left" />
        </div>
        <div class="flex gap-2">
          <slot name="footer-right" />
        </div>
      </div>
    </template>
  </UModal>
</template>
