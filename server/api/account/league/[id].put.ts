import type { League, Player } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const { id, updatedLeague } = await readBody<{ id: number; updatedLeague: League & { players: Player[] } }>(event)

  const existingPlayerIds = updatedLeague.players.map((p) => p.id)

  await $prisma.player.deleteMany({
    where: {
      league: { id },
      NOT: {
        id: {
          in: existingPlayerIds,
        },
      },
    },
  })

  // Determine if we need to delete any players
  await $prisma.player.deleteMany({
    where: {
      id: {
        in: updatedLeague.players.map((p) => p.id),
      },
      league: {
        id: id,
      },
    },
  })

  return await $prisma.league.update({
    where: { id },
    select: {
      id: true,
      account: {
        select: {
          hash: true,
        },
      },
    },
    data: {
      name: updatedLeague.name,
      configuration: updatedLeague.configuration as any,
      players: {
        upsert: updatedLeague.players.map((player) => ({
          where: { id: player.id ?? -1 },
          update: { ...player, rank: typeof player.rank === 'string' ? parseInt(player.rank) : player.rank },
          create: { ...player, rank: typeof player.rank === 'string' ? parseInt(player.rank) : player.rank },
        })),
      },
    },
  })
})
