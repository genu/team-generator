import { usePrisma } from '@/server/utils'
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  const client = usePrisma()
  const body = await readBody(event)

  // update team
  if (body.team) {
    return await client.league.update({
      where: { hash: body.team },
      data: { data: body.data, updatedAt: new Date() },
    })
  } else {
    return await client.league.create({
      data: {
        data: body.data,
        hash: nanoid(),
        createdAt: new Date(),
      },
    })
  }
})
