export default defineEventHandler(async (event) => {
  const { leagueId } = getQuery(event)

  return $prisma.snapshot.findMany({
    where: {
      leagueId: parseInt(leagueId as string),
    },
  })
})
