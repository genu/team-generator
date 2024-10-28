export default defineEventHandler(async (event) => {
  const { leagueId } = getQuery(event)

  return await $database().db.league.findFirst({
    select: {
      id: true,
      name: true,
      configuration: true,
      snapshots: {
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
      },
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
