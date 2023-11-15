<script lang="ts" setup>
import type { Snapshot, Config } from '~/interfaces'
import type { Player, League } from '@prisma/client'
import { keys } from 'lodash-es'
import { useClipboard, useBrowserLocation, promiseTimeout } from '@vueuse/core'

const props = defineProps<{
  league: League & { players: Player[] }
}>()

const emit = defineEmits<{ (e: 'shuffled', snapshot: Snapshot): void }>()

const location = useBrowserLocation()
const snapshotQuery = useSnapshot()

const { shuffle, methodology: shuffleMethodology, teams, isShuffled, movePlayer } = useTeamShuffle()
const { initialize: initializeMethod, methodology } = shuffleMethodology

const configuration = computed(() => props.league.configuration as unknown as Config)

const { data: snapshots } = snapshotQuery.list(props.league.id)

const shareUrl = ref(location.value.href)

const teamToChoose = ref<number>()
const isShowingProcess = ref(false)
const usingSeedData = ref(false)
const isSharingDialog = ref(false)

const { copy, copied } = useClipboard({ source: shareUrl.value })

// if (props.snapshot) {
//   // teams = props.snapshot.teams
//   teamToChoose.value = props.snapshot.teamToChoose

//   initializeMethod(props.snapshot.methodology as string[])
// }

const numberOfGeneratedTeams = computed(() => keys(teams).length)

const showSharingWindow = async () => {
  isSharingDialog.value = true

  await promiseTimeout(1000)
}

const toggleFavoriteSnapshot = async () => {}
</script>

<template>
  <div class="flex flex-col gap-2 lg:gap-2">
    <UModal
      header="Share Lineups"
      :ui="{
        width: 'sm:max-w-2xl',
      }"
      v-model="isSharingDialog"
    >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900 leading-6 dark:text-white">Share Teams</h3>
          </div>
        </template>
        <div class="flex flex-col">
          <div class="flex items-center md:gap-2">
            <div class="flex flex-col flex-1">
              <label class="text-base font-semibold">Edit link</label>
              <UInput v-model="shareUrl" disabled />
            </div>
            <UButton :label="copied ? 'Copied' : 'Copy'" class="mt-6" @click="copy()" variant="ghost" color="indigo" />
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <UButton @click="isSharingDialog = false" label="Close" variant="ghost" />
          </div>
        </template>
      </UCard>
    </UModal>

    <div class="flex justify-between gap-4" v-if="league.players.length > 0">
      <div>
        <UButton
          color="indigo"
          variant="ghost"
          icon="i-ph-star-bold"
          label="Favorite"
          @click="toggleFavoriteSnapshot"
        />
      </div>
      <div class="flex items-center gap-2">
        <UButton
          v-if="teams"
          color="gray"
          icon="i-heroicons-share-20-solid"
          label="Share"
          variant="ghost"
          @click="showSharingWindow"
        />
        <UButton @click="shuffle(props.league.players, { teamCount: configuration.teamCount })">Shuffle Teams</UButton>
      </div>
    </div>
    <div class="flex justify-end">
      <div class="flex flex-col items-center mt-2 mr-3" v-if="league.players.length > 0 && !isShuffled">
        <UIcon
          name="i-heroicons-arrow-long-up-20-solid"
          class="text-4xl text-gray-400 animate-bounce"
          style="--fa-bounce-jump-scale-y: 1"
        />
        <span class="block text-sm font-medium text-gray-900">Click to shuffle</span>
      </div>
    </div>
    <div class="items-start mt-2 gap-3 md:gap-3 grid grid-cols-2 lg:grid-cols-3">
      <Team
        v-for="(players, teamNumber) in teams"
        :key="teamNumber"
        :team-number="teamNumber"
        :players="players"
        @move-player="movePlayer"
      />
    </div>
    <div class="flex justify-around py-2" v-if="numberOfGeneratedTeams > 0 && !usingSeedData">
      <UButton
        variant="outline"
        @click="isShowingProcess = !isShowingProcess"
        :icon="!isShowingProcess ? 'i-heroicons-chevron-down-20-solid' : 'i-heroicons-chevron-up-20-solid'"
        trailing
      >
        How were teams chosen?
      </UButton>
    </div>
    <UCard v-if="isShowingProcess" class="text-sm">
      <div class="not-italic">
        <h2 class="py-0 my-0">Strategy</h2>
        <ul class="pb-2 mx-5 list-disc">
          <li>Players are grouped by ranks</li>
          <li>A random team is selected to choose first</li>
          <li>Each team chooses a random player from the highest ranked group</li>
          <li>Process continues from highest ranked players to lowest ranked players until all players are selected</li>
        </ul>
      </div>
      <div>
        <p class="mt-2 capitalize" v-for="(instruction, index) in methodology" :class="{ 'font-bold': index === 0 }">
          {{ instruction }}
        </p>
      </div>
    </UCard>
  </div>
</template>
