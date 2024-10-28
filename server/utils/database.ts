import { enhance } from '@zenstackhq/runtime'
import { PrismaClient } from '@prisma/client'

const sudo = new PrismaClient({
  log: import.meta.dev ? ['info'] : [],
})

export const $database = () => {
  const db = enhance(sudo, undefined, { logPrismaQuery: false })

  return {
    sudo,
    db,
  }
}
