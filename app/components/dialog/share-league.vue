<script lang="ts" setup>
const { shareUrl } = defineProps<{ shareUrl: string }>()
const emits = defineEmits<{ close: [] }>()

const { copy, copied } = useClipboard({ source: shareUrl })
</script>

<template>
  <OverlayModal title="Share League" size="xs">
    <UFormField label="Edit Link" :ui="{ container: 'flex items-center' }">
      <UInput :model-value="shareUrl" disabled :ui="{ base: 'pr-17' }" />
      <UButton :ui="{ base: 'absolute right-2' }" :label="copied ? 'Copied' : 'Copy'" color="neutral" size="sm" @click="copy()" />
    </UFormField>

    <template #footer-right>
      <UButton color="primary" variant="link" @click="emits('close')">Close</UButton>
    </template>
  </OverlayModal>
</template>
