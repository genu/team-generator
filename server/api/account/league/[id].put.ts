import type { League, Player, Prisma } from '@prisma/client'
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  const { id, updatedLeague } = await readBody<{ id: number; updatedLeague: League & { players: Player[] } }>(event)

  return await $prisma.league.update({
    where: { id },
    include: {
      players: true,
    },
    data: {
      name: updatedLeague.name,
      configuration: updatedLeague.configuration as any,
      players: {
        upsert: updatedLeague.players.map((player) => ({
          where: { id: player.id ?? -1 },
          update: { ...player },
          create: { ...player },
        })),
      },
    },
  })
})
