<script lang="ts" setup>
import type { SortableEvent } from 'sortablejs'
import type { Rules, Snapshot } from '~/interfaces'
import type { Player } from '@prisma/client'
import { keys } from 'lodash-es'
import html2canvas from 'html2canvas'
import { useClipboard, useBrowserLocation, promiseTimeout } from '@vueuse/core'

const props = defineProps<{
  leagueId: number
  players: Player[]
  teamCount: number
  snapshot?: Snapshot
  rules?: Rules
}>()

const emit = defineEmits<{ (e: 'shuffled', snapshot: Snapshot): void }>()

const location = useBrowserLocation()
const snapshotQuery = useSnapshot()

const { shuffle, methodology: shuffleMethodology, teams, shuffled } = useTeamShuffle()
const { initialize: initializeMethod, write: writeMethod, methodology } = shuffleMethodology

const { data: snapshots } = snapshotQuery.list(props.leagueId)

const shareDialog = ref()

const shareUrl = ref(location.value.href)

const teamToChoose = ref<number>()
const isShowingProcess = ref(false)
const usingSeedData = ref(false)

const isSharingDialog = ref(false)
const snapshotContainer = ref()
const creatingImage = ref(false)

const previewWidth = ref(0)
const previewImg = ref()

const { copy, copied } = useClipboard({ source: shareUrl.value })

if (props.snapshot) {
  teams.value = props.snapshot.teams
  teamToChoose.value = props.snapshot.teamToChoose

  initializeMethod(props.snapshot.methodology as string[])
}

const numberOfGeneratedTeams = computed(() => keys(teams.value).length)

const showSharingWindow = async () => {
  isSharingDialog.value = true
  creatingImage.value = true

  await promiseTimeout(1000)

  previewWidth.value = shareDialog.value.clientWidth
  const canvas = await html2canvas(snapshotContainer.value)
  previewImg.value = canvas.toDataURL()

  creatingImage.value = false

  const viewer = document.querySelector('#snapshot-viewer')

  viewer?.appendChild(canvas)
}

const addPlayerToNewTeam = (event: SortableEvent) => {
  const fromTeam: number = parseInt(event.from.dataset['teamId'] as string)
  const toTeam: number = parseInt(event.to.dataset['teamId'] as string)

  const player: Player = teams.value[fromTeam][event.oldIndex as number]

  // Remove player from old team
  teams.value[fromTeam].splice(event.oldIndex, 1)
  teams.value[toTeam].splice(event.newIndex, 0, player)

  writeMethod(`Manually moved ${player.name} to Team ${toTeam + 1}`)
  emit('shuffled', { teams, methodology: methodology.value })
  event.item.remove()
}

const toggleFavoriteSnapshot = async () => {}
</script>

<template>
  <div class="flex flex-col gap-2 lg:gap-2">
    <UModal
      ref="shareDialog"
      header="Share Lineups"
      :ui="{
        width: 'sm:max-w-4xl',
      }"
      v-model="isSharingDialog"
      @after-hide="previewImg = null"
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
          <span class="flex flex-col items-center gap-1" v-if="!previewImg">
            <UIcon name="i-heroicons-arrow-path-20-solid" class="mt-5 text-4xl animate-spin" />
            <span class="text-sm font-bold">Generating Image</span>
          </span>
          <img :src="previewImg" class="object-contain mt-4 h-96" v-else />
        </div>
        <template #footer>
          <div class="flex justify-end">
            <UButton @click="isSharingDialog = false" label="Close" variant="ghost" />
          </div>
        </template>
      </UCard>
    </UModal>

    <div class="flex justify-between gap-4" v-if="players.length > 0">
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
        <UButton @click="shuffle(props.players, { teamCount: props.teamCount })">Shuffle Teams</UButton>
      </div>
    </div>
    <div class="flex justify-end">
      <div class="flex flex-col items-center mt-2 mr-3" v-if="players.length > 0 && !shuffled">
        <UIcon
          name="i-heroicons-arrow-long-up-20-solid"
          class="text-4xl text-gray-400 animate-bounce"
          style="--fa-bounce-jump-scale-y: 1"
        />
        <span class="block text-sm font-medium text-gray-900">Click to shuffle</span>
      </div>
    </div>
    <div class="items-start mt-2 gap-3 md:gap-3 grid grid-cols-2 lg:grid-cols-3" ref="snapshotContainer">
      <Team v-for="(players, key) in teams" :team-number="+key + 1" :players="players" />
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

<style>
body > div:last-child > span + img {
  display: inline !important;
}
</style>
