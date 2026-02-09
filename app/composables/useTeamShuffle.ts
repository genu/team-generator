import type { LeagueConfiguration } from "#generated/zenstack/models"
import { groupBy, random, orderBy, cloneDeep } from "lodash-es"
import type { SnapshotData, SnapshotPlayer } from "#shared/schemas"

type TeamsChangedCallback = (teams: SnapshotData) => void

export const useTeamShuffle = (snapshotData: Ref<SnapshotData>, onTeamsChanged?: TeamsChangedCallback) => {
  const teams = ref<SnapshotData>([])
  const isShuffled = ref(false)

  const notifyChange = () => {
    onTeamsChanged?.(cloneDeep(teams.value))
  }

  watch(
    snapshotData,
    (snapshot) => {
      if (snapshot.length > 0) {
        teams.value = snapshot.map((team) => [...team])
        isShuffled.value = true
      }
    },
    { immediate: true },
  )

  const shuffle = (players: SnapshotPlayer[], options: LeagueConfiguration) => {
    const onlyActivePlayers = players.filter((player) => player.isActive)
    const groupedByRank = groupBy(onlyActivePlayers, "rank")

    let teamChoosing = random(0, options.teamCount - 1)

    // Build local result as plain arrays
    const result: SnapshotPlayer[][] = Array.from({ length: options.teamCount }, () => [])

    // First pick goal keepers
    if (options.rules?.goaliesFirst) {
      const goalKeepers = orderBy(
        players.filter((player) => player.isGoalie && player.isActive),
        ["rank"],
        ["desc"],
      )

      for (const goalkeeper of goalKeepers) {
        result[teamChoosing]!.push(goalkeeper)
        teamChoosing = (teamChoosing + 1) % options.teamCount
      }
    }

    const maxRank = Math.max(...Object.keys(groupedByRank).map(Number), 0)
    let rank = maxRank

    while (rank > 0) {
      const playersAtRank: SnapshotPlayer[] = [...(groupedByRank[rank] || [])]

      while (playersAtRank.length > 0) {
        const randomPlayerFromRank = playersAtRank.splice(random(0, playersAtRank.length - 1), 1)[0]!

        // Goalies were already chosen, skip them
        if (options.rules?.goaliesFirst && randomPlayerFromRank.isGoalie) continue

        result[teamChoosing]!.push(randomPlayerFromRank)
        teamChoosing = (teamChoosing + 1) % options.teamCount
      }

      rank--
    }

    // Assign once
    teams.value = result
    isShuffled.value = true
    notifyChange()
  }

  const movePlayer = (_fromIndex: number, _toIndex: number) => {}

  const addPlayerToTeam = (toTeam: number, at: number, player: SnapshotPlayer) => {
    if (!teams.value[toTeam]) return

    const updated = teams.value.map((team, i) => (i === toTeam ? [...team.slice(0, at), player, ...team.slice(at)] : [...team]))
    teams.value = updated
    notifyChange()
  }

  const removePlayerFromTeam = (fromTeam: number, at: number) => {
    if (!teams.value[fromTeam]) return

    const updated = teams.value.map((team, i) => (i === fromTeam ? [...team.slice(0, at), ...team.slice(at + 1)] : [...team]))
    teams.value = updated
    notifyChange()
  }

  return {
    shuffle,
    teams,
    isShuffled,
    addPlayerToTeam,
    removePlayerFromTeam,
    movePlayer,
  }
}
