<script lang="ts" setup>
  import { EditLeagueFormSchema } from "#shared/schemas/forms"
  import { useForm } from "@formwerk/core"

  const { accountId } = defineProps<{ accountId: number }>()

  const client = useClientQueries()
  const emits = defineEmits<{ close: [number] }>()

  const { mutateAsync: asyncCreateLeague, isLoading: loading } = client.league.useCreate()
  const toast = useToast()

  const editLeagueForm = useForm({
    schema: EditLeagueFormSchema,
    id: "EditLeague",
    initialValues: {
      name: "",
    },
  })

  const onCreateLeague = editLeagueForm.handleSubmit(async (form) => {
    const data = form.toJSON()

    const league = await asyncCreateLeague({
      data: {
        ...data,
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
        title: "League creation failed",
        description: "Please try again later.",
        color: "error",
      })

      return
    }

    emits("close", league.id)
  })
</script>

<template>
  <OverlayModal title="Create a League" size="xs">
    <FormwerkForm>
      <FormwerkField name="name" #="{ model }">
        <UInput v-bind="model" placeholder="League Name" />
      </FormwerkField>
    </FormwerkForm>

    <template #footer-right>
      <UButton color="primary" :loading @click="onCreateLeague()">Create</UButton>
    </template>
  </OverlayModal>
</template>
