import z from 'zod'

export type LeagueConfig = z.infer<typeof LeagueConfigSchema>
export type LeagueDTO = z.infer<typeof LeagueDTOSchema>
export type PlayerDTO = z.infer<typeof PlayerDTOSchema>

export const LeagueConfigSchema = z.object({
  teamCount: z.number(),
  rules: z
    .object({
      goaliesFirst: z.boolean().optional(),
      noBestGolieAndPlayer: z.boolean().optional(),
      keepGoalies: z.boolean().optional(),
    })
    .optional(),
})

export const LeagueDTOSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character long'),
  accountId: z.number(),
  configuration: LeagueConfigSchema,
})

export const PlayerDTOSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character long'),
  rank: z.number().min(1, 'Rank must be at least 1'),
  isActive: z.boolean(),
  isGoalie: z.boolean(),
})
