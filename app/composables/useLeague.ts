import { useMutation, useQueryClient } from "@tanstack/vue-query"
import type { LeagueEditForm } from "#shared/schemas/forms"
import type { Snapshot } from "#shared/schemas"
import { SnapshotPlayerSchema, SnapshotSchem } from "#shared/schemas"
import { LeagueEdit } from "#components"
import type { ShirtColorEnum } from "#shared/schemas/forms/league-edit.form"

export const useLeague = (leagueId: Ref<number | undefined>) => {
  const queryClient = useQueryClient()
  const { mutateAsync: deleteLeagueAsync } = useDeleteLeague()
  const { mutateAsync: updateLeagueAsync, isPending: isUpdatingLeague } = useUpdateLeague()
  const overlay = useOverlay()
  const toast = useToast()
  const { y: scrollY } = useScroll(import.meta.client ? window : null)

  const editedLeagueData = ref<LeagueEditForm | null>(null)
  const latestUnsavedSnapshot = ref<Snapshot>()

  const {
    data: league,
    isLoading,
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

  const leagueConfiguration = computed(() => {
    if (editedLeagueData.value) {
      return {
        teamCount: editedLeagueData.value.options.teamCount,
        teamColors: editedLeagueData.value.options.teamColors,
        rules: editedLeagueData.value.rules,
      }
    }
    return league.value?.configuration
  })

  const parsedSnapshots = computed(() => {
    if (!league.value?.snapshots) return []
    return league.value.snapshots.map((s) => SnapshotSchem.parse(s))
  })

  onServerPrefetch(async () => {
    if (leagueId.value) await suspenseLeague()
  })

  watch(league, (newLeague) => {
    if (!newLeague) {
      editedLeagueData.value = null
    }
  })

  const currentPlayers = computed(() => {
    if (!editedLeagueData.value && !league.value) return []
    const players = editedLeagueData.value?.players ?? league.value?.players
    if (!players) return []
    return players.map((p) => SnapshotPlayerSchema.parse(p))
  })

  const { mutateAsync: duplicateLeagueAsync } = useMutation({
    mutationFn: async (leagueId: number) => {
      const res = await $fetch("/api/account/league/duplicate", {
        method: "POST",
        body: { id: leagueId },
      })
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zenstack", "Account"] })
    },
  })

  const duplicate = async () => {
    if (!league.value) return

    const { id } = await duplicateLeagueAsync(league.value.id!)
    toast.add({
      icon: "i-heroicons-check-20-solid",
      title: `"${league.value.name}" league duplicated`,
    })

    leagueId.value = id
  }

  const save = async () => {
    const formData = editedLeagueData.value
    if (!formData || !league.value) return

    const snapshots = league.value.snapshots.map((s) => SnapshotSchem.parse(s))

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

    editedLeagueData.value = null

    toast.add({
      icon: "i-heroicons-check-20-solid",
      title: "Saved",
    })
    scrollY.value = 0
  }

  const edit = async () => {
    if (!league.value) return

    const formData = editedLeagueData.value || {
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

    const { result } = overlay.create(LeagueEdit).open({
      league: formData,
    })

    editedLeagueData.value = await result
  }

  return {
    league,
    isLoading,
    deleteLeagueAsync,
    isUpdatingLeague,
    editedLeagueData,
    latestUnsavedSnapshot,
    currentPlayers,
    parsedSnapshots,
    leagueConfiguration,
    actions: { duplicate, save, edit },
  }
}
