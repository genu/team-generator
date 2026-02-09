<script lang="ts" setup>
  const {
    size = "sm",
    clickToClose = false,
    description = undefined,
    confirmLabel = "Yes",
    dismissLabel = "No",
    onConfirm = () => {},
    onDismiss = () => {},
  } = defineProps<{
    size?: "sm" | "md"
    title: string
    description?: string
    confirmLabel?: string
    dismissLabel?: string
    onConfirm?: (() => void) | (() => Promise<void>)
    onDismiss?: () => void
    clickToClose?: boolean
  }>()

  const sizeClass = computed(() => {
    switch (size) {
      case "sm":
        return "sm:max-w-xl"
      case "md":
        return "sm:max-w-3xl"
      default:
        return "max-w-3xl"
    }
  })

  const isConfirming = ref(false)

  const confirm = async () => {
    try {
      isConfirming.value = true
      await Promise.resolve(onConfirm())
    } catch (_err) {
      isConfirming.value = false
    }
  }
</script>

<template>
  <UModal
    :dismissible="clickToClose"
    :close="false"
    :title="title"
    :ui="{
      content: `${sizeClass} divide-y-0`,
      header: 'px-2 sm:px-5 py-3',
      body: 'p-2 sm:p-5 sm:pt-0',
      footer: 'justify-end gap-3',
    }">
    <template #body>
      <div class="text-sm text-gray-500">{{ description }}</div>
    </template>
    <template #footer>
      <UButton
        v-if="dismissLabel"
        :ui="{ base: 'justify-around' }"
        color="neutral"
        variant="outline"
        :label="dismissLabel"
        @click="onDismiss" />
      <UButton color="neutral" :loading="isConfirming" :label="confirmLabel" :ui="{ base: 'justify-around' }" @click="confirm" />
    </template>
  </UModal>
</template>
