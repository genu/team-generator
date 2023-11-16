import type { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const body = await readBody<Prisma.LeagueCreateInput>(event)

  return await $prisma.league.create({
    data: body,
    select: {
      id: true,
      account: {
        select: {
          hash: true,
        },
      },
    },
  })
})
