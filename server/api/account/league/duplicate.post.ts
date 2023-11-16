import type { League, Player, Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { id: toDuplicate } = await readBody<{ id: string }>(event)

  const { id, hash, name, configuration, players, updatedAt, accountId, ...dataToDuplicate } =
    await $prisma.league.findUniqueOrThrow({
      where: {
        id: parseInt(toDuplicate as string),
      },
      include: {
        players: true,
      },
    })

  return await $prisma.league.create({
    data: {
      account: {
        connect: {
          id: accountId!,
        },
      },
    },
  })
})
