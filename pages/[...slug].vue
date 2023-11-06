<template>
  <div class="relative flex flex-col">
    <div
      class="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-2 bg-gray-800 rounded-none lg:h-20 md:px-5 md:rounded-b-md"
    >
      <h2
        class="relative text-base font-bold text-white capitalize cursor-pointer md:text-2xl leading-7 sm:truncate sm:text-3xl sm:tracking-tight"
      >
        <span v-if="!data.config.leagueName">
          <span>Team Generator</span>
        </span>

        <UDropdown :items="items" v-else>
          <UButton
            :label="data.config.leagueName"
            variant="ghost"
            color="black"
            trailing-icon="i-heroicons-chevron-down-20-solid"
          />
        </UDropdown>
      </h2>
      <div class="flex md:mt-0 md:ml-4 gap-4">
        <UButton color="gray" @click="toggleEdit">{{ isEditing ? 'Hide' : 'Edit' }}</UButton>
        <UButton
          @click="save"
          :disabled="!unsavedChanges || isSaving"
          :loading="isSaving"
          :label="isSaving ? '' : 'Save'"
        />
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
      class="relative z-10 flex flex-col-reverse pt-4 -mt-2 border border-gray-700 rounded-b shadow-md bg-slate-100 lg:flex-row transition-all gap-2"
      :class="{
        'translate-y-0': isEditing,
        '-translate-y-full': !isEditing,
      }"
    >
      <div class="relative flex flex-col lg:w-2/4 gap-2">
        <UDivider label="Squad" />
        <div class="sticky z-50 flex items-center px-2 py-2 bg-gray-200 gap-2 top-16 lg:top-20">
          <UInput
            v-model="newPlayer.name"
            placeholder="Player Name"
            class="w-full"
            @keyup.enter="addPlayer(newPlayer)"
          />
          <UButton color="indigo" label="Add" @click="addPlayer(newPlayer)" class="justify-around w-32" />
        </div>

        <div v-if="data.players.length > 0">
          <UInput
            icon="i-heroicons-magnifying-glass-20-solid"
            class="mx-2"
            v-model="playerFilter"
            placeholder="Search players"
          />
          <UDivider />
          <UTable :rows="filteredPlayers" :columns="columns">
            <template #empty-state>
              <div class="text-sm text-center">
                No players found
                <span class="italic font-semibold">"{{ playerFilter }}"</span>
              </div>
            </template>
            <template #yes-header="p">
              <div class="flex flex-col">
                <span class="ml-1">Active?</span>
                <UButton
                  label="Reset"
                  @click="resetActiveState"
                  variant="link"
                  color="indigo"
                  :ui="{ padding: { md: 'p-1' } }"
                />
              </div>
            </template>
            <template #rank-header="p">
              <div class="flex flex-col">
                <span class="text-center">Rank</span>
                <span class="text-center">(1-10)</span>
              </div>
            </template>
            <template #yes-data="{ row }">
              <UToggle v-model="row.yes" color="indigo" />
            </template>
            <template #name-data="{ row }">
              <UInput v-model="row.name" :disabled="playerFilter !== ''" size="sm" />
            </template>
            <template #rank-data="{ row }">
              <UInput v-model="row.rank" class="w-16" type="number" size="sm" />
            </template>
            <template #gk-data="{ row }">
              <UCheckbox v-model="row.gk" name="notifications" />
            </template>
            <template #actions-data="{ index }">
              <UButton icon="i-heroicons-trash" color="red" variant="outline" @click="removePlayer(index)" size="sm" />
            </template>
          </UTable>
        </div>

        <div class="flex flex-col gap-2" v-if="data.players.length > 0">
          <UDivider />
          <div class="flex items-center justify-end text-lg">
            Active Players:
            <span class="ml-1 font-semibold">{{ activePlayers.length }}</span>
            <span class="text-sm">&nbsp; ({{ data.players.length }} total)</span>
          </div>
        </div>
      </div>
      <UDivider orientation="vertical" class="w-5" />
      <div class="flex flex-col flex-1 p-2 gap-2">
        <h2 class="font-bold">Options</h2>
        <div class="flex flex-col font-semibold gap-2">
          <div class="flex items-center gap-2">
            <span class="text-sm text-right text-gray-700 w-28">League Name:</span>
            <UInput v-model="data.config.leagueName" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-right text-gray-700 w-28"># of teams:</span>
            <UInput type="number" v-model="data.config.teamCount" class="w-20" />
          </div>
          <UAccordion :items="rulesAccordian" color="indigo" variant="soft">
            <template #rules>
              <div class="flex flex-col px-2 gap-3">
                <UCheckbox v-model="data.config.rules.goaliesFirst" label="Choose goalies first" />
                <UCheckbox
                  disabled
                  v-model="data.config.rules.noBestGolieAndPlayer"
                  label="Best goalie cannot be on same team with best player"
                >
                  <template #label>
                    Best goalie cannot be on same team with best player
                    <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
                  </template>
                </UCheckbox>
                <UCheckbox disabled v-model="data.config.rules.noBestGolieAndPlayer">
                  <template #label>
                    Keep goalies
                    <small class="bg-gray-400 px-1 py-0.5 text-white rounded font-bold">soon</small>
                  </template>
                </UCheckbox>
                <UCheckbox
                  class="hidden"
                  label="Stefan mode"
                  v-model="data.config.rules.stefanMode"
                  help="Stefan's team has all of the best players"
                />
                <UCheckbox
                  class="hidden"
                  label="Beni mode"
                  v-model="data.config.rules.beniMode"
                  help="Every player on the same team as Beni drops in rank by 1 point"
                />
              </div>
            </template>
          </UAccordion>
        </div>
      </div>
    </div>
    <div class="absolute absolute top-0 left-0 flex flex-col w-full py-5 mt-14 lg:mt-20">
      <div class="w-full px-2">
        <button
          type="button"
          class="relative block p-12 mx-auto my-5 text-center border-2 border-gray-300 border-dashed rounded-lg lg:w-1/2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          v-if="data.players.length < 1"
          @click="isEditing = !isEditing"
        >
          <UIcon name="i-fa6-solid-users-viewfinder" class="text-6xl text-gray-400" />
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

