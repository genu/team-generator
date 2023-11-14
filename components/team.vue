<script lang="ts" setup>
import type { Player } from '@prisma/client'
import { map, sumBy } from 'lodash-es'
import { Sortable } from 'sortablejs-vue3'

import type { Options, SortableEvent } from 'sortablejs'

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

const emit = defineEmits<{
  (e: 'movePlayer', fromTeam: number, toTeam: number, oldPlayerIndex: number, newPlayerIndex: number): void
}>()

const teamListOptions: Options = {
  group: {
    name: 'team',
  },
  ghostClass: 'bg-green-200',
  sort: false,
}

const rank = computed(() => {
  const rankAsNumber = map(props.players, (player) => ({ ...player, rank: Number(player.rank) }))

  return sumBy(rankAsNumber, 'rank')
})

const addPlayerToNewTeam = (event: SortableEvent) => {
  const fromTeam: number = parseInt(event.from.dataset['teamId']!)
  const toTeam: number = parseInt(event.to.dataset['teamId']!)

  emit('movePlayer', fromTeam, toTeam, event.oldIndex!, event.newIndex!)
}
</script>

<template>
  <div class="bg-white border-2 border-b border-gray-200 border-gray-400 shadow divide-y divide-gray-200 rounded-md">
    <div class="relative">
      <h2 class="flex flex-col px-5 pt-5 text-lg font-medium text-gray-900 leading-6 md:items-center md:flex-row">
        <span>Team {{ $props.teamNumber }}</span>
        <span class="ml-1 text-xs">({{ players.length }} players)</span>
      </h2>
      <span class="absolute top-0 left-0 px-2 text-xs text-sm text-white bg-green-500">Rank {{ rank }}</span>
      <UIcon
        name="i-heroicons-star-20-solid"
        class="absolute top-0 right-0 m-1 text-lg text-amber-600"
        v-if="$props.choseFirst"
      />
    </div>
    <Sortable
      :list="players"
      item-key="id"
      tag="ul"
      :options="teamListOptions"
      class="flex flex-col px-2 py-2 mt-2 gap-2"
      @add="addPlayerToNewTeam"
      :data-team-id="$props.teamNumber"
    >
      <template #item="{ element: player, index }: { element: Player, index: number }">
        <li
          :key="index"
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
    <pre>{{  }}</pre>
  </div>
</template>
