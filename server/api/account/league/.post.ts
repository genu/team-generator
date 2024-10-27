import { CreateLeagueFormSchema } from '~~/schemas/forms/create-league.form'

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, CreateLeagueFormSchema.parse)

  return await $prisma.league.create({
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
