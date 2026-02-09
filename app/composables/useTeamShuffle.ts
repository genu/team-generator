import type { LeagueConfiguration, Player } from "#generated/zenstack/models"
import { groupBy, random, orderBy, size, cloneDeep } from "lodash-es"
import { SnapshotDataSchema, type SnapshotData, type SnapshotPlayer, type Snapshot } from "#shared/schemas"

export const useTeamShuffle = (snapshotData: Ref<SnapshotData>, latestUnsavedSnapshot?: Ref<Snapshot | undefined>) => {
  const teamThatChoseFirst = ref(0)
  const teamChoosing = ref(0)
  const teams = ref<SnapshotData>({})
  const isShuffled = ref(false)

  // Helper function to update latestUnsavedSnapshot
  const updateLatestUnsavedSnapshot = () => {
    if (latestUnsavedSnapshot) {
      latestUnsavedSnapshot.value = {
        data: cloneDeep(teams.value),
      }
    }
  }

  watch(
    snapshotData,
    (snapshot) => {
      const snapshotData = SnapshotDataSchema.parse(snapshot)

      if (size(snapshotData) > 0) {
        let newTeams: SnapshotData = {}

        for (const teamKey in snapshotData) {
          newTeams = {
            ...newTeams,
            [teamKey]: snapshotData[Number(teamKey)]!,
          }
        }
        isShuffled.value = true
        teams.value = newTeams
      }
    },
    { immediate: true },
  )

  /**
   *
   * @param players Players to Shuffle
   * @param options
   *
   * @returns Non-reactive snapshot of teams
   */
  const shuffle = (players: SnapshotPlayer[], options: LeagueConfiguration) => {
    const onlyActivePlayers = players.filter((player) => player.isActive)
    const groupedByRank = groupBy(onlyActivePlayers, "rank")

    teamChoosing.value = random(0, options.teamCount - 1)
    teamThatChoseFirst.value = teamChoosing.value

    teams.value = {}

    let rank = 10

    // First pick goal keepers
    if (options.rules?.goaliesFirst) {
      const goalKeepers = orderBy(
        players.filter((player) => player.isGoalie && player.isActive),
        ["rank"],
        ["desc"],
      )

      while (goalKeepers.length > 0) {
        const randomGoalkeeper = goalKeepers.splice(0, 1)[0] as Player

        if (!teams.value[teamChoosing.value]) {
          teams.value[teamChoosing.value] = reactive([])
        }

        teams.value[teamChoosing.value]!.push(randomGoalkeeper)

        // Next team chooses
        teamChoosing.value = (teamChoosing.value + 1) % options.teamCount
      }
    }

    while (rank > 0) {
      const playersAtRank: SnapshotPlayer[] = groupedByRank[rank] || []

      while (playersAtRank.length > 0) {
        const randomPlayerFromRank = playersAtRank.splice(random(0, playersAtRank.length - 1), 1)[0]!

        // Goalies were already chosen, this team can choose again.
        if (options.rules?.goaliesFirst && randomPlayerFromRank.isGoalie) continue

        if (!teams.value[teamChoosing.value]) {
          teams.value[teamChoosing.value] = reactive([])
        }

        teams.value[teamChoosing.value]!.push(randomPlayerFromRank)

        // Next team chooses
        teamChoosing.value = (teamChoosing.value + 1) % options.teamCount
      }

      rank--
    }
    isShuffled.value = true

    // Update latestUnsavedSnapshot after shuffle
    updateLatestUnsavedSnapshot()

    return cloneDeep(teams)
  }

  const movePlayer = (_fromIndex: number, _toIndex: number) => {}

  const addPlayerToTeam = (toTeam: number, at: number, player: SnapshotPlayer) => {
    if (!teams.value[toTeam]) return

    const updatedTeams = [...teams.value[toTeam].slice(0, at), player, ...teams.value[toTeam].slice(at)]
    teams.value = { ...teams.value, [toTeam]: updatedTeams }

    // Update latestUnsavedSnapshot after modifying teams
    updateLatestUnsavedSnapshot()
  }

  const removePlayerFromTeam = (fromTeam: number, at: number) => {
    if (!teams.value[fromTeam]) return

    const updatedTeams = [...teams.value[fromTeam].slice(0, at), ...teams.value[fromTeam].slice(at + 1)]
    teams.value = { ...teams.value, [fromTeam]: updatedTeams }

    // Update latestUnsavedSnapshot after modifying teams
    updateLatestUnsavedSnapshot()
  }

  const getSnapshot = () => {
    return cloneDeep(teams)
  }

  return {
    shuffle,
    teams,
    isShuffled,
    teamThatChoseFirst,
    addPlayerToTeam,
    removePlayerFromTeam,
    movePlayer,
    getSnapshot,
  }
}
