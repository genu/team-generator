<template>
  <div class="flex flex-col">
    <div
      class="z-40 h-20 bg-gray-800 py-10 px-5 flex items-center justify-between rounded-b-md"
    >
      <h2
        class="text-xl md:text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight capitalize"
      >
        {{ decodedData.config.league }}
      </h2>
      <div class="flex md:mt-0 md:ml-4">
        <button
          type="button"
          class="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          @click="isEditing = !isEditing"
        >
          {{ isEditing ? 'Hide' : 'Edit' }}
        </button>

        <button
          type="button"
          class="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
    <div
      class="absolute relative z-10 flex flex-col md:flex-row gap-2 py-5 bg-gray-200 py-2 -mt-2 px-5 rounded-b border border-gray-800 shadow-md transition transition-all"
      :class="{
        'translate-y-0': isEditing,
        '-translate-y-full': !isEditing,
      }"
    >
      <div class="flex flex-col md:w-2/4 gap-2">
        <div class="flex gap-2 font-bold">
          <span class="w-24">Yay or Nay</span>
          <span class="w-24">Players</span>
          <span>Rank (1-10)</span>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="player in decodedData.players" class="flex items-center gap-2">
            <span class="w-24 flex justify-around items-center">
              <InputSwitch v-model="player.enabled" />
            </span>
            <span class="flex w-24">
              <InputText
                class="p-inputtext-sm w-full"
                type="text"
                v-model="player.name"
              />
            </span>
            <span class="flex w-20">
              <InputNumber
                input-class="p-inputtext-sm w-full"
                v-model="player.rank"
                :step="1"
                :min="1"
                :max="10"
              />
            </span>
            <span class="cursor-pointer flex">
              <FaIcon
                icon="times"
                class="text-lg bg-red-500 rounded py-1 px-2 text-white hover:bg-red-600"
              />
            </span>
          </div>
          <div class="flex gap-2 items-center ml-28">
            <InputText
              class="p-inputtext-sm w-28 ml-2"
              placeholder="Name"
              type="text"
              v-model="newPlayer.name"
              @keyup.enter="addPlayer(newPlayer)"
            />
            <Button
              label="Add"
              class="p-button-link px-2 w-20"
              @click="addPlayer(newPlayer)"
            />
          </div>
          <div class="flex justify-end text-lg items-center">
            Active Players:
            <span class="font-semibold ml-1">{{ activePlayers.length }}</span>
            <span class="text-sm">&nbsp; ({{ decodedData.players.length }} total)</span>
          </div>
        </div>
      </div>
      <Divider layout="vertical" />
      <div class="flex flex-col gap-2">
        <h2 class="text-lg font-bold">Options</h2>
        <div class="font-semibold flex flex-col gap-2">
          <div class="flex flex-col items-start gap-0">
            <span class="w-28 text-right">League Name:</span>
            <InputText class="p-inputtext-sm" v-model="decodedData.config.league" />
          </div>
          <div class="flex flex-col items-start gap-0">
            <span class="w-28"># of teams:</span>
            <InputNumber
              input-class="p-inputtext-sm w-20"
              :step="1"
              :min="2"
              :max="100"
              v-model="decodedData.config.teams"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="absolute flex flex-col py-5 gap-2 absolute mt-16 w-full left-0 top-0">
      <div class="w-11/12 md:w-10/12 md:w-2/3 mx-auto max-w-4xl">
        <TeamGenerated
          :players="decodedData.players"
          :team-count="decodedData.config.teams"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { filter } from 'lodash-es'

export interface Player {
  name: string
  rank?: number
  enabled?: boolean
}

export interface Config {
  league?: string
  teams: number
}

interface DecodedData {
  config: Config
  players: Player[]
}
</script>

<script lang="ts" setup>
const newPlayer = ref<Player>({ name: '', enabled: true })
const isEditing = ref(false)

let decodedData = reactive<DecodedData>({
  config: {
    teams: 2,
  },
  players: [],
})

const route = useRoute()
const router = useRouter()

try {
  const data: DecodedData = JSON.parse(atob(route.params.slug[0]))

  decodedData.config = { ...data.config }
  decodedData.players = [...data.players]
} catch (err) {
  console.log(err)
}

const save = () => {
  const encoded = btoa(JSON.stringify(decodedData))
  router.push(`/${encoded}`)
}

const activePlayers = computed(() => filter(decodedData.players, { enabled: true }))
const addPlayer = (player: Player) => {
  if (player.name === '') return

  decodedData.players = [...decodedData.players, { enabled: true, ...player }]
  newPlayer.value = { name: '' }
}
</script>
