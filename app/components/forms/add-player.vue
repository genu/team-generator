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
        icon: "i-lucide-triangle-alert",
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
  <UForm>
    <UFormField #="{ model }" name="name">
      <UInput v-bind="model" placeholder="Player Name" @keyup.enter="onAddPlayer">
        <template #trailing>
          <UButton color="success" icon="i-lucide-plus" label="Add Player" size="sm" @click="onAddPlayer" />
        </template>
      </UInput>
    </UFormField>
  </UForm>
</template>
