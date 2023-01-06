<template>
  <div class="flex flex-col">
    <div
      class="z-40 h-16 md:h-20 bg-gray-800 px-4 md:px-5 flex items-center justify-between rounded-none md:rounded-b-md"
    >
      <h2
        class="text-base md:text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight capitalize"
      >
        {{ data.config.leagueName }}
      </h2>
      <div class="flex md:mt-0 md:ml-4 gap-4">
        <UiButton variant="secondary" @click="isEditing = !isEditing">
          {{ isEditing ? 'Hide' : 'Edit' }}
        </UiButton>
        <UiButton @click="save" :disabled="!unsavedChanges">Save</UiButton>
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
          <span class="w-48">Players</span>
          <span class="w-28">Rank (1-10)</span>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="(player, index) in data.players" class="flex items-center gap-2">
            <span class="w-24 flex justify-around items-center">
              <InputSwitch v-model="player.yes" />
            </span>
            <span class="flex w-48">
              <InputText
                class="p-inputtext-sm w-full capitalize"
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
            <span class="cursor-pointer flex" @click="removePlayer(index)">
              <FaIcon
                icon="times"
                class="text-lg bg-red-500 rounded py-1 px-2 text-white hover:bg-red-600"
              />
            </span>
          </div>
          <Divider />
          <div class="flex gap-2 items-center ml-2">
            <InputText
              class="p-inputtext-sm ml-24 w-48"
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
            <span class="text-sm">&nbsp; ({{ data.players.length }} total)</span>
          </div>
        </div>
      </div>
      <Divider layout="vertical" />
      <div class="flex flex-col gap-2">
        <h2 class="text-lg font-bold">Options</h2>
        <div class="font-semibold flex flex-col gap-2">
          <div class="flex flex-col items-start gap-0">
            <span class="w-28 text-right">League Name:</span>
            <InputText class="p-inputtext-sm" v-model="data.config.leagueName" />
          </div>
          <div class="flex flex-col items-start gap-0">
            <span class="w-28"># of teams:</span>
            <InputNumber
              input-class="p-inputtext-sm w-20"
              :step="1"
              :min="2"
              :max="100"
              v-model="data.config.teamCount"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="absolute flex flex-col py-5 absolute mt-14 md:mt-16 w-full left-0 top-0">
      <div class="w-full px-2 md:w-10/12 md:w-2/3 md:mx-auto md:max-w-4xl">
        <TeamGenerated
          :players="activePlayers"
          :team-count="data.config.teamCount"
          @shuffled="onShuffled"
          :previously-generated="data.snapshot"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter, find, maxBy } from 'lodash-es'

import { Player, Data } from '~/interfaces'

const newPlayer = ref<Player>({ id: -1, name: '', yes: true, rank: 1 })
const isEditing = ref(false)
const unsavedChanges = ref(false)

const data = ref<Data>({
  config: {
    teamCount: 2,
  },
  players: [],
  snapshot: null,
})

const route = useRoute()
const router = useRouter()

const teamHash = route.params.slug[0]
if (teamHash) {
  try {
    const { data: loadedData, error } = await useFetch('/api/team', {
      query: { teamHash },
    })

    data.value = loadedData.value?.data as unknown as Data
  } catch (err) {
    console.log(err)
  }
}

const activePlayers = computed<Player[]>(() => filter(data.value.players, { yes: true }))

const getNextId = () => {
  const maxId = maxBy(data.value.players, 'id')

  if (maxId) return maxId.id + 1

  return 1
}

watch(data.value, () => {
  unsavedChanges.value = true
})
// Actions
const save = async () => {
  const league = await $fetch('/api/team', {
    method: 'post',
    body: { team: teamHash, data: data.value },
  })

  unsavedChanges.value = false
  router.push(`/${league?.hash}`)
}

const addPlayer = (player: Player) => {
  // No empty strings
  if (player.name === '') return

  // No existing players
  if (find(data.value.players, { n: player.name })) return

  data.value.players = [...data.value.players, { ...player, id: getNextId() }]

  newPlayer.value = { id: -1, name: '', yes: true, rank: 1 }
}

const removePlayer = (index: number) => {
  data.value.players.splice(index, 1)
  data.value.snapshot = null
}

const onShuffled = (teams: any) => {
  data.value.snapshot = teams
}
</script>
