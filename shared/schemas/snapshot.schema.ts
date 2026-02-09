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
export const SnapshotDataSchema = z.preprocess(
  (val) => {
    // Backward compat: convert {"0": [...], "1": [...]} record format to array
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const record = val as Record<string, unknown>
      const keys = Object.keys(record)
        .map(Number)
        .filter((n) => !isNaN(n))
        .sort((a, b) => a - b)
      return keys.map((k) => record[String(k)])
    }
    return val
  },
  z.array(z.array(SnapshotPlayerSchema)),
)

export const SnapshotSchema = z.object({
  id: z.number().optional(),
  data: SnapshotDataSchema,
})
