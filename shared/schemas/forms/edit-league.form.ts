import z from "zod"

export type EditLeagueForm = z.infer<typeof EditLeagueFormSchema>

export const EditLeagueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
})
