<script lang="ts" setup>
import type { RouteParams, LocationQuery } from '#vue-router'
import type { DropdownItem } from '@nuxt/ui/dist/runtime/types'
import type { League, Player, Prisma } from '@prisma/client'
import type { Config } from '../interfaces'

interface AccountRouteParams extends RouteParams {
  account: string
}
interface AccountQuery extends LocationQuery {
  league: string
  isAddingNewLeague: string
}

const accountQuery = useAccount()
const leagueQuery = useLeague()
const route = useRoute()
const router = useRouter()
const { y: scrollY } = useScroll(process.client ? window : null)
const toast = useToast()

const { account: accountHash } = route.params as AccountRouteParams
const query = route.query as AccountQuery

const { data: account, isLoading, suspense: suspenseAccount } = accountQuery.get(accountHash)
const {
  data: leagueData,
  isLoading: isLoadingLeague,
  suspense: suspenseLeague,
} = leagueQuery.get(parseInt(query.league))
const { mutateAsync: createLeagueAsync } = leagueQuery.create()
const { mutateAsync: deleteLeagueAsync } = leagueQuery.del()
const { mutateAsync: updateLeagueAsync } = leagueQuery.update()
const { mutateAsync: duplicateLeagueAsync } = leagueQuery.duplicate()

const league = ref<typeof leagueData.value>()

watch(
  leagueData,
  (leagueData) => {
    if (leagueData) league.value = useCloned(leagueData).cloned.value
  },
  { immediate: true }
)
const isAddingNewLeague = ref(query.isAddingNewLeague === 'true')

onServerPrefetch(async () => {
  await suspenseAccount()
  if (query.league) await suspenseLeague()
})

const leagueActions: DropdownItem[] = [
  {
    label: 'Create new League',
    icon: 'i-ph-plus-square',
    click: () => {
      isAddingNewLeague.value = true
    },
  },
  {
    label: 'Duplicate League',
    icon: 'i-ph-copy',
    click: async () => {
      const { id } = await duplicateLeagueAsync(selectedLeague.value?.id!)

      toast.add({
        icon: 'i-heroicons-check-20-solid',
        title: `"${selectedLeague.value?.name}" league duplicated`,
      })

      router.push({ query: { league: id } })
    },
  },
  {
    label: 'Delete this league',
    iconClass: 'text-red-500',
    icon: 'i-ph-trash',
    click: () => (showConfirmDeleteLeague.value = true),
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
  const selectedLeague = account.value?.leagues.find((league) => league.id === parseInt(query.league))

  if (!selectedLeague) return account.value?.leagues[0]

  return selectedLeague
})

const saveStatus = ref(DataStatus.DEFAULT)
const isAddNewLeagueStatus = ref(DataStatus.DEFAULT)
const showConfirmDeleteLeague = ref(false)
const isEditing = ref(false)

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  scrollY.value = 0
}

const isSaving = computed(() => saveStatus.value === DataStatus.PENDING)

const save = async (league: League & { players: Player[] }) => {
  saveStatus.value = DataStatus.PENDING

  const { id } = await updateLeagueAsync({ id: league.id, updatedLeague: league })

  toast.add({
    icon: 'i-heroicons-check-20-solid',
    title: 'Saved',
  })

  isEditing.value = false
  saveStatus.value = DataStatus.SUCCESS

  scrollY.value = 0
}

const createLeague = async (league: Partial<League>) => {
  isAddNewLeagueStatus.value = DataStatus.PENDING

  const defaultConfig: Partial<Config> = {
    teamCount: 2,
    rules: {},
  }
  const { id } = await createLeagueAsync({
    ...league,
    accountId: account.value?.id,
    configuration: defaultConfig as Prisma.JsonValue,
  })
  router.push({ query: { league: id } })

  isAddingNewLeague.value = false
  isAddNewLeagueStatus.value = DataStatus.SUCCESS
}

const deleteLeague = async (league: Partial<League>) => {
  const { account, name } = await deleteLeagueAsync(league.id!)

  toast.add({
    icon: 'i-heroicons-check-20-solid',
    title: `${name} deleted`,
  })

  router.replace(`/${account?.hash}`)
}
</script>

<template>
  <div>
    <UiConfirmation v-model="showConfirmDeleteLeague" title="Delete League" @on-confirm="deleteLeague(selectedLeague!)">
      <template #content>
        Are you sure you want to remove
        <span class="font-semibold">"{{ selectedLeague?.name }}"</span>
        league?
      </template>
    </UiConfirmation>
    <UModal v-model="isAddingNewLeague" :ui="{ container: 'items-start' }" prevent-close>
      <FormKit type="form" :actions="false" #default="{ node }" @submit="createLeague">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Add a new league</h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isAddingNewLeague = false"
              />
            </div>
          </template>
          <FormKit type="text" name="name" placeholder="League name" />

          <template #footer>
            <div class="flex justify-end gap-4">
              <UButton color="indigo" variant="ghost" label="Cancel" @click="isAddingNewLeague = false" />
              <UButton
                :label="isAddNewLeagueStatus === DataStatus.PENDING ? '' : 'Add League'"
                @click="node.submit()"
                :loading="isAddNewLeagueStatus === DataStatus.PENDING"
              />
            </div>
          </template>
        </UCard>
      </FormKit>
    </UModal>
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
          <UButton @click="save(league!)" :disabled="isSaving" :loading="isSaving" :label="isSaving ? '' : 'Save'" />
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
        <LeagueEdit v-model="league" v-if="league" />
      </div>
      <div class="absolute absolute top-0 left-0 flex flex-col w-full py-5 mt-14 lg:mt-20">
        <div class="w-full px-2">
          <div v-if="isLoadingLeague" class="flex gap-4">
            <USkeleton class="h-40 flex-1" v-for="n in 3" />
          </div>
          <div v-else-if="!league">create a league</div>
          <TeamGenerated v-else :players="league?.players" @shuffled="onShuffled" />
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
