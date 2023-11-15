import type { League, Player, Snapshot } from '@prisma/client'
import { map } from 'lodash-es'

export default defineEventHandler(async (event) => {
  const { id, updatedLeague } = await readBody<{
    id: number
    updatedLeague: League & {
      players: Player[]
      defaultSnapshot: Partial<Snapshot>
    }
  }>(event)

  const existingPlayerIds = map(updatedLeague.players, 'id').filter((id) => id !== undefined)

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
          update: {
            ...player,
            rank: typeof player.rank === 'string' ? parseInt(player.rank) : player.rank,
            updatedAt: new Date(),
          },
          create: { ...player, rank: typeof player.rank === 'string' ? parseInt(player.rank) : player.rank },
        })),
      },
    },
  })
})
