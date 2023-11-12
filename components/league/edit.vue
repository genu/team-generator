<script lang="ts" setup>
import type { League, Player } from '@prisma/client'
import { find, filter } from 'lodash-es'
import type { Config } from '../../interfaces'

interface LeagueWithPlayers extends League {
  players: Partial<Player>[]
}
const props = defineProps<{ modelValue: LeagueWithPlayers }>()

const emit = defineEmits<{ 'update:modelValue': [LeagueWithPlayers] }>()

const league = useCloned(props.modelValue).cloned
const configuration = computed(() => league.value.configuration as unknown as Config)

watchDeep(league, () => {
  emit('update:modelValue', league.value)
})

const newPlayer = ref<Partial<Player>>({ name: '', isActive: true, rank: 1 })

const activePlayers = computed(() => filter(league.value.players, { isActive: true }))

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
const addPlayer = (player: Partial<Player>) => {
  // No empty strings
  if (player.name === '') return

  // No existing players
  if (find(props.modelValue.players, { name: player.name })) return

  player.name = player.name!.trim()

  // const updatedLeague: LeagueWithPlayers = {
  //   ...props.modelValue,
  //   players: [...props.modelValue.players, unref(player)],
  // }
}

const resetActiveState = () => {
  // set all players to inactive
  const updatedPlayers = props.modelValue.players.map((player) => ({ ...player, isActive: false }))

  league.value.players = updatedPlayers
}
</script>

<template>
  <div class="flex w-full">
    <div class="relative flex flex-col lg:w-2/4 gap-2">
      <UDivider label="Squad" />

      <div class="sticky z-50 flex items-center px-2 py-2 bg-gray-200 dark:bg-gray-800 gap-2 top-16 lg:top-20">
        <UInput v-model="newPlayer.name" placeholder="Player Name" class="w-full" @keyup.enter="addPlayer(newPlayer)" />
        <UButton color="indigo" label="Add" @click="addPlayer(newPlayer)" class="justify-around w-32" />
      </div>

      <div v-if="league.players.length > 0">
        <UDivider />
        <UTable :rows="league.players" :columns="columns">
          <template #yes-header>
            <div class="flex flex-col">
              <span class="ml-1">Active?</span>
              <UButton
                label="Reset"
                @click="resetActiveState"
                variant="link"
                color="indigo"
                :ui="{ padding: { md: 'p-1' } }"
              />
            </div>
          </template>
          <template #rank-header="p">
            <div class="flex flex-col">
              <span class="text-center">Rank</span>
              <span class="text-center">(1-10)</span>
            </div>
          </template>
          <template #yes-data="{ row }">
            <UToggle v-model="row.isActive" color="indigo" />
          </template>
          <template #name-data="{ row }">
            <UInput v-model="row.name" size="sm" />
          </template>
          <template #rank-data="{ row }">
            <UInput v-model="row.rank" class="w-16" type="number" size="sm" />
          </template>
          <template #gk-data="{ row }">
            <UCheckbox v-model="row.isGoalie" name="notifications" />
          </template>
          <template #actions-data="{ index }">
            <UButton icon="i-heroicons-trash" color="red" variant="outline" @click="removePlayer(index)" size="sm" />
          </template>
        </UTable>
      </div>

      <div class="flex flex-col gap-2" v-if="league.players.length > 0">
        <UDivider />
        <div class="flex items-center justify-end text-lg">
          Active Players:
          <span class="ml-1 font-semibold">{{ activePlayers.length }}</span>
          <span class="text-sm">&nbsp; ({{ league.players.length }} total)</span>
        </div>
      </div>
    </div>
    <UDivider orientation="vertical" class="w-5" />
    <div class="flex flex-col flex-1 p-2 gap-2">
      <h2 class="font-bold">Options</h2>
      <div class="flex flex-col font-semibold gap-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-right text-gray-700 w-28">League Name:</span>
          <UInput v-model="league.name" />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-right text-gray-700 w-28"># of teams:</span>
          <UInput type="number" v-model="configuration.teamCount" class="w-20" />
        </div>
        <UAccordion :items="rulesAccordian" color="indigo" variant="soft">
          <template #rules>
            <div class="flex flex-col px-2 gap-3">
              <UCheckbox v-model="configuration.rules.goaliesFirst" label="Choose goalies first" />
              <UCheckbox
                disabled
                v-model="configuration.rules.noBestGolieAndPlayer"
                label="Best goalie cannot be on same team with best player"
              >
                <template #label>
                  Best goalie cannot be on same team with best player
                  <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
                </template>
              </UCheckbox>
              <UCheckbox disabled v-model="configuration.rules.keepGoalies">
                <template #label>
                  Keep goalies
                  <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
                </template>
              </UCheckbox>
              <UCheckbox
                class="hidden"
                label="Stefan mode"
                v-model="configuration.rules.stefanMode"
                help="Stefan's team has all of the best players"
              />
              <UCheckbox
                class="hidden"
                label="Beni mode"
                v-model="configuration.rules.beniMode"
                help="Every player on the same team as Beni drops in rank by 1 point"
              />
            </div>
          </template>
        </UAccordion>
      </div>
    </div>
  </div>
</template>
