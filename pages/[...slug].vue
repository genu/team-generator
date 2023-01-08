<template>
  <div class="flex flex-col relative">
    <div
      class="sticky top-0 w-full z-40 h-16 md:h-20 bg-gray-800 px-4 md:px-5 flex items-center justify-between rounded-none md:rounded-b-md"
    >
      <h2
        class="text-base md:text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight capitalize"
      >
        {{ data.config.leagueName }}
      </h2>
      <div class="flex md:mt-0 md:ml-4 gap-4">
        <UiButton variant="secondary" @click="toggleEdit">
          {{ isEditing ? 'Hide' : 'Edit' }}
        </UiButton>
        <UiButton @click="save" :disabled="!unsavedChanges || isSaving">
          <FaIcon icon="spinner" v-if="isSaving" spin />
          <span v-else>Save</span>
        </UiButton>
      </div>
    </div>
    <div
      class="absolute relative gap-2 z-10 flex flex-col-reverse sm:flex-row pt-4 bg-gray-200 -mt-2 rounded-b border border-gray-800 shadow-md transition transition-all"
      :class="{
        'translate-y-0': isEditing,
        '-translate-y-full': !isEditing,
      }"
    >
      <div class="flex flex-col md:w-2/4 gap-2">
        <div class="table table-fixed border-spacing-0 px-2">
          <div class="table-row-group">
            <div class="table-row">
              <div class="table-cell w-48 align-middle py-2">
                <InputText
                  class="p-inputtext-sm w-44"
                  placeholder="Player Name"
                  type="text"
                  v-model="newPlayer.name"
                  @keyup.enter="addPlayer(newPlayer)"
                />
              </div>
              <div class="table-cell align-middle w-20">
                <InputNumber
                  input-class="p-inputtext-sm w-16"
                  v-model="newPlayer.rank"
                  placeholder="Rank"
                  :step="1"
                  :min="1"
                  :max="10"
                />
              </div>
              <div class="table-cell align-middle">
                <UiButton
                  class="w-20 px-2 rounded justify-around"
                  size="sm"
                  @click="addPlayer(newPlayer)"
                >
                  Add
                </UiButton>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <DataTable :value="data.players" responsiveLayout="scroll">
          <Column field="yes" header="Active?" body-class="text-center">
            <template #body="{ data: player }: { data: Player }">
              <InputSwitch v-model="player.yes" />
            </template>
          </Column>
          <Column field="name" header="Player">
            <template #body="{ data: player }: { data: Player }">
              <InputText
                class="capitalize p-inputtext-sm w-24"
                type="text"
                v-model="player.name"
              />
            </template>
          </Column>
          <Column field="rank" header="Rank (1-10)">
            <template #body="{ data: player }: { data: Player }">
              <InputNumber
                input-class="p-inputtext-sm flex w-16"
                v-model="player.rank"
                :step="1"
                :min="1"
                :max="10"
              />
            </template>
          </Column>
          <Column field="gk" header="Gk">
            <template #body="{ data: player }: { data: Player }">
              <Checkbox v-model="player.gk" :binary="true" />
            </template>
          </Column>
          <Column header="">
            <template #body="{ index }">
              <span class="" @click="removePlayer(index)">
                <FaIcon
                  icon="times"
                  class="text-lg bg-red-500 rounded py-1 px-2 text-white hover:bg-red-600"
                />
              </span>
            </template>
          </Column>
        </DataTable>

        <div class="flex flex-col gap-2">
          <Divider />
          <div class="flex justify-end text-lg items-center">
            Active Players:
            <span class="font-semibold ml-1">{{ activePlayers.length }}</span>
            <span class="text-sm">&nbsp; ({{ data.players.length }} total)</span>
          </div>
        </div>
      </div>
      <Divider layout="vertical" class="hidden md:block" />
      <Divider class="md:hidden" />
      <div class="flex flex-col gap-2 p-2">
        <h2 class="text-lg font-bold">Options</h2>
        <div class="font-semibold flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <span class="w-28 text-right text-gray-700">League Name:</span>
            <InputText class="p-inputtext-sm" v-model="data.config.leagueName" />
          </div>
          <div class="flex items-center gap-2">
            <span class="w-28 text-right text-gray-700"># of teams:</span>
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
      <div class="w-full px-2">
        <button
          type="button"
          class="relative block md:w-1/2 mx-auto my-5 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          v-if="data.players.length < 1"
          @click="isEditing = !isEditing"
        >
          <FaIcon icon="users-viewfinder" class="text-6xl text-gray-400" />
          <span class="mt-4 block text-sm font-medium text-gray-900">
            Add some players to the league
          </span>
        </button>
        <TeamGenerated
          :players="activePlayers"
          :team-count="data.config.teamCount"
          @shuffled="onShuffled"
          :snapshot="data.snapshot"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter, find, maxBy, orderBy } from 'lodash-es'
import { useScroll } from '@vueuse/core'

import { Player, Data, Snapshot } from '~/interfaces'

useHead({
  title: 'Team Generator',
})

const newPlayer = ref<Player>({ id: -1, name: '', yes: true, rank: 1 })
const isEditing = ref(false)
const unsavedChanges = ref(false)
const isSaving = ref(false)

const data = ref<Data>({
  config: {
    teamCount: 2,
  },
  players: [],
  snapshot: {
    teams: null,
    methodology: [],
  },
})

const route = useRoute()
const router = useRouter()
const { y: scrollY } = useScroll(process.client ? window : null)

const teamHash = route.params.slug[0]

if (teamHash) {
  try {
    const { data: loadedData } = await useFetch('/api/team', {
      query: { teamHash },
    })

    if (loadedData.value !== null) {
      data.value = loadedData.value?.data as unknown as Data
    }
  } catch (err) {
    console.log(err)
  }
}

const sortedPlayers = ref<Player[]>(
  orderBy(data.value.players, ['yes', 'rank'], ['desc', 'desc'])
)
const activePlayers = computed<Player[]>(() => filter(data.value.players, { yes: true }))

const getNextId = () => {
  const maxId = maxBy(data.value.players, 'id')

  if (maxId) return maxId.id + 1

  return 1
}

watch(data.value, () => {
  unsavedChanges.value = true
})

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  scrollY.value = 0
}

const sortPlayers = () => {
  const sorted = ref<Player[]>(
    orderBy(data.value.players, ['yes', 'rank'], ['desc', 'desc'])
  )

  sortedPlayers.value = sorted
}
// Actions
const save = async () => {
  isSaving.value = true

  const league = await $fetch('/api/team', {
    method: 'post',
    body: { team: teamHash, data: data.value },
  })

  unsavedChanges.value = false
  isEditing.value = false
  isSaving.value = false

  scrollY.value = 0

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
  data.value.snapshot = {}
}

const onShuffled = (snapshot: Snapshot) => {
  data.value.snapshot = snapshot
}
</script>
