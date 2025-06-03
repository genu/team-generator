<script lang="ts" setup>
  import { useForm } from "@formwerk/core"
  import { CreateLeagueFormSchema } from "#shared/schemas/forms"

  const { accountId } = defineProps<{ accountId: number }>()
  const emits = defineEmits<{ close: [number] }>()

  const { mutateAsync: asyncCreateLeague, isPending: loading } = useCreateLeague()

  const form = useForm({
    id: "CreateLeagueForm",
    schema: CreateLeagueFormSchema,
  })
  const toast = useToast()

  const onCreateLeague = form.handleSubmit(async (form) => {
    const { name } = form.toJSON()

    const league = await asyncCreateLeague({
      data: {
        name,
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
    <FormInput name="name" placeholder="League Name" />

    <template #footer-right>
      <UButton color="primary" :loading @click="onCreateLeague()">Create</UButton>
    </template>
  </OverlayModal>
</template>
