<script lang="ts" setup>
import type { League, Player } from '@prisma/client'
import { find, filter } from 'lodash-es'
import { useForm } from '@formwerk/core'
import type { TableColumn } from '@nuxt/ui'
import { type LeagueDTO, type LeagueConfig, PlayerDTOSchema } from '#shared/schemas/forms/create-league.form'

type LeagueWithPlayers = League & { players: Player[] }

const { league } = defineProps<{ league: LeagueWithPlayers }>()

const squadTableColumns: TableColumn<Player>[] = [
  {
    header: 'Active?',
  },
  { header: 'Player' },
  { header: 'Rank' },
  { header: 'Gk' },
  { id: 'actions' },
]

// const props = defineProps<{ modelValue: LeagueWithPlayers }>()
// const emit = defineEmits<{ 'update:modelValue': [LeagueWithPlayers] }>()

// const {} = useFocus({

// })
const configuration = computed(() => league.configuration)

// const newPlayer = ref<Partial<Player>>({ name: '', isActive: true, rank: 1 })

// const activePlayers = computed(() => filter(props.modelValue.players, { isActive: true }))

// const ctx = useFormContext()
const { handleSubmit: handleAddNewPlayer } = useForm({
  schema: PlayerDTOSchema,
  initialValues: {
    rank: 1,
    isActive: true,
    isGoalie: false,
  },
})

const columns = [
  {
    key: 'yes',
  },
  {
    key: 'name',
    label: 'Player',
  },
  {
    key: 'rank',
  },
  {
    key: 'gk',
    label: 'Gk',
  },
  {
    key: 'actions',
  },
]

const rulesAccordian = [
  {
    label: 'Rules',
    icon: 'i-heroicons-cog-6-tooth',
    slot: 'rules',
  },
]
const updatePlayer = (field: keyof Player, value: any, index: number) => {
  // const updatedPlayer = { ...props.modelValue.players[index], [field]: value }
  // emit('update:modelValue', {
  //   ...props.modelValue,
  //   players: props.modelValue.players.map((player, i) => (i === index ? updatedPlayer : toRaw(player))),
  // })
}

const updateLeague = (field: any, value: string) => {
  // emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const updateConfiguration = (field: any, value: any) => {
  // emit('update:modelValue', {
  //   ...props.modelValue,
  //   configuration: { ...(props.modelValue.configuration as object), [field]: value },
  // })
}

const updateRules = (field: any, value: any) => {
  // emit('update:modelValue', {
  //   ...props.modelValue,
  //   configuration: {
  //     ...(props.modelValue.configuration as object),
  //     rules: { ...(props.modelValue.configuration as unknown as Config).rules, [field]: value },
  //   },
  // })
}

const addPlayer = handleAddNewPlayer((player) => {
  // No existing players
  // if (find(league.players, { name: player.name })) return
  // newPlayer.value.name = newPlayer.value.name!.trim()
  // emit('update:modelValue', {
  //   ...props.modelValue,
  //   players: [...props.modelValue.players, { ...newPlayer.value }],
  // })
  // newPlayer.value = { name: '', isActive: true, rank: 1 }
})

const removePlayer = (index: number) => {
  // const updatedPlayers = props.modelValue.players.filter((_player, i) => i !== index)
  // emit('update:modelValue', { ...props.modelValue, players: updatedPlayers })
}

const resetActiveState = () => {
  // set all players to inactive
  // const updatedPlayers = props.modelValue.players.map((player) => ({ ...player, isActive: false }))
  // emit('update:modelValue', { ...props.modelValue, players: updatedPlayers })
}
</script>

