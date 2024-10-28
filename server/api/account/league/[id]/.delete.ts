export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)

  return await $database().db.league.delete({
    where: { id: parseInt(id as string) },
    select: {
      id: true,
      name: true,
      account: {
        select: { hash: true },
      },
    },
  })
})
