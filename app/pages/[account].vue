<script lang="ts" setup>
  import { useRouteQuery } from "@vueuse/router"
  import type { DropdownMenuItem } from "@nuxt/ui"
  import { DialogCreateLeague, LeagueEdit } from "#components"
  import { SnapshotPlayerSchema, SnapshotSchem, type Snapshot } from "#shared/schemas"
  import type { LeagueEditForm } from "#shared/schemas/forms"

  const { confirm } = useDialog()
  const overlay = useOverlay()
  const leagueActions = useLeagueActions()
  const accountHash = useRouteParams("account", undefined, { transform: String })
  const leagueId = useRouteQuery("league", undefined, { transform: (value) => (value ? parseInt(value) : undefined) })

  const { y: scrollY } = useScroll(import.meta.client ? window : null)
  const toast = useToast()

  const createLeagueDialog = overlay.create(DialogCreateLeague)
  const editLeagueDrawer = overlay.create(LeagueEdit)

  const leagueFormData = ref<LeagueEditForm>()
  const localLeagueFormData = ref<LeagueEditForm | null>(null)

  const {
    data: account,
    isLoading,
    suspense: suspenseAccount,
  } = useFindUniqueAccount({
    where: { hash: accountHash.value },
    include: { leagues: { select: { id: true, name: true } } },
  })

  const {
    data: league,
    isLoading: isLoadingLeague,
    suspense: suspenseLeague,
  } = useFindUniqueLeague(
    computed(() => ({
      where: { id: leagueId.value },
      include: { snapshots: true, players: { orderBy: { id: "asc" } } },
    })),
    {
      enabled: () => leagueId.value !== undefined,
    },
  )

  const { mutateAsync: deleteLeagueAsync } = useDeleteLeague()
  const { mutateAsync: updateLeagueAsync, isPending: isUpdatingLeague } = useUpdateLeague()
  const { mutateAsync: duplicateLeagueAsync } = leagueActions.duplicate()

  const latestUnsavedSnapshot = ref<Snapshot>()

  onServerPrefetch(async () => {
    await suspenseAccount()
    if (leagueId.value) await suspenseLeague()
  })

  const leagueMenu: DropdownMenuItem[] = [
    {
      label: "Your Leagues",
      type: "label",
    },
    {
      label: "Create new League",
      icon: "i-ph-plus-square",
      onSelect: async () => {
        if (!account.value) return

        const res = createLeagueDialog.open({ accountId: account.value.id })
        const leagueId = await res.result

        await navigateTo(`/${account.value.hash}?league=${leagueId}`)
      },
    },
    {
      label: "Duplicate League",
      icon: "i-ph-copy",
      onSelect: async () => {
        if (!league.value) return

        const { id } = await duplicateLeagueAsync(league.value.id!)
        toast.add({
          icon: "i-heroicons-check-20-solid",
          title: `"${league.value.name}" league duplicated`,
        })

        leagueId.value = id
      },
    },
    {
      label: "Delete this league",
      slot: "delete-league",
      onSelect: async () => {
        confirm({
          title: "Delete League",
          description: `Are you sure you want to remove "${league.value?.name}" league?`,
        })
          .open()
          .onConfirm(async () => {
            if (!league.value) return

            const deletedLeague = await deleteLeagueAsync({
              where: {
                id: league.value.id,
              },
              select: { name: true },
            })
            toast.add({
              icon: "i-heroicons-check-20-solid",
              title: `${deletedLeague?.name} deleted`,
            })
          })
      },
    },
  ]

  const leaguesDropdown = computed<DropdownMenuItem[][]>(() => {
    const mappedLeagues: DropdownMenuItem[] =
      account.value?.leagues.map((league) => ({
        label: league.name!,
        exactQuery: true,
        class: "data-testid-league-dropdown-item",
        exactActiveClass: "bg-indigo-500 text-white",
        to: `/${account.value?.hash}?league=${league.id}`,
      })) || []

    return [mappedLeagues, leagueMenu]
  })

  const saveLeague = async () => {
    const formData = localLeagueFormData.value || leagueFormData.value
    if (!formData || !league.value) return

    const snapshots = [...league.value.snapshots.map((s) => SnapshotSchem.parse(s))]

    if (latestUnsavedSnapshot.value) {
      snapshots.push(latestUnsavedSnapshot.value)
    }

    await updateLeagueAsync({
      data: {
        accountId: league.value.accountId,
        name: formData.options.name,
        configuration: {
          teamCount: formData.options.teamCount,
          teamColors: formData.options.teamColors,
          rules: formData.rules,
        },
        players: {
          upsert: formData.players.map(({ id, ...player }) => ({
            where: { id: id || -1 },
            create: {
              ...player,
            },
            update: {
              ...player,
            },
          })),
        },
        snapshots: {
          upsert: snapshots.map(({ id, ...snapshot }) => ({
            where: { id: id || -1 },
            create: {
              ...snapshot,
              data: snapshot.data!,
            },
            update: {
              ...snapshot,
              data: snapshot.data!,
            },
          })),
        },
      },
      where: {
        id: league.value?.id,
      },
    })
  }

  const save = async () => {
    await saveLeague()
    localLeagueFormData.value = null

    toast.add({
      icon: "i-heroicons-check-20-solid",
      title: "Saved",
    })
    scrollY.value = 0
  }

  const onEditLeague = async () => {
    if (!league.value) return

    const formData = localLeagueFormData.value || {
      id: league.value.id,
      options: {
        name: league.value.name!,
        teamCount: league.value.configuration.teamCount,
        teamColors: league.value.configuration.teamColors as ShirtColorEnum[],
      },
      rules: {
        keepGoalies: league.value.configuration.rules.keepGoalies!,
        goaliesFirst: league.value.configuration.rules.goaliesFirst!,
        noBestGolieAndPlayer: league.value.configuration.rules.noBestGolieAndPlayer!,
      },
      players: league.value.players.map(({ id, name, isActive, isGoalie, rank }) => ({ id, name, isActive, isGoalie, rank })),
    }

    const { result } = editLeagueDrawer.open({
      league: formData,
    })

    localLeagueFormData.value = await result
  }
