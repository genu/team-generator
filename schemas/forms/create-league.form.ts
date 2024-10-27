import z from 'zod'

export type LeagueConfig = z.infer<typeof LeagueConfigSchema>

export const LeagueConfigSchema = z.object({
  teamCount: z.number(),
  rules: z
    .object({
      goaliesFirst: z.boolean().optional(),
      noBestGolieAndPlayer: z.boolean().optional(),
      keepGoalies: z.boolean().optional(),
      stefanMode: z.boolean().optional(),
      beniMode: z.boolean().optional(),
    })
    .optional(),
})

export const CreateLeagueFormSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character long'),
  accountId: z.number(),
  configuration: LeagueConfigSchema,
})
