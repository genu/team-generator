import type { Player, Snapshot } from '@prisma/client'
import type { Rules } from '../interfaces'
import { groupBy, random, orderBy, filter, map, pullAt, cloneDeep } from 'lodash-es'

export const useTeamShuffle = (snapshot: Ref) => {
  const methodology = useMethodology()
  const teamThatChoseFirst = ref(0)
  const teamChoosing = ref(0)
  const teams = reactive({} as Record<number, Player[]>)
  const isShuffled = ref(false)

  watch(
    snapshot,
    (snapshot: Snapshot) => {
      if (snapshot) {
        for (const key in snapshot.data as unknown as Record<number, Player[]>) {
          //@ts-ignore
          teams[Number(key)] = reactive(snapshot.data[Number(key)])
        }
      }
    },
    { immediate: true }
  )
  // if (snapshot?.value) {
  //   console.log('got snapshotp, ', snapshot.value)
  //   // const { teams: snapshotTeams } = snapshot.value

  //   // for (const key in snapshotTeams) {
  //   //   teams[Number(key)] = reactive(snapshotTeams[key])
  //   // }
  // }

  interface ShuffleOptions {
    teamCount: number
    rules?: Rules
  }
  /**
   *
   * @param players Players to Shuffle
   * @param options
   *
   * @returns Non-reactive snapshot of teams
   */
  const shuffle = (players: Player[], options: ShuffleOptions) => {
    const onlyActivePlayers = filter(players, (player) => player.isActive)
    const groupedByRank = groupBy(onlyActivePlayers, 'rank')

    teamChoosing.value = random(1, options.teamCount)
    teamThatChoseFirst.value = teamChoosing.value

    // Reset teams and methodology
    for (const key in teams) {
      delete teams[key]
    }

    methodology.reset()

    let rank = 10

    methodology.write(`Team ${teamChoosing.value} is choosing first`)

    // First pick goal keepers
    if (options.rules?.goaliesFirst) {
      const goalKeepers = orderBy(
        filter(players, (player) => player.isGoalie),
        ['rank'],
        ['desc']
      )

      methodology.write(`Choosing Goalkeepers first (${map(goalKeepers, 'name').join(', ')})`)

      while (goalKeepers.length > 0) {
        const randomGoalkeeper = goalKeepers.splice(0, 1)[0] as Player

        methodology.write(
          `Team ${teamChoosing.value} chose goal keeper ${randomGoalkeeper.name} (${randomGoalkeeper.rank})`
        )

        if (!teams[teamChoosing.value]) {
          teams[teamChoosing.value] = reactive([])
        }
        teams[teamChoosing.value].push(randomGoalkeeper)

        // Next team chooses
        teamChoosing.value = (teamChoosing.value + 1) % options.teamCount
      }
      methodology.write('Finished selecting goalkeepers')
    }

    while (rank > 0) {
      const playersAtRank = groupedByRank[rank] || []

      while (playersAtRank.length > 0) {
        const randomPlayerFromRank = playersAtRank.splice(random(0, playersAtRank.length - 1), 1)[0]

        // Goalies were already chosen, this team can choose again.
        if (options.rules?.goaliesFirst && randomPlayerFromRank.isGoalie) continue

        methodology.write(
          `Team ${teamChoosing.value} chose ${randomPlayerFromRank.name} (${randomPlayerFromRank.rank})`
        )

        if (!teams[teamChoosing.value]) {
          teams[teamChoosing.value] = reactive([])
        }

        teams[teamChoosing.value].push(randomPlayerFromRank)

        // Next team chooses
        teamChoosing.value = (teamChoosing.value % options.teamCount) + 1
      }

      rank--
    }
    isShuffled.value = true

    return cloneDeep(teams)
  }

  /**
   *
   * @returns Non-reactive snapshot of updated teams after moving player
   */
  const movePlayer = (fromTeam: number, toTeam: number, oldPlayerIndex: number, newPlayerIndex: number) => {
    const player = teams[fromTeam][oldPlayerIndex]

    teams[fromTeam].splice(oldPlayerIndex, 1)
    teams[toTeam].splice(newPlayerIndex, 0, player)

    return cloneDeep(teams)
  }

  return { shuffle, methodology, teams, isShuffled, movePlayer, teamThatChoseFirst }
}
