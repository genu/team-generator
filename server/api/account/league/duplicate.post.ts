import type { League, Player, Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { id: toDuplicate } = await readBody<{ id: string }>(event)

  const { id, data, name, configuration, createdAt, players, updatedAt, ...dataToDuplicate } =
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
      ...dataToDuplicate,
      name: `${name} (copy)`,
      configuration: configuration as Prisma.JsonObject,
      players: {
        createMany: {
          data: players.map(({ id, leagueId, createdAt, updatedAt, ...playerDataToCopy }) => ({
            ...playerDataToCopy,
          })),
        },
      },
    },
    select: {
      id: true,
      account: true,
    },
  })
})
