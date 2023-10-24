<template>
  <div class="relative flex flex-col">
    <div
      class="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-2 bg-gray-800 rounded-none lg:h-20 md:px-5 md:rounded-b-md"
    >
      <h2
        class="relative text-base font-bold text-white capitalize cursor-pointer md:text-2xl leading-7 sm:truncate sm:text-3xl sm:tracking-tight"
        @click="toggleLeagueMenu"
      >
        <span v-if="!data.config.leagueName">
          <span>Team Generator</span>
        </span>
        <div class="flex items-center gap-2" v-else>
          <span>{{ data.config.leagueName }}</span>
          <Icon name="fa6-solid:angle-down" />
          <Menu ref="leagueMenu" :model="items" popup />
        </div>
      </h2>
      <div class="flex md:mt-0 md:ml-4 gap-4">
        <Button severity="secondary" @click="toggleEdit">
          {{ isEditing ? 'Hide' : 'Edit' }}
        </Button>
        <Button @click="save" :disabled="!unsavedChanges || isSaving">
          <Icon name="fa6-solid:spinner" v-if="isSaving" spin />
          <span v-else>Save</span>
        </Button>
      </div>
    </div>
    <div
      class="absolute z-10 w-full h-screen pointer-events-none transition-all lg:w-full"
      :class="{
        'bg-black/30 backdrop-blur-sm': isEditing,
        'bg-black/0': !isEditing,
      }"
    ></div>
    <div
      class="absolute relative z-10 flex flex-col-reverse pt-4 -mt-2 bg-gray-200 border border-gray-800 rounded-b shadow-md lg:flex-row transition transition-all"
      :class="{
        'translate-y-0': isEditing,
        '-translate-y-full': !isEditing,
      }"
    >
      <div class="relative flex flex-col lg:w-2/4 gap-2">
        <div class="absolute sticky z-50 flex items-center px-2 py-2 bg-gray-200 gap-2 top-16 lg:top-20">
          <InputText
            class="w-full p-inputtext-sm"
            placeholder="Player Name"
            type="text"
            v-model="newPlayer.name"
            @keyup.enter="addPlayer(newPlayer)"
          />
          <Button class="justify-around w-48 px-2 rounded" size="small" @click="addPlayer(newPlayer)">Add</Button>
        </div>
        <Divider />
        <DataTable
          :value="data.players"
          responsiveLayout="scroll"
          v-if="data.players.length > 0"
          v-model:filters="rosterFilters"
          :global-filter-fields="['name']"
        >
          <template #header>
            <span class="flex items-center justify-start w-full p-input-icon-left">
              <Icon name="fa6-solid:magnifying-glass" class="absolute ml-2 text-gray-500" />
              <InputText
                v-model="rosterFilters['global'].value"
                class="w-full py-1 pl-8 pr-8 text-base"
                placeholder="Filter"
              />
              <Icon
                name="fa6-solid:xmark"
                v-if="rosterFilters['global'].value"
                @click="rosterFilters['global'].value = ''"
                class="absolute text-gray-400 cursor-pointer right-2"
              />
            </span>
          </template>
          <template #empty>
            <div class="text-sm text-center">
              No players found
              <span class="italic font-semibold">"{{ rosterFilters['global'].value }}"</span>
            </div>
          </template>
          <Column field="yes" body-class="text-center" class="h-12">
            <template #header>
              <div class="flex flex-col">
                <span>Active?</span>
                <span class="text-xs text-blue-700 cursor-pointer hover:text-blue-900" @click="resetActiveState">
                  Reset
                </span>
              </div>
            </template>
            <template #body="{ data: player }: { data: Player }">
              <InputSwitch v-model="player.yes" />
            </template>
          </Column>
          <Column field="name" header="Player" class="h-12">
            <template #body="{ data: player }: { data: Player }">
              <InputText
                :disabled="rosterFilters['global'].value !== ''"
                class="w-24 capitalize p-inputtext-sm"
                type="text"
                v-model="player.name"
              />
            </template>
          </Column>
          <Column field="rank" header="Rank (1-10)" class="h-12">
            <template #body="{ data: player }: { data: Player }">
              <InputNumber input-class="flex w-16 p-inputtext-sm" v-model="player.rank" :step="1" :min="1" :max="10" />
            </template>
          </Column>
          <Column field="gk" header="Gk" class="h-12">
            <template #body="{ data: player }: { data: Player }">
              <Checkbox v-model="player.gk" :binary="true" />
            </template>
          </Column>
          <Column header="">
            <template #body="{ index }">
              <span class="" @click="removePlayer(index)">
                <Icon name="fa6-solid:times" class="px-2 py-1 text-lg text-white bg-red-500 rounded hover:bg-red-600" />
              </span>
            </template>
          </Column>
        </DataTable>

        <div class="flex flex-col gap-2" v-if="data.players.length > 0">
          <Divider />
          <div class="flex items-center justify-end text-lg">
            Active Players:
            <span class="ml-1 font-semibold">{{ activePlayers.length }}</span>
            <span class="text-sm">&nbsp; ({{ data.players.length }} total)</span>
          </div>
        </div>
      </div>
      <Divider layout="vertical" class="hidden lg:block" />
      <Divider class="lg:hidden" />
      <div class="flex flex-col p-2 gap-2">
        <h2 class="text-lg font-bold">Options</h2>
        <div class="flex flex-col font-semibold gap-2">
          <div class="flex items-center gap-2">
            <span class="text-right text-gray-700 w-28">League Name:</span>
            <InputText class="p-inputtext-sm" v-model="data.config.leagueName" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-right text-gray-700 w-28"># of teams:</span>
            <InputNumber
              input-class="w-20 p-inputtext-sm"
              :step="1"
              :min="2"
              :max="100"
              v-model="data.config.teamCount"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-right text-gray-700 w-28">Rules:</span>
          </div>
          <div class="flex flex-col ml-28 gap-1">
            <div class="flex items-center gap-2">
              <Checkbox input-id="goaliesFirst" v-model="data.config.rules.goaliesFirst" :binary="true" />
              <label for="goaliesFirst" class="text-sm font-normal cursor-pointer">Choose goalies first</label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox
                input-id="noBestGolieAndPlayer"
                disabled
                v-model="data.config.rules.noBestGolieAndPlayer"
                :binary="true"
              />
              <label for="noBestGolieAndPlayer" class="text-sm font-normal cursor-pointer">
                Best goalie cannot be on same team with best player
                <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
              </label>
            </div>
            <div class="flex items-center gap-2">
              <Checkbox
                input-id="noBestGolieAndPlayer"
                disabled
                v-model="data.config.rules.noBestGolieAndPlayer"
                :binary="true"
              />
              <label for="noBestGolieAndPlayer" class="text-sm font-normal cursor-pointer">
                Keep goalies
                <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
              </label>
            </div>
            <div class="flex items-start hidden gap-2">
              <Checkbox input-id="stefanMode" v-model="data.config.rules.stefanMode" :binary="true" />
              <label for="stefanMode" class="flex flex-col text-sm font-normal cursor-pointe">
                Stefan mode
                <small>Stefan's team has all of the best players</small>
              </label>
            </div>
            <div class="flex items-start hidden gap-2">
              <Checkbox input-id="beniMode" v-model="data.config.rules.beniMode" :binary="true" />
              <label for="stefanMode" class="flex flex-col text-sm font-normal cursor-pointe">
                Beni Mode

                <small>
                  Every player on the same team as
                  <strong>Beni</strong>
                  drops in rank by 1 point
                </small>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute absolute top-0 left-0 flex flex-col w-full py-5 mt-14 lg:mt-16">
      <div class="w-full px-2">
        <button
          type="button"
          class="relative block p-12 mx-auto my-5 text-center border-2 border-gray-300 border-dashed rounded-lg lg:w-1/2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          v-if="data.players.length < 1"
          @click="isEditing = !isEditing"
        >
          <Icon name="fa6-solid:users-viewfinder" class="text-6xl text-gray-400" />
          <span class="block mt-4 text-sm font-medium text-gray-900">Add some players to the league</span>
        </button>
        <TeamGenerated
          :players="activePlayers"
          :team-count="data.config.teamCount"
          @shuffled="onShuffled"
          :snapshot="data.snapshot"
          :rules="data.config.rules"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter, find, maxBy } from 'lodash-es'