<template>
  <div class="flex flex-col-reverse w-full md:flex-row">
    <div class="relative flex flex-col lg:w-2/4 gap-2">
      <USeparator label="Squad" />

      <div class="sticky z-50 flex items-center px-2 py-2 bg-gray-200 dark:bg-gray-800 gap-2 top-16 lg:top-20 justify-between">
        <UFormInputText name="name" placeholder="Player Name" :field-ui="{ root: 'flex-1' }" @keyup.enter="addPlayer" />
        <UButton data-testid="add-player-button" color="secondary" label="Add" class="justify-around w-32" @click="addPlayer" />
      </div>

      <div>
        <USeparator />
        <UTable :data="league.players" :columns="squadTableColumns">
          <template #empty>There are no players here</template>
        </UTable>
        <!-- <UTable :rows="modelValue.players" :columns="columns" :ui="{ base: 'table-player-list' }">
          <template #yes-header>
            <div class="flex flex-col">
              <span class="ml-1">Active?</span>
              <UButton label="Reset" @click="resetActiveState" variant="link" color="indigo" :ui="{ padding: { md: 'p-1' } }" />
            </div>
          </template>
          <template #rank-header>
            <div class="flex flex-col">
              <span class="text-center">Rank</span>
              <span class="text-center">(1-10)</span>
            </div>
          </template>
          <template #yes-data="{ row, index }">
            <UToggle
              v-model="row.isActive"
              @update:model-value="(value:boolean) => updatePlayer('isActive', value, index)"
              color="indigo"
            />
          </template>
          <template #name-data="{ row, index }">
            <UInput v-model="row.name" @update:model-value="(value:any)=> updatePlayer('name',value, index)" />
          </template>
          <template #rank-data="{ row, index }">
            <UInput
              v-model="row.rank"
              @update:model-value="(value:number)=>updatePlayer('rank',value, index)"
              class="w-16 mx-1"
              type="number"
            />
          </template>
          <template #gk-data="{ row, index }">
            <UCheckbox
              v-model="row.isGoalie"
              @update:model-value="(value:boolean) => updatePlayer('isGoalie', value, index)"
              class="mx-1"
            />
          </template>
          <template #actions-data="{ index }">
            <UButton icon="i-heroicons-trash" color="red" variant="outline" @click="removePlayer(index)" class="mx-3" />
          </template>
        </UTable> -->
      </div>

      <!-- <div class="flex flex-col gap-2" v-if="modelValue.players?.length > 0">
        <UDivider />
        <div class="flex items-center justify-end px-3 py-2 text-base">
          Active Players:
          <span class="ml-1 font-semibold">
            <span class="text-green-600">{{ activePlayers.length }}</span>
            / {{ modelValue.players.length }}
          </span>
        </div>
      </div> -->
    </div>
    <!-- <UDivider orientation="vertical" class="w-5" /> -->
    <!-- <div class="flex flex-col flex-1 p-2 gap-2">
      <h2 class="font-bold">Options</h2>
      <div class="flex flex-col font-semibold gap-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-right text-gray-700 w-28">League Name:</span>
          <UInput
            data-testid="edit-team-name-input"
            :model-value="modelValue.name!"
            @update:model-value="(value:string) => updateLeague('name', value)"
          />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-right text-gray-700 w-28"># of teams:</span>
          <UInput
            data-testid="edit-team-count-input"
            type="number"
            :model-value="configuration.teamCount"
            @update:model-value="(value:number) => updateConfiguration('teamCount', value)"
            class="w-20"
          />
        </div>
        <UAccordion :items="rulesAccordian" color="indigo" variant="soft">
          <template #rules>
            <div class="flex flex-col px-2 gap-3">
              <UCheckbox
                @update:model-value="(value:boolean)=>updateRules('goaliesFirst',value)"
                :model-value="configuration.rules.goaliesFirst"
                label="Choose goalies first"
              />
              <UCheckbox
                disabled
                :model-value="configuration.rules.noBestGolieAndPlayer"
                @update:model-value="(value:boolean)=>updateRules('noBestGolieAndPlayer',value)"
                label="Best goalie cannot be on same team with best player"
              >
                <template #label>
                  Best goalie cannot be on same team with best player
                  <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
                </template>
              </UCheckbox>
              <UCheckbox
                disabled
                :model-value="configuration.rules.keepGoalies"
                @update:model-value="(value:boolean)=>updateRules('keepGoalies',value)"
              >
                <template #label>
                  Keep goalies
                  <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
                </template>
              </UCheckbox>
              <UCheckbox
                class="hidden"
                label="Stefan mode"
                :model-value="configuration.rules.stefanMode"
                @update:model-value="(value:boolean)=>updateRules('stefanMode',value)"
                help="Stefan's team has all of the best players"
              />
              <UCheckbox
                class="hidden"
                label="Beni mode"
                :model-value="configuration.rules.beniMode"
                @update:model-value="(value:boolean)=>updateRules('beniMode',value)"
                help="Every player on the same team as Beni drops in rank by 1 point"
              />
            </div>
          </template>
        </UAccordion>
      </div>
    </div> -->
  </div>
</template>
