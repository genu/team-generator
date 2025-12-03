import z from "zod"

export type Snapshot = z.infer<typeof SnapshotSchema>
export type SnapshotData = z.infer<typeof SnapshotDataSchema>
export type SnapshotPlayer = z.infer<typeof SnapshotPlayerSchema>

export const SnapshotPlayerSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  rank: z.number().min(1).optional(),
  isActive: z.boolean().optional(),
  isGoalie: z.boolean().optional(),
})
export const SnapshotDataSchema = z.record(
  z.union([z.string(), z.number()]).transform((val) => {
    // Then transform to ensure it's a number
    const num = typeof val === "string" ? Number(val) : val

    if (isNaN(num)) throw new Error(`Invalid numeric key: ${val}`)

    return num
  }),
  z.array(SnapshotPlayerSchema),
)

export const SnapshotSchema = z.object({
  id: z.number().optional(),
  data: SnapshotDataSchema,
})
