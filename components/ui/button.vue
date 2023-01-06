<template>
  <button
    class="inline-flex items-center border border-transparent font-medium text-white shadow-sm"
    :class="classes"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'text'
  size?: 'base' | 'sm' | 'lg'
  to?: string | RouteLocationRaw
  draft?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'base',
  type: 'button',
})

const emit = defineEmits<{ (e: 'click'): void }>()

const classes = {
  'bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-gray-400 disabled:text-gray-100':
    props.variant === 'primary',
  'bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800':
    props.variant === 'secondary',
  'bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800':
    props.variant === 'success',
  'text-black shadow-none':
    props.variant === 'text',
  'rounded-md px-4 py-2 text-sm': props.size === 'base',
  'rounded-lg px-6 py-3 text-sm font-semibold': props.size === 'lg',
  'rounded-sm px-2 py-1 text-xs': props.size === 'sm',
}
</script>

<!-- inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 -->
