<script lang="ts" setup>
import type { RouteParams, LocationQuery } from '#vue-router'
import type { DropdownItem } from '@nuxt/ui/dist/runtime/types'

interface AccountRouteParams extends RouteParams {
  account: string
}
interface AccountQuery extends LocationQuery {
  league: string
}

const accountQuery = useAccount()
const leagueQuery = useLeague()
const route = useRoute()
const { y: scrollY } = useScroll(process.client ? window : null)
const toast = useToast()

const { account: accountHash } = route.params as AccountRouteParams
const { league: leagueId } = route.query as AccountQuery

const { data: account, isLoading, suspense: suspenseAccount } = accountQuery.get(accountHash)
const { data: league, isLoading: isLoadingLeague, suspense: suspenseLeague } = leagueQuery.get(parseInt(leagueId))

onServerPrefetch(async () => {
  await suspenseAccount()
  await suspenseLeague()
})

const leagueActions: DropdownItem[] = [
  {
    label: 'Create new League',
    icon: 'i-ph-plus-square',
    click: () => {
      console.log('create a league')
    },
  },
  {
    label: 'Duplicate League',
    icon: 'i-ph-copy',
    click: () => {
      console.log('duplicate a league')
    },
  },
  {
    label: 'Delete this league',
    iconClass: 'text-red-500',
    icon: 'i-ph-trash',
  },
]

const leaguesDropdown = computed<DropdownItem[][]>(() => {
  const mappedLeagues: DropdownItem[] =
    account.value?.leagues.map((league) => ({
      label: league.name!,
      to: `${accountHash}?league=${league.id}`,
    })) || []

  return [[{ label: 'Your Leagues', slot: 'leagues-header', disabled: true }], mappedLeagues, leagueActions]
})

const selectedLeague = computed(() => {
  const selectedLeague = account.value?.leagues.find((league) => league.id === parseInt(leagueId))

  if (!selectedLeague) return account.value?.leagues[0]

  return selectedLeague
})

const saveStatus = ref(DataStatus.DEFAULT)

const isEditing = ref(false)

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  scrollY.value = 0
}

const isSaving = computed(() => saveStatus.value === DataStatus.PENDING)
const save = async () => {
  saveStatus.value = DataStatus.PENDING

  toast.add({
    icon: 'i-heroicons-check-20-solid',
    title: 'Saved',
  })
  // const league = await $fetch('/api/team', {
  //   method: 'post',
  //   body: { team: hash, data: data.value },
  // })

  isEditing.value = false
  // saveStatus.value = DataStatus.SUCCESS

  scrollY.value = 0
}
</script>

<template>
  <div>
    <div v-if="!account || isLoading" class="flex flex-col gap-4 my-5">
      <USkeleton class="h-20" />
      <div class="flex gap-3">
        <USkeleton class="h-40 flex-1" v-for="n in 3" />
      </div>
    </div>
    <div class="relative flex flex-col" v-else>
      <div
        class="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-2 bg-gray-800 rounded-none lg:h-20 md:px-5 md:rounded-b-md"
      >
        <h2
          class="relative text-base font-bold text-white capitalize cursor-pointer md:text-2xl leading-7 sm:truncate sm:text-3xl sm:tracking-tight"
        >
          <UDropdown :items="leaguesDropdown" :ui="{ item: { disabled: 'cursor-text select-text' } }">
            <UButton
              :label="selectedLeague?.name || 'Select League'"
              variant="ghost"
              color="black"
              trailing-icon="i-heroicons-chevron-down-20-solid"
            />
            <template #leagues-header="{ item }">
              <div class="text-left">
                <p>Your leagues</p>
              </div>
            </template>
          </UDropdown>
        </h2>
        <div class="flex md:mt-0 md:ml-4 gap-4">
          <UButton color="gray" @click="toggleEdit">{{ isEditing ? 'Hide' : 'Edit' }}</UButton>
          <UButton @click="save" :disabled="isSaving" :loading="isSaving" :label="isSaving ? '' : 'Save'" />
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
        class="relative z-10 flex flex-col-reverse pt-4 -mt-2 border border-gray-700 rounded-b shadow-md bg-slate-100 dark:bg-slate-900 lg:flex-row transition-all gap-2"
        :class="{
          'translate-y-0': isEditing,
          '-translate-y-full': !isEditing,
        }"
      >
        <LeagueEdit :players="league.players" v-if="league" />
      </div>
      <div class="absolute absolute top-0 left-0 flex flex-col w-full py-5 mt-14 lg:mt-20">
        <div class="w-full px-2">
          <div v-if="!selectedLeague"></div>
          <League :name="selectedLeague.name!" v-else />
          <!-- <button
              type="button"
              class="relative block p-12 mx-auto my-5 text-center border-2 border-gray-300 border-dashed rounded-lg lg:w-1/2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              v-if="data.players.length < 1"
              @click="isEditing = !isEditing"
            >
              <UIcon name="i-fa6-solid-users-viewfinder" class="text-6xl text-gray-400" />
              <span class="block mt-4 text-sm font-medium text-gray-900">Add some players to the league</span>
            </button> -->
          <!-- <TeamGenerated
              :players="activePlayers"
              :team-count="data.config.teamCount"
              @shuffled="onShuffled"
              :snapshot="data.snapshot"
              :rules="data.config.rules"
            /> -->
        </div>
      </div>
    </div>
  </div>
</template>