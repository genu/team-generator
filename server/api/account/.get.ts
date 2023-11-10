export default defineEventHandler(async (event) => {
  const { hash } = getQuery(event)

  const account = await $prisma.account.findFirst({
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

  return account
})
