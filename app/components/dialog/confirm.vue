<script lang="ts" setup>
import { VueFinalModal } from 'vue-final-modal'

const {
  size = 'sm',
  clickToClose = false,
  description = undefined,
  confirmLabel = 'Yes',
  dismissLabel = 'No',
  onConfirm = () => {},
  onDismiss = () => {},
  onClose = () => {},
  transition = 'fade',
} = defineProps<{
  transition?: 'fade' | 'down'
  size?: 'sm' | 'md'
  title: string
  description?: string
  confirmLabel?: string
  dismissLabel?: string
  onConfirm?: (() => void) | (() => Promise<void>)
  onDismiss?: () => void
  onClose: () => void
  clickToClose?: boolean
}>()

const sizeClass = computed(() => {
  switch (size) {
    case 'sm':
      return 'sm:max-w-xl'
    case 'md':
      return 'sm:max-w-3xl'

    default:
      return 'max-w-3xl'
  }
})

const contentTransition = computed(() => {
  switch (transition) {
    case 'fade':
      return 'vfm-fade'
    case 'down':
      return 'vfm-slide-down'
    default:
      return 'vfm-fade'
  }
})
const isConfirming = ref(false)

const dismiss = () => {
  onDismiss()
  onClose()
}

const confirm = async () => {
  const isAsync = onConfirm.constructor.name === 'AsyncFunction'

  if (isAsync) {
    isConfirming.value = true
    await onConfirm()
    isConfirming.value = false
  } else {
    onConfirm()
  }

  onClose()
}
</script>

<template>
  <VueFinalModal
    class="flex items-center justify-center absolute bottom-0"
    :click-to-close="clickToClose"
    overlay-transition="vfm-fade"
    content-transition="vfm-slide-down"
    overlay-class="!bg-black/20 backdrop-blur-sm"
    :content-class="['w-full absolute bottom-0', sizeClass]"
  >
    <UCard>
      <div class="flex flex-col gap-y-2">
        <span class="text-lg font-semibold">{{ title }}</span>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="text-sm text-gray-500" v-html="description"></p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton
            v-if="dismissLabel"
            size="xl"
            :ui="{ base: 'justify-around' }"
            variant="soft"
            color="neutral"
            :label="dismissLabel"
            @click="dismiss"
          />
          <UButton
            size="xl"
            color="error"
            :loading="isConfirming"
            :label="confirmLabel"
            :ui="{ base: 'justify-around' }"
            @click="confirm"
          />
        </div>
      </template>
    </UCard>
  </VueFinalModal>
</template>
