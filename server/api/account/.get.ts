export default defineEventHandler(async (event) => {
  const { hash } = getQuery(event)

  return await $database().db.account.findFirst({
    select: {
      id: true,
      hash: true,
      leagues: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
    },
    where: {
      hash: hash as string,
    },
  })
})
