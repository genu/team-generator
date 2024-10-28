import type { League, Player, Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { id: toDuplicate } = await readBody<{ id: string }>(event)

  const { id, name, configuration, createdAt, players, updatedAt, ...dataToDuplicate } =
    await $database().db.league.findUniqueOrThrow({
      where: {
        id: parseInt(toDuplicate as string),
      },
      include: {
        players: true,
      },
    })

  return await $database().db.league.create({
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
