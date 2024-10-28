export default defineEventHandler(async (event) => {
  const { leagueId } = getQuery(event)

  return $database().db.snapshot.findMany({
    where: {
      leagueId: parseInt(leagueId as string),
    },
  })
})
