<template>
  <div class="flex flex-col gap-4 lg:gap-2">
    <Dialog
      header="Share Lineups"
      :draggable="false"
      v-model:visible="isSharingDialog"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
      @after-hide="previewImg = null"
      modal
    >
      <div class="flex flex-col" ref="shareDialog">
        <div class="flex items-center md:gap-2">
          <div class="flex flex-col flex-1">
            <label class="text-lg font-semibold">Edit link:</label>
            <input type="text" v-model="shareUrl" class="flex-1" />
          </div>
          <button class="mt-6 text-right w-14" @click="copy()">
            <span v-if="!copied">Copy</span>
            <span class="text-green-800" v-else>Copied</span>
          </button>
        </div>
        <span class="flex flex-col items-center gap-1" v-if="!previewImg">
          <Icon name="fa6-solid:arrows-spin" class="mt-5 text-4xl" spin />
          <span class="text-sm font-bold">Generating Image</span>
        </span>
        <img :src="previewImg" class="object-contain mt-4 h-96" v-else />
      </div>
      <template #footer>
        <Button label="Close" @click="isSharingDialog = false" class="p-0 p-button-text" />
      </template>
    </Dialog>

    <div class="flex justify-end gap-2" v-if="players.length > 0">
      <span>
        <Button variant="text" class="flex px-2 gap-1" v-if="teams" @click="showSharingWindow">
          <Icon name="fa6-solid:share-from-square" />
          <span class="text-base">Share</span>
        </Button>
      </span>
      <Button variant="success" @click="shuffle">Shuffle Teams</Button>
    </div>
    <div class="flex justify-end">
      <div class="flex flex-col mt-2" v-if="players.length > 0 && !teams">
        <Icon
          name="fa6-solid:arrow-up-long"
          class="text-4xl text-gray-400"
          bounce
          style="--fa-bounce-jump-scale-y: 1"
        />
        <span class="block text-sm font-medium text-gray-900">Click to shuffle</span>
      </div>
    </div>
    <button
      type="button"
      class="relative block w-11/12 p-12 mx-auto my-5 text-center border-2 border-gray-300 border-dashed rounded-lg md:w-1/2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      v-if="!snapshot && players.length > 0"
      @click="shuffle"
    >
      <Icon name="fa6-solid:person-chalkboard" class="text-6xl text-gray-400" />
      <span class="block mt-4 text-sm font-medium text-gray-900">Generate teams</span>
    </button>
    <div class="items-start p-4 gap-3 md:gap-3 grid grid-cols-2 lg:grid-cols-3" ref="snapshotContainer">
      <div
        v-for="(players, key) in teams"
        class="bg-white border-2 border-b border-gray-200 border-gray-400 shadow divide-y divide-gray-200 rounded-md"
      >
        <div class="relative">
          <h2 class="flex flex-col px-5 pt-5 text-lg font-medium text-gray-900 leading-6 md:items-center md:flex-row">
            <span>Team {{ +key + 1 }}</span>
            <span class="ml-1 text-xs">({{ players.length }} players)</span>
          </h2>
          <span class="absolute top-0 left-0 px-2 text-xs text-sm text-white bg-green-500">
            Rank {{ getTeamRank(players) }}
          </span>
        </div>
        <Sortable
          :list="players"
          item-key="id"
          tag="ul"
          :options="teamListOptions"
          class="flex flex-col px-2 py-2 mt-2 gap-2"
          @add="addPlayerToNewTeam"
          :data-team-id="key"
        >
          <template #item="{ element: player, index }: { element: Player, index: number }">
            <li
              :data-id="index"
              class="px-2 py-1 text-base text-gray-600 capitalize bg-gray-100 cursor-pointer rounded-md"
              :class="{ 'font-bold': player.gk }"
            >
              <div class="flex items-center select-none gap-2">
                <Icon name="fa6-solid:ellipsis-vertical" />
                <span v-if="player.name.toLowerCase() === 'michael'" class="text-xs">
                  Average {{ player.name }} {{ player.gk ? '(GK)' : '' }}
                </span>
                <span v-else>{{ player.name }} {{ player.gk ? '(GK)' : '' }}</span>
              </div>
            </li>
          </template>
        </Sortable>
      </div>
    </div>
    <div class="flex justify-around" v-if="numberOfGeneratedTeams > 0 && !usingSeedData">
      <span
        class="flex items-center justify-around w-10/12 px-5 py-2 text-sm border border-2 border-gray-300 border-dashed cursor-pointer md:w-1/2 gap-5 hover:bg-gray-50"
        @click="isShowingProcess = !isShowingProcess"
      >
        <span>
          How were teams chosen?
          <Icon name="fa6-solid:angle-down" v-if="!isShowingProcess" />
          <Icon name="fa6-solid:angle-up" v-else />
        </span>
      </span>
    </div>
    <div class="flex flex-col p-5 text-sm italic bg-white divide-y divide-gray-400" v-if="isShowingProcess">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { groupBy, random, sumBy, keys, filter, map, orderBy } from 'lodash-es'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import html2canvas from 'html2canvas'
