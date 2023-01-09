<template>
  <div class="flex flex-col relative">
    <div
      class="sticky top-0 w-full z-40 h-16 lg:h-20 bg-gray-800 px-2 md:px-5 flex items-center justify-between rounded-none md:rounded-b-md"
    >
      <h2
        class="relative items-center flex gap-2 text-base md:text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight capitalize cursor-pointer"
        @click="toggleLeagueMenu"
        :class="{ invisible: !data.config.leagueName }"
      >
        {{ data.config.leagueName }}
        <FaIcon icon="angle-down" />
        <Menu ref="leagueMenu" :model="items" popup />
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
      class="absolute relative z-10 flex flex-col-reverse lg:flex-row pt-4 bg-gray-200 -mt-2 rounded-b border border-gray-800 shadow-md transition transition-all"
      :class="{
        'translate-y-0': isEditing,
        '-translate-y-full': !isEditing,
      }"
    >
      <div class="relative flex flex-col lg:w-2/4 gap-2">
        <div class="flex gap-2 items-center absolute sticky top-16 lg:top-20 z-50 bg-gray-200 py-2 px-2">
          <InputText
            class="p-inputtext-sm w-full"
            placeholder="Player Name"
            type="text"
            v-model="newPlayer.name"
            @keyup.enter="addPlayer(newPlayer)"
          />
          <UiButton class="w-48 px-2 rounded justify-around" size="sm" @click="addPlayer(newPlayer)">Add</UiButton>
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
            <span class="p-input-icon-left flex items-center justify-start w-full">
              <i class="pi pi-search" />
              <InputText
                v-model="rosterFilters['global'].value"
                class="text-base py-1 w-full pl-8"
                placeholder="Filter"
              />
            </span>
          </template>
          <template #empty>No players found.</template>
          <Column field="yes" header="Active?" body-class="text-center">
            <template #body="{ data: player }: { data: Player }">
              <InputSwitch v-model="player.yes" />
            </template>
          </Column>
          <Column field="name" header="Player">
            <template #body="{ data: player }: { data: Player }">
              <InputText class="capitalize p-inputtext-sm w-24" type="text" v-model="player.name" />
            </template>
          </Column>
          <Column field="rank" header="Rank (1-10)">
            <template #body="{ data: player }: { data: Player }">
              <InputNumber input-class="p-inputtext-sm flex w-16" v-model="player.rank" :step="1" :min="1" :max="10" />
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
                <FaIcon icon="times" class="text-lg bg-red-500 rounded py-1 px-2 text-white hover:bg-red-600" />
              </span>
            </template>
          </Column>
        </DataTable>

        <div class="flex flex-col gap-2" v-if="data.players.length > 0">
          <Divider />
          <div class="flex justify-end text-lg items-center">
            Active Players:
            <span class="font-semibold ml-1">{{ activePlayers.length }}</span>
            <span class="text-sm">&nbsp; ({{ data.players.length }} total)</span>
          </div>
        </div>
      </div>
      <Divider layout="vertical" class="hidden lg:block" />
      <Divider class="lg:hidden" />
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
          <div class="flex items-center gap-2">
            <span class="w-28 text-right text-gray-700">Rules:</span>
          </div>
          <div class="flex flex-col ml-28 gap-1">
            <div class="flex gap-2 items-center">
              <Checkbox input-id="goaliesFirst" v-model="data.config.rules.goaliesFirst" :binary="true" />
              <label for="goaliesFirst" class="font-normal text-sm cursor-pointer">Choose goalies first</label>
            </div>
            <div class="flex gap-2 items-center hidden">
              <Checkbox
                input-id="noBestGolieAndPlayer"
                v-model="data.config.rules.noBestGolieAndPlayer"
                :binary="true"
              />
              <label for="noBestGolieAndPlayer" class="font-normal text-sm cursor-pointer">
                Best goalie cannot be on same team with best player
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute flex flex-col py-5 absolute mt-14 lg:mt-16 w-full left-0 top-0">
      <div class="w-full px-2">
        <button
          type="button"
          class="relative block lg:w-1/2 mx-auto my-5 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          v-if="data.players.length < 1"
          @click="isEditing = !isEditing"
        >
          <FaIcon icon="users-viewfinder" class="text-6xl text-gray-400" />
          <span class="mt-4 block text-sm font-medium text-gray-900">Add some players to the league</span>
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
import { filter, find, maxBy, orderBy } from 'lodash-es'
import { useScroll } from '@vueuse/core'
import { MenuItem } from 'primevue/menuitem'
import { FilterMatchMode } from 'primevue/api'

import { Player, Data, Snapshot } from '~/interfaces'

const newPlayer = ref<Player>({ id: -1, name: '', yes: true, rank: 1 })
const isEditing = ref(false)
const unsavedChanges = ref(false)
const isSaving = ref(false)
const leagueMenu = ref<any>(null)
const rosterFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
</script>
