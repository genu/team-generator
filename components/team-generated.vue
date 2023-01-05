<template>
  <div class="flex flex-col">
    <div class="flex justify-end">
      <button
        type="button"
        class="ml-3 inline-flex items-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        @click="generate"
      >
        Shuffle Teams
      </button>
    </div>
    <Sortable :list="players" item-key="name">
      <template #header>
        <h1>Sortable</h1>
      </template>
      <template #item="{ element, index }">
        <div class="draggable" :key="index">
          {{ element.name }}
        </div>
      </template>
      <template #footer>
        <div class="draggable">A footer</div>
      </template>
    </Sortable>
  </div>
</template>

<script lang="ts" setup>
import { Player } from '~/interfaces'
import { Sortable } from 'sortablejs-vue3'

interface Props {
  players: Player[]
  teamCount: number
}

defineProps<Props>()

const generate = () => {}
</script>
