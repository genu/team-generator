<script lang="ts" setup>
  import { useForm } from "@formwerk/core"
  import { PlayerEditFormSchema, type PlayerEditForm } from "#shared/schemas/forms"

  const emit = defineEmits<{
    addPlayer: [PlayerEditForm]
  }>()

  const toast = useToast()

  const form = useForm({
    id: "AddPlayerForm",
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
        icon: "i-heroicons-exclamation-triangle-solid",
        color: "warning",
      })
      return
    }

    emit("addPlayer", output)
  }

  defineExpose({
    reset: () => {
      form.reset({ touched: false, revalidate: false })
    },
  })
</script>

<template>
  <FormInput name="name" placeholder="Player Name" :show-error="false" @keyup.enter="onAddPlayer">
    <template #input-trailing>
      <UButton color="success" icon="i-ph-plus-bold" label="Add Player" size="sm" @click="onAddPlayer" />
    </template>
  </FormInput>
</template>
