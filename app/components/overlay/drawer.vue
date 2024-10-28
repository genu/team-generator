<script lang="ts" setup>
import { VueFinalModal } from 'vue-final-modal'

const {
  title,
  side,
  size,
  loading = false,
  preventClose = false,
  showCloseButton = true,
  escToClose = true,
  headerClass = '',
  badge,
} = defineProps<{
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  side?: 'left' | 'right'
  headerClass?: string
  preventClose?: boolean
  escToClose?: boolean
  loading?: boolean
  showCloseButton?: boolean
  badge?: string
}>()

const emits = defineEmits<{
  dismiss: []
}>()

const sideClass = computed(() => {
  switch (side) {
    case 'left':
      return 'justify-start'
  }

  return 'justify-end' // default to right
})

const sizeClass = computed(() => {
  switch (size) {
    case 'sm':
      return 'w-full md:w-6/12'
    case 'md':
      return 'w-full md:w-9/12'
    case 'xl':
      return 'w-full md:w-5/6'
  }

  return 'w-3/4' // default to lg
})

const contentTransition = computed(() => {
  switch (side) {
    case 'left':
      return 'vfm-slide-left'
  }

  return 'vfm-slide-right' // default to right
})

const roundedClass = computed(() => {
  switch (side) {
    case 'left':
      return ' rounded-r-md rounded-l-none'
  }

  return 'rounded-l-md rounded-r-none' // default to right
})
</script>

<template>
  <VueFinalModal
    class="flex !z-20"
    :class="sideClass"
    overlay-transition="vfm-fade"
    overlay-class="!bg-black/20 backdrop-blur-sm"
    :content-class="`w-0 transition-all transform duration-1000 ease-in-out ${sizeClass}`"
    :content-transition="contentTransition"
    :click-to-close="!preventClose"
    :esc-to-close="escToClose"
  >
    <!-- body: {
      base: 'flex-1 flex flex-col overflow-hidden',
      padding: 'p-0 sm:p-0',
    }, -->
    <!-- base: 'h-full flex flex-col', -->
    <!-- rounded: roundedClass, -->
    <!-- divide: 'divide-y divide-gray-100 dark:divide-gray-800', -->
    <div v-if="loading" class="flex items-center justify-around h-full p-10 bg-white">
      <div class="w-full text-center">
        <UProgress />
        <span class="text-sm">Loading...</span>
      </div>
    </div>
    <UCard
      v-else
      :ui="{
        header: headerClass,
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center font-medium text-gray-700 gap-2 dark:text-gray-300">
            <span>{{ title }}</span>
            <UBadge v-if="badge" color="neutral" variant="solid">{{ badge }}</UBadge>
          </div>
          <UButton v-if="showCloseButton" square trailing-icon="i-lucide-x" variant="soft" @click="emits('dismiss')">
            <UKbd v-if="escToClose">ESC</UKbd>
          </UButton>
        </div>
        <slot name="sub-header" />
      </template>
      <div class="flex-1 h-full">
        <slot />
      </div>
      <template #footer>
        <slot name="footer" />
      </template>
    </UCard>
  </VueFinalModal>
</template>
