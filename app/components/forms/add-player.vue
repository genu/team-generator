<script lang="ts" setup>
  import { useForm } from "@formwerk/core"
  import { PlayerEditFormSchema, type PlayerEditForm } from "#shared/schemas/forms"

  const emit = defineEmits<{
    addPlayer: [PlayerEditForm]
  }>()

  const toast = useToast()
  const form = useForm({
    id: "AddPlayer",
    schema: PlayerEditFormSchema,
    initialValues: {
      isActive: true,
      isGoalie: false,
      rank: 1,
    },
  })

  const onAddPlayer = async () => {
    const { isValid, output } = await form.validate()

    if (!isValid) {
      toast.add({
        title: "Player name is required",
        icon: "i-ph-warning-fill",
        color: "warning",
      })

      return
    }

    emit("addPlayer", output)
  }

  defineExpose({
    reset: () => form.reset({ touched: false, revalidate: false }),
  })
</script>

<template>
  <FormwerkForm>
    <FormwerkField #="{ setValue, value }" name="name">
      <UInput :model-value="value" placeholder="Player Name" @update:model-value="setValue" @keyup.enter="onAddPlayer">
        <template #trailing>
          <UButton color="success" icon="i-ph-plus-bold" label="Add Player" size="sm" @click="onAddPlayer" />
        </template>
      </UInput>
    </FormwerkField>
  </FormwerkForm>
</template>
