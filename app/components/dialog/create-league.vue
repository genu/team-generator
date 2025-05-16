<script lang="ts" setup>
const { accountId } = defineProps<{ accountId: number }>()
const emits = defineEmits<{ close: [] }>()

const { mutateAsync: asyncCreateLeague, isPending: isCreatingLeague } = useCreateLeague()

const { r$: leagueCreateForm } = useLeagueCreateForm()

const onCreateLeague = async () => {
  const { valid, data } = await leagueCreateForm.$validate()
  if (!valid) {
    return
  }
  await asyncCreateLeague({
    data: {
      name: data.name,
      accountId,
      configuration: {
        teamCount: 2,
        rules: {},
      },
    },
  })

  emits('close')
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
