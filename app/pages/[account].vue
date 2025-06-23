<script lang="ts" setup>
  import { useRouteQuery } from "@vueuse/router"
  import type { DropdownMenuItem } from "@nuxt/ui"
  import { DialogCreateLeague } from "#components"

  const { confirm } = useDialog()
  const overlay = useOverlay()
  const accountHash = useRouteParams("account", undefined, { transform: String })
  const leagueId = useRouteQuery("league", undefined, { transform: (value) => (value ? parseInt(value) : undefined) })
  const {
    league,
    isLoading: isLoadingLeague,
    deleteLeagueAsync,
    isUpdatingLeague,
    editedLeagueData,
    latestUnsavedSnapshot,
    currentPlayers,
    parsedSnapshots,
    leagueConfiguration,
    actions,
  } = useLeague(leagueId)

  const toast = useToast()

  const createLeagueDialog = overlay.create(DialogCreateLeague)

  const {
    data: account,
    isLoading,
    suspense: suspenseAccount,
  } = useFindUniqueAccount({
    where: { hash: accountHash.value },
    include: { leagues: { select: { id: true, name: true } } },
  })

  onServerPrefetch(async () => {
    await suspenseAccount()
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
        const newLeagueId = await res.result

        await navigateTo(`/${account.value.hash}?league=${newLeagueId}`)
      },
    },
    {
      label: "Duplicate League",
      icon: "i-ph-copy",
      onSelect: async () => {
        if (!league.value) return
        await actions.duplicate()
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
              icon: "i-ph-check-fat-fill",
              title: `${deletedLeague?.name} deleted`,
            })
          })
      },
    },
  ]

  const leaguesDropdown = computed<DropdownMenuItem[][]>(() => {
    let mappedLeagues: DropdownMenuItem[] =
      account.value?.leagues.map((league) => ({
        id: league.id,
        label: league.name!,
        exactQuery: true,
        class: "data-testid-league-dropdown-item",
        exactActiveClass: "bg-indigo-500 text-white",
        to: `/${account.value?.hash}?league=${league.id}`,
      })) || []

    if (editedLeagueData.value) {
      // Remove the current league from the dropdown
      mappedLeagues = mappedLeagues.filter((league) => league.id !== editedLeagueData.value?.id)

      // Add the current locally edited league to the dropdown
      mappedLeagues.push({
        id: editedLeagueData.value?.id,
        label: editedLeagueData.value?.options.name,
        exactQuery: true,
        class: "data-testid-league-dropdown-item",
        exactActiveClass: "bg-indigo-500 text-white",
        to: `/${account.value?.hash}?league=${editedLeagueData.value?.id}`,
      })
    }

    return [mappedLeagues, leagueMenu]
  })
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
              :label="editedLeagueData?.options.name || league?.name || 'Select League'"
              data-testid="league-dropdown-button"
              color="neutral"
              variant="solid"
              trailing-icon="i-ph-caret-down" />
            <template #delete-league-leading>
              <UIcon name="i-ph-trash" class="text-red-500 size-6" />
            </template>
          </UDropdownMenu>
        </h2>
        <div class="flex md:mt-0 md:ml-4 gap-4">
          <UButtonGroup size="lg">
            <UButton variant="soft" color="neutral" label="Edit" :disabled="isUpdatingLeague" @click="actions.edit" />
            <UButton data-testid="league-save-button" :loading="isUpdatingLeague" label="Save" @click="actions.save" />
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
              v-if="currentPlayers.length === 0"
              icon="i-ph-users-three-light"
              :label="`Add some players to the ${league.name}`"
              @click="actions.edit" />
            <League
              v-else-if="leagueConfiguration"
              v-model:latest-unsaved-snapshot="latestUnsavedSnapshot"
              :league-id="league.id"
              :snapshots="parsedSnapshots"
              :league-configuration="leagueConfiguration"
              :league="league"
              :players="currentPlayers" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
