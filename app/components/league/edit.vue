<script lang="ts" setup>
  import { useForm } from "@formwerk/core"
  import { filter } from "lodash-es"
  import { LeagueEditFormSchema, type LeagueEditForm, type PlayerEditForm } from "#shared/schemas/forms"

  const { league } = defineProps<{
    league: LeagueEditForm
  }>()

  const emits = defineEmits<{
    close: [LeagueEditForm]
  }>()

  const toast = useToast()
  const addPlayerForm = useTemplateRef("addPlayerFormRef")

  const { values: leagueForm, ...form } = useForm({
    id: "LeagueEditForm",
    schema: LeagueEditFormSchema,
    initialValues: LeagueEditFormSchema.parse(league),
  })

  const activeSquad = computed(() => filter(leagueForm.players, { isActive: true }))

  const onAddPlayer = async (player: PlayerEditForm) => {
    const currentPlayers = leagueForm.players || []
    const newPlayers = [...currentPlayers, player]

    const existingPlayer = currentPlayers.find((p) => p.name.toLowerCase() === player.name.trim().toLowerCase())

    if (existingPlayer) {
      toast.add({
        title: "Player already exists",
        icon: "i-lucide-triangle-alert",
        color: "warning",
      })
      return
    }

    form.setValue("players", newPlayers)

    addPlayerForm.value?.reset()
  }

  const onRemovePlayer = (index: number) => {
    const currentPlayers = leagueForm.players || []
    const newPlayers = currentPlayers.filter((_, i) => i !== index)

    form.setValue("players", newPlayers)
  }

  const onClose = form.handleSubmit((values) => {
    const data = values.toJSON()

    emits("close", data)
  })

  const onSetAllInactive = () => {
    const currentPlayers = leagueForm.players || []
    const newPlayers = currentPlayers.map((player) => ({ ...player, isActive: false }))

    form.setValue("players", newPlayers)
  }
</script>

<template>
  <UModal
    fullscreen
    :ui="{
      body: 'px-0 py-0 sm:p-0',
      header: 'bg-tertiary border-0 flex justify-between',
      title: 'text-inverted',
      content:
        'data-[state=open]:animate-[slide-in-from-top_100ms_ease-out] data-[state=closed]:animate-[slide-out-to-top_75ms_ease-in]',
    }">
    <template #header>
      <span class="text-inverted font-semibold">Edit League</span>
      <UButton label="Close" icon="i-lucide-chevron-up" variant="solid" color="neutral" size="md" @click="onClose" />
    </template>
    <template #body>
      <div class="flex flex-col-reverse w-full md:flex-row md:h-full">
        <div class="relative flex flex-col lg:w-2/4 gap-">
          <div name="newPlayer" class="sticky z-50 items-center flex flex-col top-0 justify-between">
            <div class="bg-tertiary text-center text-sm text-inverted sticky top-0 w-full">Squad</div>
            <div
              class="relative w-full flex items-center justify-end bg-tertiary dark:bg-gray-800 border-gray-800 border p-2 border-t-0 -mt-px">
              <FormsAddPlayer ref="addPlayerFormRef" class="w-full" @add-player="onAddPlayer" />
            </div>
            <div
              v-if="leagueForm.players?.length && leagueForm.players.length > 0"
              class="p-2 bg-tertiary w-full rounded-b-md flex justify-between items-center">
              <UButton label="Set All Inactive" color="neutral" size="sm" @click="() => onSetAllInactive()" />
              <div class="text-inverted flex items-center justify-between px-2 text-sm">
                <span class="font-medium">Active Players</span>
                <span class="ml-1 font-semibold">
                  <span class="text-primary">{{ activeSquad.length }}</span>
                  / {{ leagueForm.players?.length }}
                </span>
              </div>
            </div>
          </div>
          <div>
            <UTable
              data-testid="table-player-list"
              :data="leagueForm.players"
              :columns="[
                {
                  header: 'Active?',
                  accessorKey: 'isActive',
                  meta: { class: { th: 'w-0' } },
                },
                { header: 'Player', accessorKey: 'name', meta: { class: { th: 'w-22' } } },
                { header: 'Rank', accessorKey: 'rank', meta: { class: { th: 'w-10' } } },
                { header: 'Gk', accessorKey: 'isGoalie', meta: { class: { th: 'w-0' } } },
                { id: 'actions' },
              ]"
              class="flex-1 max-h-full"
              :ui="{ thead: leagueForm.players?.length === 0 ? 'hidden' : '', td: 'p-1.5', th: 'py-1.5 px-2' }">
              <template #isActive-cell="{ row }">
                <div class="flex items-center justify-center">
                  <UFormField :name="`players.${row.index}.isActive`" #="{ model }">
                    <USwitch v-bind="model" size="xl" />
                  </UFormField>
                </div>
              </template>
              <template #name-cell="{ row }">
                <div class="w-22 truncate">{{ row.original.name }}</div>
              </template>
              <template #rank-cell="{ row }">
                <div class="w-24">
                  <UFormField :name="`players.${row.index}.rank`" #="{ model }">
                    <UInputNumber v-bind="model" size="lg" :min="1" :max="10" :step="1" :ui="{ base: 'disabled' }" />
                  </UFormField>
                </div>
              </template>
              <template #isGoalie-cell="{ row }">
                <div class="flex items-center justify-center">
                  <UFormField :name="`players.${row.index}.isGoalie`" #="{ model }">
                    <UCheckbox v-bind="model" :ui="{ root: 'justify-around' }" size="xl" color="neutral" />
                  </UFormField>
                </div>
              </template>
              <template #actions-cell="{ row }">
                <div class="flex justify-around items-center">
                  <UButton color="error" variant="soft" icon="i-lucide-trash-2" @click="onRemovePlayer(row.index)" />
                </div>
              </template>
              <template #empty>There are no players in this league</template>
            </UTable>
          </div>
        </div>
        <USeparator orientation="vertical" />
        <div class="flex flex-col gap-2 flex-1">
          <UAccordion
            :unmount-on-hide="false"
            :items="[
              { value: 'options', label: 'League Options', slot: 'options' },
              { label: 'Rules', slot: 'rules' },
            ]"
            type="single"
            :ui="{ trigger: 'px-2' }">
            <template #options>
              <FormsLeagueOptions />
            </template>
            <template #rules>
              <FormsLeagueRules />
            </template>
          </UAccordion>
        </div>
      </div>
    </template>
  </UModal>
</template>
