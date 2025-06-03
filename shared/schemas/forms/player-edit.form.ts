import z from "zod"

export type PlayerEditForm = z.infer<typeof PlayerEditFormSchema>
export type PlayerAddForm = z.infer<typeof PlayerAddFormSchema>

export const PlayerEditFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  rank: z.number(),
  isActive: z.boolean(),
  isGoalie: z.boolean(),
})

export const PlayerAddFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
})
