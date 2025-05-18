<script lang="ts" setup>
const { accountId } = defineProps<{ accountId: number }>()
const emits = defineEmits<{ close: [number] }>()

const { mutateAsync: asyncCreateLeague, isPending: isCreatingLeague } = useCreateLeague()

const { r$: leagueCreateForm } = useLeagueCreateForm()
const toast = useToast()

const onCreateLeague = async () => {
  const { valid, data } = await leagueCreateForm.$validate()
  if (!valid) {
    return
  }
  const league = await asyncCreateLeague({
    data: {
      name: data.name,
      accountId,
      configuration: {
        teamCount: 2,
        rules: {},
      },
    },
    select: { id: true },
  })

  if (!league) {
    toast.add({
      title: 'League creation failed',
      description: 'Please try again later.',
      color: 'error',
    })

    return
  }

  emits('close', league.id)
}
</script>

<template>
  <OverlayModal title="Create a League" size="xs">
    <UFormField label="League name" size="xl" :error="leagueCreateForm.$errors.name[0]">
      <UInput v-model="leagueCreateForm.$value.name" placeholder="League name" />
    </UFormField>

    <template #footer-right>
      <UButton color="primary" :loading="isCreatingLeague" @click="onCreateLeague()">Create</UButton>
    </template>
  </OverlayModal>
</template>
