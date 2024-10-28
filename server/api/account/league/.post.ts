import { LeagueSchema } from '~~/schemas/forms/create-league.form'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, LeagueSchema.parse)

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
