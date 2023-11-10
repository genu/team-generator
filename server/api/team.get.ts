export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  return await $prisma.league.findUnique({
    where: { hash: query.teamHash as string },
  })
})
