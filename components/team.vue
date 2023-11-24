<script lang="ts" setup>
import type { Player } from '@prisma/client'
import { map, sumBy } from 'lodash-es'
import { SlickList, SlickItem } from 'vue-slicksort'

const props = withDefaults(
  defineProps<{
    teamNumber: string
    players: Player[]
    choseFirst?: boolean
  }>(),
  {
    choseFirst: false,
  }
)

const playerList = computed({
  get() {
    return props.players
  },
  set(value: Player[]) {
    return value
  },
})

const emit = defineEmits<{
  (e: 'addPlayer', teamNumber: string, newIndex: number, value: Player): void
  (e: 'removePlayer', teamNumber: string, oldIndex: number): void
  (e: 'teamChanged'): void
}>()

const rank = computed(() => {
  const rankAsNumber = map(props.players, (player) => ({ ...player, rank: Number(player.rank) }))

  return sumBy(rankAsNumber, 'rank')
})

const onPlayerRemove = ({ oldIndex }: { oldIndex: number }) => {
  emit('removePlayer', props.teamNumber, oldIndex)
  emit('teamChanged')
}

const onPlayerAdd = ({ newIndex, value }: { newIndex: number; value: Player }) => {
  emit('addPlayer', props.teamNumber, newIndex, value)
  emit('teamChanged')
}
</script>

<template>
  <div class="bg-white border-2 border-b border-gray-400 shadow divide-y divide-gray-200 rounded-md">
    <div class="relative">
      <h2 class="flex flex-col px-5 pt-5 text-lg font-medium text-gray-900 leading-6 md:items-center md:flex-row">
        <span>Team {{ $props.teamNumber }}</span>
        <span class="ml-1 text-xs">({{ players.length }} players)</span>
      </h2>
      <span class="absolute top-0 left-0 px-2 text-xs text-white bg-green-500">Rank {{ rank }}</span>
      <UIcon
        name="i-heroicons-star-20-solid"
        class="absolute top-0 right-0 m-1 text-lg text-amber-600"
        v-if="choseFirst"
      />
    </div>
    <SlickList
      :list="playerList"
      class="flex flex-col p-2 gap-2"
      group="team"
      @sort-insert="onPlayerAdd"
      @sort-remove="onPlayerRemove"
      helperClass="z-50 z-auto absolute"
    >
      <SlickItem
        v-for="(player, index) in playerList"
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
