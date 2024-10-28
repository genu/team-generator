<script lang="ts" setup>
import { VueFinalModal } from 'vue-final-modal'

const {
  size = 'md',
  bodyClass = '',
  clickToClose = false,
} = defineProps<{
  title: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full'
  bodyClass?: string
  clickToClose?: boolean
}>()

const emits = defineEmits<{
  dismiss: []
}>()

const sizeClass = computed(() => {
  switch (size) {
    case 'xs':
      return 'sm:max-w-lg'
    case 'sm':
      return 'sm:max-w-xl'
    case 'md':
      return 'sm:max-w-3xl'
    case 'lg':
      return 'sm:max-w-4xl'
    default:
      return 'max-w-3xl'
  }
})
</script>

<template>
  <VueFinalModal
    class="flex items-center justify-center"
    :click-to-close="clickToClose"
    overlay-behavior="persist"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    overlay-class="!bg-black/20 backdrop-blur-sm"
    :content-class="['w-full', sizeClass]"
  >
    <!-- divide: 'divide-y divide-gray-100 dark:divide-gray-800 flex-1 flex flex-col', -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg text-gray-900 leading-6 dark:text-white">
            {{ title }}
          </h3>
          <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-my-1" @click="emits('dismiss')" />
        </div>
      </template>
      
      <slot />

      <template #footer>
        <div class="flex justify-between">
          <div class="flex gap-2">
            <slot name="footer-left" />
          </div>
          <div class="flex gap-2">
            <slot name="footer-right" />
          </div>
        </div>
      </template>
    </UCard>
  </VueFinalModal>
</template>
