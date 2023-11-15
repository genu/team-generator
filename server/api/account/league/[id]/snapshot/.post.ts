export default defineEventHandler(async (event) => {
  const { leagueId } = getQuery(event)
  const snapshot = await readBody(event)

  console.log(snapshot)

  return true
  //   return $prisma.snapshot.create({})
})
