<script lang="ts" setup>
import { filter } from 'lodash-es'
import type { LeagueEditForm$ } from '~/forms/useLeagueEditForm'

const { league } = defineProps<{
  league: LeagueEditForm$['$value']
}>()

const emits = defineEmits<{
  close: [LeagueEditForm$['$value']]
}>()

const toast = useToast()
const { colors } = useShirtColors()

const { r$: PlayerEditForm } = usePlayerEditForm()
const { r$: leagueEditForm } = useLeagueEditForm()

leagueEditForm.$reset({
  toState: league,
})

const activeSquad = computed(() => filter(leagueEditForm.$value.players, { isActive: true }))

const onAddPlayer = async () => {
  const newPlayer = PlayerEditForm.$value

  if (!newPlayer.name) {
    toast.add({
      title: 'Player name is required',
      icon: 'i-heroicons-exclamation-triangle-solid',
      color: 'warning',
    })
    return
  }
  const existingPlayer = leagueEditForm.$value.players.find((p) => p.name.toLowerCase() === newPlayer.name.trim().toLowerCase())

  if (existingPlayer) {
    toast.add({
      title: 'Player already exists',
      icon: 'i-heroicons-exclamation-triangle-solid',
      color: 'warning',
    })
    return
  }

  leagueEditForm.$value.players.push({
    name: newPlayer.name.trim(),
    rank: 1,
    isActive: true,
    isGoalie: false,
  })

  PlayerEditForm.$reset({ toInitialState: true })
}

const onRemovePlayer = (index: number) => leagueEditForm.$value.players.splice(index, 1)
const onClose = async () => {
  const { valid } = await leagueEditForm.$validate()

  if (valid) emits('close', leagueEditForm.$value)
}
</script>

