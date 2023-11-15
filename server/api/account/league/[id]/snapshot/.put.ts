export default defineEventHandler(async (event) => {
  const { leagueId } = getQuery(event)
  const snapshot = await readBody(event)

  console.log('update: ' + leagueId, snapshot)

  return true
  //   return $prisma.snapshot.create({})
})
