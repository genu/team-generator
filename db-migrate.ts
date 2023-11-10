import { PrismaClient, Prisma, type Player } from '@prisma/client'
import type { Data, Config, LeagueConfiguration, Player as LegacyPlayer } from './interfaces'
import { map } from 'lodash-es'

const $prisma = new PrismaClient()

const leagues = await $prisma.league.findMany()

const parseAsInt = (value: string | number | undefined) => {
  switch (typeof value) {
    case 'string':
      return parseInt(value)
    case 'number':
      return value
    default:
      return 0
  }
}

leagues.forEach(async (league) => {
  const data: Data = league.data as unknown as Data

  const configuration = {
    rules: data.config.rules as unknown as Prisma.JsonObject,
    teamCount: parseAsInt(data.config.teamCount),
  }

  await $prisma.account.create({
    data: {
      hash: league.hash!,
      leagues: {
        create: {
          name: data.config.leagueName!,
          hash: '--imported--',
          data: {},
          configuration,
          players: {
            createMany: {
              data: [
                ...map<LegacyPlayer, any>(data.players, (player) => ({
                  name: player.name,
                  rank: parseAsInt(player.rank),
                  isActive: player.yes || false,
                  isGoalie: player.gk || false,
                })),
              ],
            },
          },
          snapshots: {
            create: {
              data: data.snapshot as any,
            },
          },
        },
      },
    },
  })
})