import type { Player, Data, Snapshot } from '~/interfaces'
import type { DropdownItem } from '@nuxt/ui/dist/runtime/types'

const newPlayer = ref<Player>({ id: -1, name: '', yes: true, rank: 1 })
const isEditing = ref(false)
const unsavedChanges = ref(false)
const isSaving = ref(false)

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

const columns = [
  {
    key: 'yes',
  },
  {
    key: 'name',
    label: 'Player',
  },
  {
    key: 'rank',
  },
  {
    key: 'gk',
    label: 'Gk',
  },
  {
    key: 'actions',
  },
]
const route = useRoute()
const router = useRouter()
const { y: scrollY } = useScroll(process.client ? window : null)
const items: DropdownItem[][] = [
  [
    {
      label: 'New League',
      to: '/',
      replace: true,
    },
  ],
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

const playerFilter = ref('')
const toggleEdit = () => {
  isEditing.value = !isEditing.value
  scrollY.value = 0
}

const filteredPlayers = computed(() => {
  if (!playerFilter.value) return data.value.players

  return filter(data.value.players, (player) => {
    return player.name.toLowerCase().includes(playerFilter.value.toLowerCase())
  })
})

const rulesAccordian = [
  {
    label: 'Rules',
    icon: 'i-heroicons-cog-6-tooth',
    slot: 'rules',
  },
]
const toast = useToast()

// Actions
const save = async () => {
  isSaving.value = true

  toast.add({
    icon: 'i-heroicons-check-20-solid',
    title: 'Saved',
  })
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

const resetActiveState = () => {
  data.value.players.forEach((player) => {
    player.yes = false
  })
}
</script>
