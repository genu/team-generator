import z from "zod"

export type PlayerEditForm = z.infer<typeof PlayerEditFormSchema>
export type PlayerAddForm = z.infer<typeof PlayerAddFormSchema>

export const PlayerEditFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  rank: z.number().min(1, "Minimum rank is 1").max(10, "Maximum rank is 10"),
  isActive: z.boolean(),
  isGoalie: z.boolean(),
})

export const PlayerAddFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
})
