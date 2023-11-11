<script lang="ts" setup>
const props = defineProps<{ modelValue: boolean; title: string; content: string }>()

const emits = defineEmits<{
  'update:modelValue': [boolean]
  onConfirm: []
  onDismiss: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

const onConfirm = () => {
  emits('update:modelValue', false)
  emits('onConfirm')
}

const onDismiss = () => {
  emits('update:modelValue', false)
  emits('onDismiss')
}
</script>

<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Add a new league</h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isAddingNewLeague = false"
          />
        </div>
      </template>
      <slot name="content" v-if="$slots['content']" />
      <div v-else>
        {{ props.content }}
      </div>

      <template #footer>
        <div class="flex justify-end gap-4">
          <UButton color="indigo" variant="ghost" label="No" @click="onDismiss" />
          <UButton label="Yes" @click="onConfirm" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
