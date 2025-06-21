import z from "zod"

export type CreateLeagueForm = z.infer<typeof CreateLeagueFormSchema>

export const CreateLeagueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
})
