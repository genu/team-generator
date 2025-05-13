<script lang="ts" setup>
import { useForm } from '@formwerk/core'
import { LeagueDTOSchema } from '#shared/schemas/forms/create-league.form'

const { accountId } = defineProps<{ accountId: number }>()
const emits = defineEmits<{ close: [] }>()

const { mutateAsync: asyncCreateLeague, isPending: isCreatingLeague } = useCreateLeague()

const { handleSubmit } = useForm({
  schema: LeagueDTOSchema,
  initialValues: {
    accountId,
    configuration: {
      rules: {},
      teamCount: 2,
    },
  },
})

const onCreateLeague = handleSubmit(async (league) => {
  // await asyncCreateLeague({
  //   data: league,
  // })

  emits('close')
})
</script>

<template>
  <OverlayModal title="Create a League" size="xs">
    <UFormInputText name="name" placeholder="League name" size="xl" />
    <template #footer-right>
      <UButton color="primary" :loading="isCreatingLeague" @click="onCreateLeague()">Create</UButton>
    </template>
  </OverlayModal>
</template>
