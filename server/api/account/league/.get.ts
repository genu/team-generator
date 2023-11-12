export default defineEventHandler(async (event) => {
  const { league: leagueId } = getQuery(event)

  return await $prisma.league.findFirst({
    select: {
      name: true,
      configuration: true,
      players: {
        select: {
          id: true,
          name: true,
          rank: true,
          isActive: true,
          isGoalie: true,
        },
      },
    },
    where: {
      id: parseInt(leagueId as string),
    },
  })
})
