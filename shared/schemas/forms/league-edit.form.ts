import z from "zod"
import { PlayerEditFormSchema } from "./player-edit.form"
import { ShirtColor } from "#generated/zenstack/models"

export type LeagueEditForm = z.infer<typeof LeagueEditFormSchema>
export type LeagueEditOptionsForm = z.infer<typeof LeagueEditOptionsFormSchema>

export const ShirtColorEnum = z.enum([
  ShirtColor.Black,
  ShirtColor.Blue,
  ShirtColor.Cyan,
  ShirtColor.Gray,
  ShirtColor.Green,
  ShirtColor.Magenta,
  ShirtColor.Red,
  ShirtColor.White,
  ShirtColor.Yellow,
])

export const LeagueEditOptionsFormSchema = z.object({
  name: z.string().optional(),
  teamCount: z.number().min(2, "At least 2 teams required").max(20, "Maximum 20 teams").default(2),
  useTeamColors: z.boolean().optional(),
  teamColors: z.array(ShirtColorEnum).optional(),
})

export const LeagueEditRulesFormSchema = z.object({
  goaliesFirst: z.boolean().optional(),
  noBestGoalieAndPlayer: z.boolean().optional(),
  keepGoalies: z.boolean().optional(),
})

export const LeagueEditFormSchema = z.object({
  id: z.number().optional(),
  options: LeagueEditOptionsFormSchema,
  rules: LeagueEditRulesFormSchema.default({}),
  players: z.array(PlayerEditFormSchema),
})
