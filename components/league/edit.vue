<script lang="ts" setup>
import type { League, Player } from '@prisma/client'
import { find } from 'lodash-es'

interface LeagueWithPlayers extends League {
  players: Partial<Player>[]
}
const props = defineProps<{ modelValue: LeagueWithPlayers }>()

const emits = defineEmits<{ 'update:modelValue': [LeagueWithPlayers] }>()

const newPlayer = ref<Partial<Player>>({ name: '', isActive: true, rank: 1 })
const addPlayer = (player: Partial<Player>) => {
  // No empty strings
  if (player.name === '') return

  // No existing players
  if (find(props.modelValue.players, { name: player.name })) return

  player.name = player.name!.trim()
  debugger
  const updatedLeague: LeagueWithPlayers = {
    ...props.modelValue,
    players: [...props.modelValue.players, unref(player)],
  }

  emits('update:modelValue', updatedLeague)
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

      <!-- <div v-if="data.players.length > 0">
              <UInput
                icon="i-heroicons-magnifying-glass-20-solid"
                class="mx-2"
                v-model="playerFilter"
                placeholder="Search players"
              />
              <UDivider />
              <UTable :rows="filteredPlayers" :columns="columns">
                <template #empty-state>
                  <div class="text-sm text-center">
                    No players found
                    <span class="italic font-semibold">"{{ playerFilter }}"</span>
                  </div>
                </template>
                <template #yes-header="p">
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
                  <UToggle v-model="row.yes" color="indigo" />
                </template>
                <template #name-data="{ row }">
                  <UInput v-model="row.name" :disabled="playerFilter !== ''" size="sm" />
                </template>
                <template #rank-data="{ row }">
                  <UInput v-model="row.rank" class="w-16" type="number" size="sm" />
                </template>
                <template #gk-data="{ row }">
                  <UCheckbox v-model="row.gk" name="notifications" />
                </template>
                <template #actions-data="{ index }">
                  <UButton icon="i-heroicons-trash" color="red" variant="outline" @click="removePlayer(index)" size="sm" />
                </template>
              </UTable>
            </div> -->

      <!-- <div class="flex flex-col gap-2" v-if="data.players.length > 0">
              <UDivider />
              <div class="flex items-center justify-end text-lg">
                Active Players:
                <span class="ml-1 font-semibold">{{ activePlayers.length }}</span>
                <span class="text-sm">&nbsp; ({{ data.players.length }} total)</span>
              </div>
            </div> -->
    </div>
    <UDivider orientation="vertical" class="w-5" />
    <div class="flex flex-col flex-1 p-2 gap-2">
      <h2 class="font-bold">Options</h2>
      <div class="flex flex-col font-semibold gap-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-right text-gray-700 w-28">League Name:</span>
          <!-- <UInput v-model="data.config.leagueName" /> -->
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-right text-gray-700 w-28"># of teams:</span>
          <!-- <UInput type="number" v-model="data.config.teamCount" class="w-20" /> -->
        </div>
        <!-- <UAccordion :items="rulesAccordian" color="indigo" variant="soft">
                <template #rules>
                  <div class="flex flex-col px-2 gap-3">
                    <UCheckbox v-model="data.config.rules.goaliesFirst" label="Choose goalies first" />
                    <UCheckbox
                      disabled
                      v-model="data.config.rules.noBestGolieAndPlayer"
                      label="Best goalie cannot be on same team with best player"
                    >
                      <template #label>
                        Best goalie cannot be on same team with best player
                        <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
                      </template>
                    </UCheckbox>
                    <UCheckbox disabled v-model="data.config.rules.noBestGolieAndPlayer">
                      <template #label>
                        Keep goalies
                        <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
                      </template>
                    </UCheckbox>
                    <UCheckbox
                      class="hidden"
                      label="Stefan mode"
                      v-model="data.config.rules.stefanMode"
                      help="Stefan's team has all of the best players"
                    />
                    <UCheckbox
                      class="hidden"
                      label="Beni mode"
                      v-model="data.config.rules.beniMode"
                      help="Every player on the same team as Beni drops in rank by 1 point"
                    />
                  </div>
                </template>
              </UAccordion> -->
      </div>
    </div>
  </div>
</template>
