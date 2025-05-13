import { LeagueDTOSchema } from '#shared/schemas/forms'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, LeagueDTOSchema.parse)

  return await $database().db.league.create({
    data,
    select: {
      id: true,
      account: {
        select: {
          hash: true,
        },
      },
    },
  })
})
