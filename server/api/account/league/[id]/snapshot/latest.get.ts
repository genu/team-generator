export default defineEventHandler(async (event) => {
  const { id: leagueId } = getRouterParams(event)

  return await $prisma.snapshot.findFirst({
    where: {
      leagueId: parseInt(leagueId),
    },
    select: {
      id: true,
      data: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
})
