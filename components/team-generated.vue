<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-end">
      <button
        type="button"
        class="ml-3 inline-flex items-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        v-if="players.length > 0"
        @click="shuffle"
      >
        Shuffle Teams
      </button>
    </div>
    <div class="flex gap-5 m-5 flex-wrap">
      <div
        v-for="(players, key) in teams"
        class="border-b border-gray-200 bg-white divide-y divide-gray-200 w-44"
      >
        <div class="relative">
          <h2 class="text-lg font-medium leading-6 text-gray-900 px-5 pt-5">
            Team {{ +key + 1 }}
          </h2>
          <span
            class="absolute top-0 left-0 text-sm bg-green-500 px-2 text-white text-xs"
          >
            Rank {{ getTeamRank(players) }}
          </span>
        </div>
        <ul class="flex flex-col gap-1 mt-2 px-4 py-2">
          <li v-for="player in players" class="text-sm font-medium text-gray-900">
            {{ player.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex justify-around" v-if="numberOfGeneratedTeams > 0">
      <span
        class="flex items-center gap-5 border px-5 py-2 border-2 border-dashed border-gray-300 text-sm hover:bg-gray-50 cursor-pointer"
        @click="isShowingProcess = !isShowingProcess"
      >
        How were teams chosen?
        <FaIcon icon="angle-down" v-if="!isShowingProcess" />
        <FaIcon icon="angle-up" v-else />
      </span>
    </div>
    <div
      class="flex flex-col bg-white p-5 italic text-sm divide-y divide-gray-400"
      v-if="isShowingProcess"
    >
      <div class="not-italic">
        <h2 class="py-0 my-0">Strategy</h2>
        <ul class="pb-2 list-disc mx-5">
          <li>Players are grouped by ranks</li>
          <li>A random team is selected to choose first</li>
          <li>Each team chooses a random player from the highest ranked group</li>
          <li>
            Process continues from highest ranked players to lowest ranked players until
            all players are selected
          </li>
        </ul>
      </div>
      <div>
        <p
          class="mt-2"
          v-for="(instruction, index) in process"
          :class="{ 'font-bold': index === 0 }"
        >
          {{ instruction }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { groupBy, random, sumBy, keys } from 'lodash-es'
import { Player } from '~/interfaces'

interface Props {
  players: Player[]
  teamCount: number
  previouslyGenerated?: any
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'shuffled', teams: any): void }>()
const teams = ref<any>({})
const teamToChoose = ref<number>()
const isShowingProcess = ref(false)
const process = ref<string[]>([])

if (props.previouslyGenerated) {
  teams.value = props.previouslyGenerated
}

const shuffle = () => {
  const groupedByRank = groupBy(props.players, 'rank')
  teamToChoose.value = random(0, props.teamCount - 1)
  teams.value = []
  process.value = []
  let rank = 10

  process.value = [...process.value, `Team ${teamToChoose.value + 1} is choosing first`]

  while (rank > 0) {
    const playersAtRank = groupedByRank[rank]

    while (playersAtRank && playersAtRank.length > 0) {
      const randomPlayerFromRank = playersAtRank.splice(
        random(0, playersAtRank.length - 1),
        1
      )[0]

      process.value = [
        ...process.value,
        `Team ${teamToChoose.value + 1} chose ${randomPlayerFromRank.name} (rank: ${
          randomPlayerFromRank.rank
        })`,
      ]

      if (!teams.value[teamToChoose.value]) {
        const team: any = {}
        team[teamToChoose.value] = []

        teams.value = { ...teams.value, ...team }
      }

      teams.value[teamToChoose.value] = [
        ...teams.value[teamToChoose.value],
        randomPlayerFromRank,
      ]

      // Next team chooses
      teamToChoose.value = (teamToChoose.value + 1) % props.teamCount
    }

    rank--
  }

  emit('shuffled', teams.value)
}

const numberOfGeneratedTeams = computed(() => keys(teams.value).length)
const getTeamRank = (players: Player[]) => {
  return sumBy(players, 'rank')
}
</script>
