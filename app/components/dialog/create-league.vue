<script lang="ts" setup>
import { required } from '@regle/rules'

const { accountId } = defineProps<{ accountId: number }>()
const emits = defineEmits<{ close: [] }>()

const { mutateAsync: asyncCreateLeague, isPending: isCreatingLeague } = useCreateLeague()

interface CreateLeagueForm {
  name: string
}

const createLeague = ref<CreateLeagueForm>({
  name: '',
})

const { r$ } = useRegle(createLeague, {
  name: {
    required,
  },
})

const onCreateLeague = async () => {
  await asyncCreateLeague({
    data: {
      name: 'League name',
      accountId,
    },
  })
  emits('close')
}
</script>

<template>
  <OverlayModal title="Create a League" size="xs">
    <UFormField label="League name" size="xl" :error="r$.$errors.name[0]">
      <UInput v-model="createLeague.name" placeholder="League name" />
    </UFormField>

    <template #footer-right>
      <UButton color="primary" :loading="isCreatingLeague" @click="onCreateLeague()">Create</UButton>
    </template>
  </OverlayModal>
</template>
