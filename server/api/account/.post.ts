import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  return await $prisma.account.create({
    data: {
      hash: nanoid(),
    },
    select: {
      hash: true,
      id: true,
    },
  })
})
