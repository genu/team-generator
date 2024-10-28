<script lang="ts" setup>
withDefaults(defineProps<{ disabled?: boolean; icon: string; loading?: boolean; label: string }>(), {
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="relative block w-2/3 p-8 mx-auto my-4 text-center border-2 border-gray-300 border-dashed rounded-lg lg:w-1/3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    @click="emit('click')"
    :disabled="disabled"
  >
    <UIcon :name="icon" class="text-6xl text-gray-400" v-if="!loading" />
    <UIcon name="i-ph-spinner-bold" class="text-6xl text-gray-400 animate-spin" v-else />
    <span class="block mt-4 text-sm font-medium text-gray-900 dark:text-gray-400">{{ label }}</span>
  </button>
</template>
