import type { League, Player } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { league: leagueId } = getQuery(event)

  const league = await $prisma.league.findFirst({
    select: {
      name: true,
      players: true,
    },
    where: {
      id: parseInt(leagueId as string),
    },
  })

  return {
    toJSON: () => league as League & { players: Player[] },
  }
})
