<script lang="ts" setup>
import type { SlideoverProps } from '@nuxt/ui'
import { defu } from 'defu'

interface Props {
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  side?: 'left' | 'right'
  dismissible?: boolean
  escToClose?: boolean
  loading?: boolean
  showCloseButton?: boolean
  badge?: string
  ui?: SlideoverProps['ui']
}

const { size, side, ui, loading } = defineProps<Props>()

const emits = defineEmits<{ dismiss: [] }>()

const sizeClass = computed(() => {
  switch (size) {
    case 'sm':
      return 'max-w-xl'
    case 'md':
      return 'max-w-3xl'
    case 'lg':
      return 'max-w-4xl'
    case 'xl':
      return 'max-w-5xl'
  }

  return 'w-3/4' // default to lg
})

const roundedClass = computed(() => {
  switch (side) {
    case 'left':
      return ' rounded-r-md rounded-l-none'
  }

  return 'rounded-l-md rounded-r-none' // default to right
})

const slideOverUi = computed(() => {
  return defu(
    {
      content: `${sizeClass.value} ${roundedClass.value} ${loading ? 'justify-around p-4' : ''}`,
      footer: 'justify-end',
    },
    ui,
  )
})
</script>

<template>
  <USlideover
    :side="side"
    :ui="slideOverUi"
    :title="title"
    :dismissible="dismissible"
    :close="showCloseButton ? { variant: 'soft', onClick: () => emits('dismiss') } : false"
  >
    <template #title>
      <div class="flex items-center text-gray-700 gap-2 dark:text-gray-300">
        <span>{{ title }}</span>
        <UBadge v-if="badge" color="neutral" variant="subtle" :label="badge" />
      </div>
    </template>
    <template v-if="loading" #content>
      <div class="w-full text-center">
        <UProgress />
        <span class="text-sm">Loading...</span>
      </div>
    </template>
    <template #body>
      <slot />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </USlideover>
</template>
