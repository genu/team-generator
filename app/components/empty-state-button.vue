<script lang="ts" setup>
const { disabled = false, loading = false } = defineProps<{ disabled?: boolean; icon: string; loading?: boolean; label: string }>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="relative block w-2/3 p-8 mx-auto my-4 text-center border-2 border-gray-300 border-dashed rounded-lg lg:w-1/3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    :disabled="disabled"
    @click="emit('click')"
  >
    <UIcon v-if="!loading" :name="icon" class="text-6xl text-gray-400" />
    <UIcon v-else name="i-ph-spinner-bold" class="text-6xl text-gray-400 animate-spin" />
    <span class="block mt-4 text-sm font-medium text-gray-900 dark:text-gray-400">{{ label }}</span>
  </button>
</template>
