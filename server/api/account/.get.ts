export default defineEventHandler(async (event) => {
  const { teamHash } = getQuery(event)

  /**
   *
   * Determine if we need to migrate this to new schema
   */
  const account = await $prisma.account.findFirst({
    where: {
      hash: teamHash as string,
    },
  })

  if (!account) {
    // Check for a league with this hash (old schema)
    const league = await $prisma.league.findFirst({
      where: {
        hash: teamHash as string,
      },
    })

    if (league) {
      throw new Error('League  found with' + teamHash)
    }
  }
  //   return await $prisma.league.findUnique({
  //     where: { hash: query.teamHash as string },
  //   })
})