import { useScroll } from '@vueuse/core'
import type { MenuItem } from 'primevue/menuitem'
import { FilterMatchMode } from 'primevue/api'

import type { Player, Data, Snapshot } from '~/interfaces'

const newPlayer = ref<Player>({ id: -1, name: '', yes: true, rank: 1 })
const isEditing = ref(false)
const unsavedChanges = ref(false)
const isSaving = ref(false)
const leagueMenu = ref<any>(null)
const rosterFilters = ref({
  global: { value: '', matchMode: FilterMatchMode.CONTAINS },
})

const data = ref<Data>({
  config: {
    teamCount: 2,
    rules: {
      goaliesFirst: false,
      noBestGolieAndPlayer: false,
    },
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
const items: MenuItem[] = [
  {
    label: 'New League',
    icon: 'pi pi-plus',
    command() {
      router.push('/')
    },
  },
]

useHead({
  title: () => {
    return data.value.config?.leagueName || 'Team Generator'
  },
})

const teamHash = route.params.slug[0]

if (teamHash) {
  try {
    const { data: loadedData } = await useFetch('/api/team', {
      query: { teamHash },
    })

    if (loadedData.value !== null) {
      const savedData = loadedData.value.data as unknown as Data

      data.value.config.leagueName = savedData.config.leagueName
      data.value.config.teamCount = savedData.config.teamCount
      data.value.config.rules.goaliesFirst = savedData.config.rules?.goaliesFirst || false
      data.value.config.rules.noBestGolieAndPlayer = savedData.config.rules?.noBestGolieAndPlayer || false

      data.value.players = [...savedData.players]
      data.value.snapshot = savedData.snapshot
    }
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

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  scrollY.value = 0
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

  player.name = player.name.trim()
  data.value.players = [{ ...player, id: getNextId() }, ...data.value.players]

  newPlayer.value = { id: -1, name: '', yes: true, rank: 1 }
}

const removePlayer = (index: number) => {
  data.value.players.splice(index, 1)
  data.value.snapshot = {}
}

const onShuffled = (snapshot: Snapshot) => {
  data.value.snapshot = snapshot
}

const toggleLeagueMenu = () => {
  leagueMenu.value.toggle(event)
}

const resetActiveState = () => {
  data.value.players.forEach((player) => {
    player.yes = false
  })
}
</script>
