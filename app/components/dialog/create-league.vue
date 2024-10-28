<script lang="ts" setup>
import { LeagueDTOSchema } from '~~/schemas/forms/create-league.form'

const { accountId } = defineProps<{ accountId: number }>()
const emits = defineEmits<{ close: [] }>()

const { mutateAsync: asyncCreateLeague, isPending: isCreatingLeague } = useCreateLeague()

const { defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(LeagueDTOSchema),
  initialValues: {
    accountId,
    configuration: {
      rules: {},
      teamCount: 2,
    },
  },
})

const [name] = defineField('name')

const onCreateLeague = handleSubmit(async (league) => {
  await asyncCreateLeague({
    data: league,
  })

  emits('close')
})
</script>

<template>
  <OverlayModal title="Create a League" size="xs">
    <UFormField required size="xl">
      <UInput v-model="name" placeholder="League name" :ui="{ root: 'w-full' }" />
    </UFormField>
    <template #footer-right>
      <UButton color="primary" @click="onCreateLeague()" :loading="isCreatingLeague">Create</UButton>
    </template>
  </OverlayModal>
</template>
