export default defineEventHandler(async (event) => {
  const { hash } = getQuery(event)

  return await $prisma.account.findFirst({
    select: {
      leagues: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      hash: hash as string,
    },
  })
})