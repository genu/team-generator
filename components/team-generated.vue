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
    <h2>players</h2>
    <pre>{{ players }}</pre>
    <h2>number of teams: {{ teamCount }}</h2>
  </div>
</template>

<script lang="ts" setup>
import { Player } from '~/pages/[...slug].vue'

interface Props {
  players: Player[]
  teamCount: number
}

defineProps<Props>()

const generate = () => {}
</script>
