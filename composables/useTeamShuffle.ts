import type { Player } from '@prisma/client'
import type { Rules } from '../interfaces'
import { groupBy, random, orderBy, filter, map } from 'lodash-es'

export const useTeamShuffle = () => {
  const methodology = useMethodology()
  const teamToChooseFirst = ref(0)
  const teams = ref<any>({})

  interface ShuffleOptions {
    teamCount: number
    rules?: Rules
  }
  const shuffle = (players: Player[], options: ShuffleOptions) => {
    const onlyActivePlayers = filter(players, (player) => player.isActive)
    const groupedByRank = groupBy(onlyActivePlayers, 'rank')

    teamToChooseFirst.value = random(0, options.teamCount - 1)

    teams.value = []
    methodology.reset()

    let rank = 10

    methodology.write(`Team ${teamToChooseFirst.value + 1} is choosing first`)

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
          `Team ${teamToChooseFirst.value + 1} chose goal keeper ${randomGoalkeeper.name} (${randomGoalkeeper.rank})`
        )

        if (!teams.value[teamToChooseFirst.value]) {
          const team: any = {}
          team[teamToChooseFirst.value] = []

          teams.value = { ...teams.value, ...team }
        }

        teams.value[teamToChooseFirst.value] = [...teams.value[teamToChooseFirst.value], randomGoalkeeper]

        // Next team chooses
        teamToChooseFirst.value = (teamToChooseFirst.value + 1) % options.teamCount
      }
      methodology.write('Finished selecting goalkeepers')
    }

    while (rank > 0) {
      const playersAtRank = groupedByRank[rank]

      while (playersAtRank && playersAtRank.length > 0) {
        const randomPlayerFromRank = playersAtRank.splice(random(0, playersAtRank.length - 1), 1)[0]

        // Goalies were already chosen, this team can choose again.
        if (options.rules?.goaliesFirst && randomPlayerFromRank.isGoalie) continue

        methodology.write(
          `Team ${teamToChooseFirst.value + 1} chose ${randomPlayerFromRank.name} (${randomPlayerFromRank.rank})`
        )

        if (!teams.value[teamToChooseFirst.value]) {
          const team: any = {}
          team[teamToChooseFirst.value] = []

          teams.value = { ...teams.value, ...team }
        }

        teams.value[teamToChooseFirst.value] = [...teams.value[teamToChooseFirst.value], randomPlayerFromRank]

        // Next team chooses
        teamToChooseFirst.value = (teamToChooseFirst.value + 1) % options.teamCount
      }

      rank--
    }
  }

  const movePlayer = (player: Player, fromTeam: number, toTeam: number) => {
     // const player: Player = teams.value[fromTeam][event.oldIndex as number]

  // // Remove player from old team
  // teams.value[fromTeam].splice(event.oldIndex, 1)
  // teams.value[toTeam].splice(event.newIndex, 0, player)
  }

  return { shuffle, methodology, teams }
}
