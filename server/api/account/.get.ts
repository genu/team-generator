export default defineEventHandler(async (event) => {
  const { hash } = getQuery(event)

  const account = await $prisma.account.findFirst({
    select: {
      leagues: {
        select: {
          snapshots: {
            select: {
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
    where: {
      hash: hash as string,
    },
  })

  if (!account) return createError({ statusCode: 404, message: 'Cant migrate league to new schema' })

  return account
})
