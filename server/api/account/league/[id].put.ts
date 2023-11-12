export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const league = await readBody(event)

  return await $prisma.league.update({
    data: {
      ...league,
    },
    select: {
      id: true,
      name: true,
      account: {
        select: { hash: true },
      },
    },
    where: {
      id: parseInt(id as string),
    },
  })
})
