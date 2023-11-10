import { PrismaClient } from '@prisma/client'
import type { Data } from './interfaces'
const $prisma = new PrismaClient()

const leagues = await $prisma.league.findMany()

leagues.forEach(async (league) => {
  const data: Data = league.data as unknown as Data
})
// const a = await $prisma.account.findMany()
// console.log(leagues)
