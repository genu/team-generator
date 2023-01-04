<template>
  <div class="flex flex-col">
    <div
      class="z-10 bg-gray-800 py-10 px-5 md:flex md:items-center md:justify-between rounded-md"
    >
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Back End Developer
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <button
          type="button"
          class="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Edit player list
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
      class="flex gap-2 py-5 bg-gray-200 -mt-2 py-2 px-5 z-0 rounjded-b border border-gray-800 shadow-md"
    >
      <div class="flex flex-col w-2/4 gap-2">
        <div class="flex gap-2 font-bold">
          <span class="w-16"></span>
          <span class="w-28">Players</span>
          <span>Rank (1-5)</span>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="(player, index) in decodedData.players" class="flex gap-2">
            <span class="w-16 flex justify-around items-center">
              <InputSwitch v-model="player.enabled" />
            </span>
            <InputText class="p-inputtext-sm w-28" type="text" v-model="player.name" />
            <InputNumber
              input-class="p-inputtext-sm w-20"
              v-model="player.rank"
              :step="1"
              :min="1"
              :max="5"
            />
          </div>
          <Divider class="text-sm" align="right">Add Player</Divider>
          <div class="flex gap-2 items-center">
            <span class="w-16"></span>
            <InputText
              class="p-inputtext-sm w-28"
              placeholder="Name"
              type="text"
              v-model="newPlayer.name"
            />
            <InputNumber
              input-class="p-inputtext-sm w-20"
              placeholder="Rank"
              v-model="newPlayer.rank"
            />
            <Button
              label="Add"
              class="p-button-link px-2"
              @click="addPlayer(newPlayer)"
            />
          </div>
        </div>
      </div>
      <Divider layout="vertical" />
      <div class="flex flex-col gap-2">
        <h2 class="text-lg font-bold">Options</h2>
        <div class="font-semibold flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="w-28 text-right">League Name:</span>
            <InputText class="p-inputtext-sm" v-model="decodedData.config.league" />
          </div>
          <div class="flex items-center gap-2">
            <span class="w-28 text-right"># of Teams:</span>
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
    <div class="flex flex-col py-5 gap-2">
      <input type="text" placeholder="League name" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { decode } from 'punycode'

interface Player {
  name: string
  rank?: number
  enabled?: boolean
}

interface Config {
  league?: string
  teams: number
}

interface DecodedData {
  config: Config
  players: Player[]
}
const newPlayer = ref<Player>({ name: '', enabled: true })

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
  console.log(decodedData)
  router.push(`/${encoded}`)
}

const addPlayer = (player: Player) => {
  decodedData.players = [...decodedData.players, { enabled: true, ...player }]
  newPlayer.value = { name: '' }
}
</script>
