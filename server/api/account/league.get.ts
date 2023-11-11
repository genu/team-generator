export default defineEventHandler(async (event) => {
  const { league: leagueId } = getQuery(event)

  return await $prisma.league.findFirst({
    select: {
      name: true,
      players: true,
    },
    where: {
      id: parseInt(leagueId as string),
    },
  })
})
