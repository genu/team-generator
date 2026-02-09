import type { LeagueEditForm } from "#shared/schemas/forms"
import type { Snapshot } from "#shared/schemas"
import { SnapshotPlayerSchema, SnapshotSchema } from "#shared/schemas"
import { LeagueEdit } from "#components"

export const useLeague = (leagueId: Ref<number | undefined>) => {
  const queryCache = useQueryCache()
  const client = useClientQueries()

  const { mutateAsync: deleteLeagueAsync } = client.league.useDelete()
  const { mutateAsync: updateLeagueAsync, isLoading: isUpdatingLeague } = client.league.useUpdate()
  const overlay = useOverlay()
  const toast = useToast()
  const { y: scrollY } = useScroll(import.meta.client ? window : null)

  const editedLeagueData = ref<LeagueEditForm | null>(null)
  const latestUnsavedSnapshot = ref<Snapshot>()
  const pendingTeamColorAssignments = ref<ShirtColorEnum[]>()

  const { data: league, isLoading } = client.league.useFindUnique(
    computed(() => ({
      where: { id: leagueId.value },
      include: { snapshots: { orderBy: { createdAt: "desc" } }, players: { orderBy: { id: "asc" } } },
    })),
    {
      enabled: () => leagueId.value !== undefined,
    },
  )

  const leagueConfiguration = computed(() => {
    const base = editedLeagueData.value
      ? {
          teamCount: editedLeagueData.value.options.teamCount,
          useTeamColors: editedLeagueData.value.options.useTeamColors,
          teamColors: editedLeagueData.value.options.teamColors,
          rules: editedLeagueData.value.rules,
        }
      : league.value?.configuration

    if (base && pendingTeamColorAssignments.value) {
      return { ...base, teamColorAssignments: pendingTeamColorAssignments.value }
    }

    return base
  })

  const parsedSnapshots = computed(() => {
    if (!league.value?.snapshots) return []
    return league.value.snapshots.map((s) => SnapshotSchema.parse(s))
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
    mutation: async (leagueId: number) => {
      const res = await $fetch("/api/account/league/duplicate", {
        method: "POST",
        body: { id: leagueId },
      })
      return res
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ["zenstack", "Account"] })
    },
  })

  const duplicate = async () => {
    if (!league.value) return

    const { id } = await duplicateLeagueAsync(league.value.id!)
    toast.add({
      icon: "i-lucide-check",
      title: `"${league.value.name}" league duplicated`,
    })

    leagueId.value = id
  }

  const save = async () => {
    if (!league.value || (!editedLeagueData.value && !latestUnsavedSnapshot.value && !pendingTeamColorAssignments.value)) return

    const formData = editedLeagueData.value || {
      options: {
        name: league.value.name!,
        teamCount: league.value.configuration.teamCount,
        useTeamColors: league.value.configuration.useTeamColors,
        teamColors: league.value.configuration.teamColors,
      },
      rules: {
        keepGoalies: league.value.configuration.rules.keepGoalies!,
        goaliesFirst: league.value.configuration.rules.goaliesFirst!,
        noBestGoalieAndPlayer: league.value.configuration.rules.noBestGoalieAndPlayer!,
      },
      players: league.value.players.map(({ id, name, isActive, isGoalie, rank }) => ({ id, name, isActive, isGoalie, rank })),
    }

    // Only include players that have changed or are new
    const changedPlayers = formData.players.filter((player, index) => {
      const originalPlayer = league.value?.players[index]
      if (!originalPlayer) return true // New player
      return (
        player.name !== originalPlayer.name ||
        player.isActive !== originalPlayer.isActive ||
        player.isGoalie !== originalPlayer.isGoalie ||
        player.rank !== originalPlayer.rank
      )
    })

    // Only save the latest snapshot if there's a new one
    const snapshotData = latestUnsavedSnapshot.value
      ? {
          create: {
            data: latestUnsavedSnapshot.value.data!,
          },
        }
      : undefined

    await updateLeagueAsync({
      data: {
        name: formData.options.name,
        configuration: {
          teamCount: formData.options.teamCount,
          useTeamColors: formData.options.useTeamColors,
          teamColors: formData.options.teamColors,
          ...(pendingTeamColorAssignments.value && { teamColorAssignments: pendingTeamColorAssignments.value }),
          rules: formData.rules,
        },
        ...(changedPlayers.length > 0 && {
          players: {
            upsert: changedPlayers.map(({ id, ...player }) => ({
              where: { id: id || -1 },
              create: { ...player },
              update: { ...player },
            })),
          },
        }),
        ...(snapshotData && {
          snapshots: snapshotData,
        }),
      },
      where: {
        id: league.value?.id,
      },
    })

    editedLeagueData.value = null
    pendingTeamColorAssignments.value = undefined

    toast.add({
      icon: "i-lucide-check",
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
        useTeamColors: league.value.configuration.useTeamColors ?? false,
        teamColors: league.value.configuration.teamColors as ShirtColorEnum[],
      },
      rules: {
        keepGoalies: league.value.configuration.rules.keepGoalies!,
        goaliesFirst: league.value.configuration.rules.goaliesFirst!,
        noBestGoalieAndPlayer: league.value.configuration.rules.noBestGoalieAndPlayer!,
      },
      players: league.value.players.map(({ id, name, isActive, isGoalie, rank }) => ({ id, name, isActive, isGoalie, rank })),
    }

    const { result } = overlay.create(LeagueEdit).open({
      league: formData,
    })

    editedLeagueData.value = await result
  }

  const updateTeamColors = (colors: ShirtColorEnum[]) => {
    pendingTeamColorAssignments.value = colors
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
    actions: { duplicate, save, edit, updateTeamColors },
  }
}
