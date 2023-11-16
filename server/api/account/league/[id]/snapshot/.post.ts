export default defineEventHandler(async (event) => {
  const { leagueId } = getQuery(event)
  const snapshotData = await readBody(event)

  return await $prisma.snapshot.create({
    data: {
      leagueId: parseInt(leagueId as string),
      data: snapshotData,
    },
  })
})