import { useClipboard, useBrowserLocation, promiseTimeout } from '@vueuse/core'
import { Sortable } from 'sortablejs-vue3'
import { Options, SortableEvent } from 'sortablejs'

import { Player, Rules, Snapshot } from '~/interfaces'

interface Props {
  players: Player[]
  teamCount: number
  snapshot?: Snapshot
  rules?: Rules
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'shuffled', snapshot: Snapshot): void }>()

const location = useBrowserLocation()
const { write: writeMethod, methodology, initialize: initializeMethod, reset: resetMethodology } = useMethodology()

const shareDialog = ref()

const shareUrl = ref(location.value.href)
const teams = ref<any>({})
const teamToChoose = ref<number>()
const isShowingProcess = ref(false)
const usingSeedData = ref(false)

const isSharingDialog = ref(false)
const snapshotContainer = ref()
const creatingImage = ref(false)

const previewWidth = ref(0)
const previewImg = ref()

const teamListOptions: Options = {
  group: {
    name: 'team',
  },
  ghostClass: 'bg-green-200',
  setData(dataTransfer, dragEl) {
    dataTransfer.setData('poop', 'face')
  },
  sort: false,
}

const { copy, copied } = useClipboard({ source: shareUrl.value })

if (props.snapshot) {
  teams.value = props.snapshot.teams

  initializeMethod(props.snapshot.methodology as string[])
}

const shuffle = () => {
  const groupedByRank = groupBy(props.players, 'rank')

  teamToChoose.value = random(0, props.teamCount - 1)
  teams.value = []
  resetMethodology()

  let rank = 10
  usingSeedData.value = false

  writeMethod(`Team ${teamToChoose.value + 1} is choosing first`)

  // First pick goal keepers
  if (props.rules?.goaliesFirst) {
    const goalKeepers = orderBy(
      filter(props.players, (player) => player.gk),
      ['rank'],
      ['desc']
    )

    writeMethod(`Choosing Goalkeepers first (${map(goalKeepers, 'name').join(', ')})`)

    while (goalKeepers.length > 0) {
      const randomGoalkeeper = goalKeepers.splice(0, 1)[0] as Player

      writeMethod(
        `Team ${teamToChoose.value + 1} chose goal keeper ${randomGoalkeeper.name} (${randomGoalkeeper.rank})`
      )

      if (!teams.value[teamToChoose.value]) {
        const team: any = {}
        team[teamToChoose.value] = []

        teams.value = { ...teams.value, ...team }
      }

      teams.value[teamToChoose.value] = [...teams.value[teamToChoose.value], randomGoalkeeper]

      // Next team chooses
      teamToChoose.value = (teamToChoose.value + 1) % props.teamCount
    }
    writeMethod('Finished selecting goalkeepers')
  }

  while (rank > 0) {
    const playersAtRank = groupedByRank[rank]

    while (playersAtRank && playersAtRank.length > 0) {
      const randomPlayerFromRank = playersAtRank.splice(random(0, playersAtRank.length - 1), 1)[0]

      // Goalies were already chosen, this team can choose again.
      if (props.rules?.goaliesFirst && randomPlayerFromRank.gk) {
        continue
      }

      writeMethod(`Team ${teamToChoose.value + 1} chose ${randomPlayerFromRank.name} (${randomPlayerFromRank.rank})`)

      if (!teams.value[teamToChoose.value]) {
        const team: any = {}
        team[teamToChoose.value] = []

        teams.value = { ...teams.value, ...team }
      }

      teams.value[teamToChoose.value] = [...teams.value[teamToChoose.value], randomPlayerFromRank]

      // Next team chooses
      teamToChoose.value = (teamToChoose.value + 1) % props.teamCount
    }

    rank--
  }

  emit('shuffled', { teams, methodology: methodology.value })
}

const numberOfGeneratedTeams = computed(() => keys(teams.value).length)
const getTeamRank = (players: Player[]) => sumBy(players, 'rank')

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
</script>

<style>
body > div:last-child > span + img {
  display: inline !important;
}
</style>
