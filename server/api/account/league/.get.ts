export default defineEventHandler(async (event) => {
  const { leagueId } = getQuery(event)

  return await $prisma.league.findFirst({
    select: {
      id: true,
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
