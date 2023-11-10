export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  return await $prisma.league.findFirst({
    where: { hash: query.teamHash as string },
  })
})
