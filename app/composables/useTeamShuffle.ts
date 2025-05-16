import type { LeagueConfiguration, Player } from '@zenstackhq/runtime/models'
import { groupBy, random, orderBy, filter, map, size, cloneDeep } from 'lodash-es'
import { SnapshotDataSchema, type SnapshotData } from '#shared/schemas'

export const useTeamShuffle = (snapshotData: Ref<SnapshotData>) => {
  const methodology = useMethodology()
  const teamThatChoseFirst = ref(0)
  const teamChoosing = ref(0)
  const teams = ref<SnapshotData>({})
  const isShuffled = ref(false)

  watch(
    snapshotData,
    (snapshot) => {
      const snapshotData = SnapshotDataSchema.parse(snapshot)

      if (size(snapshotData) > 0) {
        for (const teamKey in snapshotData) {
          teams.value = {
            ...teams.value,
            [teamKey]: snapshotData[Number(teamKey)]!,
          }
        }
        isShuffled.value = true
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
  const shuffle = (players: Player[], options: LeagueConfiguration) => {
    const onlyActivePlayers = filter(players, (player) => player.isActive)
    const groupedByRank = groupBy(onlyActivePlayers, 'rank')

    teamChoosing.value = random(0, options.teamCount - 1)
    teamThatChoseFirst.value = teamChoosing.value

    // Reset teams and methodology

    // for (const key in teams) {
    //   teams.value = {
    //     ...teams.value,
    //     [key]: [],
    //   }
    //   delete teams[key]
    // }

    teams.value = {}
    methodology.reset()

    let rank = 10

    methodology.write(`Team ${teamChoosing.value} is choosing first`)

    // First pick goal keepers
    if (options.rules?.goaliesFirst) {
      const goalKeepers = orderBy(
        filter(players, (player) => player.isGoalie && player.isActive),
        ['rank'],
        ['desc'],
      )

      methodology.write(`Choosing Goalkeepers first (${map(goalKeepers, 'name').join(', ')})`)

      while (goalKeepers.length > 0) {
        console.log('team choosing: ', teamChoosing.value)
        const randomGoalkeeper = goalKeepers.splice(0, 1)[0] as Player

        methodology.write(`Team ${teamChoosing.value} chose goal keeper ${randomGoalkeeper.name} (${randomGoalkeeper.rank})`)

        if (!teams.value[teamChoosing.value]) {
          teams.value[teamChoosing.value] = reactive([])
        }

        teams.value[teamChoosing.value]!.push(randomGoalkeeper)

        // Next team chooses
        teamChoosing.value = (teamChoosing.value + 1) % options.teamCount
      }
      methodology.write('Finished selecting goalkeepers')
    }

    while (rank > 0) {
      const playersAtRank = groupedByRank[rank] || []

      while (playersAtRank.length > 0) {
        const randomPlayerFromRank = playersAtRank.splice(random(0, playersAtRank.length - 1), 1)[0]!

        // Goalies were already chosen, this team can choose again.
        if (options.rules?.goaliesFirst && randomPlayerFromRank.isGoalie) continue

        methodology.write(`Team ${teamChoosing.value} chose ${randomPlayerFromRank.name} (${randomPlayerFromRank.rank})`)

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

    return cloneDeep(teams)
  }

  const addPlayerToTeam = (team: number, index: number, player: Player) => {
    if (!teams.value[team]) return

    const upatedTeams = [...teams.value[team].slice(0, index), player, ...teams.value[team].slice(index)]
    teams.value = { ...teams.value, [team]: upatedTeams }
  }

  const removePlayerFromTeam = (team: number, index: number) => {
    if (!teams.value[team]) return

    const upatedTeams = [...teams.value[team].slice(0, index), ...teams.value[team].slice(index + 1)]
    teams.value = { ...teams.value, [team]: upatedTeams }
  }

  const getSnapshot = () => {
    return cloneDeep(teams)
  }

  return {
    shuffle,
    methodology,
    teams,
    isShuffled,
    teamThatChoseFirst,
    addPlayerToTeam,
    removePlayerFromTeam,
    getSnapshot,
  }
}