</script>

<template>
  <div>
    <div v-if="!account || isLoading" class="flex flex-col m-5 gap-4">
      <USkeleton class="h-20" />
      <div class="flex gap-3">
        <USkeleton v-for="_ in 3" :key="_" class="flex-1 h-40" />
      </div>
    </div>
    <div v-else class="relative flex flex-col">
      <div
        class="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-2 bg-gray-900 rounded-none lg:h-20 md:px-5 md:rounded-b-md">
        <h2
          class="relative text-base flex items-center gap-2 font-bold text-white capitalize cursor-pointer md:text-2xl leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
          <NuxtLink to="/" class="flex items-center">
            <UIcon name="i-ph-soccer-ball" class="text-3xl" />
          </NuxtLink>

          <UDropdownMenu :items="leaguesDropdown" arrow size="lg" :disabled="isUpdatingLeague">
            <UButton
              :label="league?.name || 'Select League'"
              data-testid="league-dropdown-button"
              color="neutral"
              variant="solid"
              trailing-icon="i-heroicons-chevron-down-20-solid" />
            <template #delete-league-leading>
              <UIcon name="i-ph-trash" class="text-red-500 size-6" />
            </template>
          </UDropdownMenu>
        </h2>
        <div class="flex md:mt-0 md:ml-4 gap-4">
          <UButtonGroup size="lg">
            <UButton variant="soft" color="neutral" label="Edit" :disabled="isUpdatingLeague" @click="onEditLeague" />
            <UButton data-testid="league-save-button" :loading="isUpdatingLeague" label="Save" @click="save" />
          </UButtonGroup>
        </div>
      </div>

      <div class="absolute top-0 left-0 flex flex-col w-full py-5 mt-14 lg:mt-20">
        <div class="w-full px-2">
          <div v-if="isLoadingLeague" class="flex flex-col gap-6">
            <div class="flex justify-end">
              <USkeleton class="w-40 h-12" />
            </div>
            <div class="flex gap-4">
              <USkeleton v-for="n in 3" :key="n" class="flex-1 h-40" />
            </div>
          </div>
          <EmptyStateButton
            v-else-if="!league"
            icon="i-ph-users-three-light"
            label="Create a league"
            @click="createLeagueDialog.open()" />

          <div v-else>
            <Title>{{ league?.name }}</Title>

            <EmptyStateButton
              v-if="league.players.length === 0"
              icon="i-ph-users-three-light"
              :label="`Add some players to the ${league.name}`" />
            <League
              v-else
              v-model:latest-unsaved-="latestUnsavedSnapshot"
              :league-id="league.id"
              :snapshots="league.snapshots.map((s) => SnapshotSchem.parse(s))"
              :league-configuration="league.configuration"
              :league="league"
              :players="league.players.map((p) => SnapshotPlayerSchema.parse(p))" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