<template>
  <UModal
    fullscreen
    :ui="{
      close: 'data-testid-edit-close-button',
      body: 'px-0 py-0 sm:p-0',
      header: 'bg-tertiary border-0 flex justify-between',
      title: 'text-inverted',
      content: 'data-[state=open]:animate-[slide-in-from-top_200ms_ease-out] data-[state=closed]:animate-[slide-out-to-top_200ms_ease-in]',
    }"
  >
    <template #header>
      <span class="text-inverted font-semibold">Edit League</span>
      <UButton
        label="Close"
        data-testid="edit-league-close-button"
        icon="i-ph-caret-up"
        variant="solid"
        color="neutral"
        size="md"
        @click="onClose"
      />
    </template>
    <template #body>
      <div class="flex flex-col-reverse w-full md:flex-row md:h-full">
        <div class="relative flex flex-col lg:w-2/4 gap-">
          <div name="newPlayer" class="sticky z-50 items-center flex flex-col top-0 justify-between">
            <div class="bg-tertiary text-center text-sm text-inverted sticky top-0 w-full">Squad</div>
            <div
              class="relative w-full flex items-center justify-end bg-tertiary dark:bg-gray-800 border-gray-800 border p-2 border-t-0 -mt-px"
            >
              <UFormField :error="PlayerEditForm.$errors.name[0]">
                <UInput v-model="PlayerEditForm.$value.name" placeholder="Player Name" @keyup.enter="onAddPlayer" />
              </UFormField>

              <UButton
                data-testid="add-player-button"
                color="success"
                icon="i-ph-plus-bold"
                label="Add Player"
                size="xs"
                :ui="{ base: 'absolute mr-2' }"
                @click="onAddPlayer"
              />
            </div>
            <div
              v-if="leagueEditForm.$value.players.length > 0"
              class="p-2 bg-tertiary w-full rounded-b-md flex justify-between items-center"
            >
              <UButton
                label="Set All Inactive"
                color="neutral"
                size="sm"
                @click="() => leagueEditForm.$value.players.forEach((player) => (player.isActive = false))"
              />
              <div class="text-inverted flex items-center justify-between px-2 text-sm">
                <span class="font-medium">Active Players</span>
                <span class="ml-1 font-semibold">
                  <span class="text-primary">{{ activeSquad.length }}</span>
                  / {{ leagueEditForm.$value.players.length }}
                </span>
              </div>
            </div>
          </div>
          <div>
            <UTable
              data-testid="table-player-list"
              :data="leagueEditForm.$value.players"
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
              :ui="{ thead: leagueEditForm.$value.players.length === 0 ? 'hidden' : '', td: 'p-1.5', th: 'py-1.5 px-2' }"
            >
              <template #isActive-cell="{ row }">
                <div class="flex items-center justify-center">
                  <USwitch v-model="row.original.isActive" size="lg" />
                </div>
              </template>
              <template #name-cell="{ row }">
                <div class="w-22 truncate">{{ row.original.name }}</div>
              </template>
              <template #rank-cell="{ row }">
                <div class="w-24">
                  <UInputNumber v-model="row.original.rank" :min="1" :max="10" :step="1" size="lg" name="rank" />
                </div>
              </template>
              <template #isGoalie-cell="{ row }">
                <div class="flex items-center justify-center">
                  <UCheckbox v-model="row.original.isGoalie" size="xl" color="neutral" :ui="{ root: 'justify-around' }" />
                </div>
              </template>
              <template #actions-cell="{ row }">
                <div class="flex justify-around items-center">
                  <UButton color="error" variant="soft" icon="i-ph-trash" @click="onRemovePlayer(row.index)" />
                </div>
              </template>
              <template #empty>There no players in this league</template>
            </UTable>
          </div>
        </div>
        <USeparator orientation="vertical" />
        <div class="flex flex-col gap-2 flex-1">
          <UAccordion
            default-value="options"
            :unmount-on-hide="false"
            :items="[
              { value: 'options', label: 'League Options', slot: 'options' },
              { label: 'Rules', slot: 'rules' },
            ]"
            type="single"
            :ui="{ content: 'flex flex-col gap-1.5', trigger: 'px-2' }"
          >
            <template #options>
              <div class="p-2 flex flex-col gap-2">
                <UFormField
                  label="League Name:"
                  size="lg"
                  :error="leagueEditForm.$errors.options.name[0]"
                  :ui="{ root: 'flex items-center gap-2', labelWrapper: 'flex justify-end', wrapper: 'w-28', container: 'flex-1' }"
                >
                  <UInput
                    v-model="leagueEditForm.$value.options.name"
                    testid="edit-team-name"
                    size="lg"
                    placeholder="League Name"
                    data-testid="edit-team-name-input"
                    :ui="{ root: 'flex items-center gap-2' }"
                  />
                </UFormField>

                <UFormField
                  label="# of Teams:"
                  size="lg"
                  :error="leagueEditForm.$errors.options.teamCount[0]"
                  :ui="{ root: 'flex items-center gap-2', labelWrapper: 'flex justify-end', wrapper: 'w-28', container: 'flex-1' }"
                >
                  <UInputNumber
                    v-model="leagueEditForm.$value.options.teamCount"
                    testid="edit-team-count"
                    :ui="{ root: 'w-28' }"
                    :min="0"
                    :increment="{ color: 'info', variant: 'solid', size: 'sm' }"
                    :decrement="{ color: 'info', variant: 'solid', size: 'sm' }"
                  />
                </UFormField>
                <DevOnly>
                  <UFormField
                    size="lg"
                    :error="leagueEditForm.$errors.options.useTeamColors && leagueEditForm.$errors.options.useTeamColors[0]"
                    :ui="{ root: 'flex items-center gap-2', labelWrapper: 'flex justify-end', wrapper: 'w-28', container: 'flex-1' }"
                  >
                    <UCheckbox
                      v-model="leagueEditForm.$value.options.useTeamColors"
                      label="Use Team Colors"
                      description="Assign shirt colors for teams"
                    />
                  </UFormField>
                </DevOnly>
                <UFormField
                  size="lg"
                  :error="leagueEditForm.$errors.options.teamColors && leagueEditForm.$errors.options.teamColors[0]!"
                  :ui="{
                    root: 'flex items-center gap-2',
                    labelWrapper: 'flex justify-end',
                    wrapper: 'w-28',
                    container: 'flex-1',
                  }"
                >
                  <USelect
                    v-if="leagueEditForm.$value.options.useTeamColors"
                    v-model="leagueEditForm.$value.options.teamColors"
                    :items="colors"
                    multiple
                    value-key="name"
                    label-key="name"
                    placeholder="Select Team Colors"
                    :ui="{ base: 'flex w-full', content: 'w-full', viewport: 'yo', group: 'yo', label: 'hi', value: 'yo' }"
                  >
                    <template #item-label="{ item }">
                      <div :style="{ backgroundColor: item.background, color: item.foreground }" class="p-1 rounded-md bg-gray-200">
                        {{ item.name }}
                      </div>
                    </template>
                  </USelect>
                </UFormField>
              </div>
            </template>
            <template #rules>
              <div class="p-2 flex flex-col gap-2">
                <USwitch
                  v-model="leagueEditForm.$value.options.rules.goaliesFirst"
                  testid="config-goalies-first"
                  label="Choose goalies first"
                />
                <USwitch
                  v-model="leagueEditForm.$value.options.rules.noBestGolieAndPlayer"
                  disabled
                  testid="config-no-best-goalies-and-player"
                  label="Best goalie cannot be on same team with best player (soon)"
                />
                <USwitch
                  v-model="leagueEditForm.$value.options.rules.keepGoalies"
                  disabled
                  testid="config-keepGoalies"
                  label="Keep goalies (soon)"
                />
                <USwitch
                  v-model="leagueEditForm.$value.options.rules.beniMode"
                  disabled
                  testid="config-beniMode"
                  label="Every player on the same team as Beni drops in rank by 1 point (soon)"
                />
              </div>
            </template>
          </UAccordion>
        </div>
      </div>
    </template>
  </UModal>
</template>
