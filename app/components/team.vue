<script lang="ts" setup>
import { map, sumBy } from 'lodash-es'
import { SlickList, SlickItem } from 'vue-slicksort'
import type { SnapshotPlayer } from '#shared/schemas'

type SortInsertEvent = {
  newIndex: number
  value: SnapshotPlayer
}

type SortRemoveEvent = {
  oldIndex: number
}

type SortEndEvent = {
  newIndex: number
  oldIndex: number
  value: SnapshotPlayer
}

const props = withDefaults(
  defineProps<{
    teamNumber: number
    players: SnapshotPlayer[]
    choseFirst?: boolean
  }>(),
  {
    choseFirst: false,
  },
)

const emit = defineEmits<{
  movePlayer: [number, number]
  addPlayer: [number, number, SnapshotPlayer]
  removePlayer: [number, number]
}>()

const rank = computed(() => {
  const rankAsNumber = map(props.players, (player) => ({ ...player, rank: Number(player.rank) }))

  return sumBy(rankAsNumber, 'rank')
})
</script>

<template>
  <div class="bg-white border-2 border-b border-gray-400 shadow divide-y divide-gray-200 rounded-md">
    <div class="relative">
      <h2 class="flex flex-col px-5 pt-5 text-lg font-medium text-gray-900 leading-6 md:items-center md:flex-row">
        <span>Team {{ props.teamNumber }}</span>
        <span class="ml-1 text-xs">({{ players.length }} players)</span>
      </h2>
      <span class="absolute top-0 left-0 px-2 text-xs text-white bg-green-500">Rank {{ rank }}</span>
      <UIcon v-if="choseFirst" name="i-heroicons-star-20-solid" class="absolute top-0 right-0 m-1 text-lg text-amber-600" />
    </div>
    <SlickList
      :list="props.players"
      class="flex flex-col p-2 gap-2"
      group="team"
      helper-class="z-50 z-auto absolute"
      @sort-insert="(e: SortInsertEvent) => emit('addPlayer', props.teamNumber, e.newIndex, e.value)"
      @sort-remove="(e: SortRemoveEvent) => emit('removePlayer', props.teamNumber, e.oldIndex)"
    >
      <SlickItem
        v-for="(player, index) in props.players"
        :key="player"
        :index="index"
        class="z-auto flex items-center px-2 py-1 text-sm text-gray-600 capitalize bg-gray-100 cursor-pointer select-none gap-2 rounded-md"
        :class="{ 'font-bold': player.isGoalie }"
      >
        <UIcon name="i-heroicons-ellipsis-vertical-20-solid" class="text-xl" />
        <span>{{ player.name }} {{ player.isGoalie ? '(GK)' : '' }}</span>
      </SlickItem>
    </SlickList>
  </div>
</template>
