<script lang="ts" setup>
import type { Player } from '@prisma/client'
import { map, sumBy } from 'lodash-es'
import { Sortable } from 'sortablejs-vue3'

import type { Options, SortableEvent } from 'sortablejs'

const props = defineProps<{
  number: number
  players: Player[]
}>()

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

const rank = computed(() => {
  const rankAsNumber = map(props.players, (player) => ({ ...player, rank: Number(player.rank) }))

  return sumBy(rankAsNumber, 'rank')
})

const addPlayerToNewTeam = (event: SortableEvent) => {
  const fromTeam: number = parseInt(event.from.dataset['teamId'] as string)
  const toTeam: number = parseInt(event.to.dataset['teamId'] as string)

  console.log(fromTeam, toTeam)
  // const player: Player = teams.value[fromTeam][event.oldIndex as number]

  // // Remove player from old team
  // teams.value[fromTeam].splice(event.oldIndex, 1)
  // teams.value[toTeam].splice(event.newIndex, 0, player)

  // writeMethod(`Manually moved ${player.name} to Team ${toTeam + 1}`)
  // emit('shuffled', { teams, methodology: methodology.value })
  // event.item.remove()
}
</script>

<template>
  <div class="bg-white border-2 border-b border-gray-200 border-gray-400 shadow divide-y divide-gray-200 rounded-md">
    <div class="relative">
      <h2 class="flex flex-col px-5 pt-5 text-lg font-medium text-gray-900 leading-6 md:items-center md:flex-row">
        <span>Team {{ $props.number }}</span>
        <span class="ml-1 text-xs">({{ players.length }} players)</span>
      </h2>
      <span class="absolute top-0 left-0 px-2 text-xs text-sm text-white bg-green-500">Rank {{ rank }}</span>
      <UIcon
        name="i-heroicons-star-20-solid"
        class="absolute top-0 right-0 m-1 text-lg text-amber-600"
        v-if="teamToChoose == key"
      />
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
          class="px-2 py-1 text-sm text-gray-600 capitalize bg-gray-100 cursor-pointer rounded-md"
          :class="{ 'font-bold': player.isGoalie }"
        >
          <div class="flex items-center select-none gap-2">
            <UIcon name="i-heroicons-ellipsis-vertical-20-solid" class="text-xl" />
            <span>{{ player.name }} {{ player.isGoalie ? '(GK)' : '' }}</span>
          </div>
        </li>
      </template>
    </Sortable>
  </div>
</template>
