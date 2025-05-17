import z from 'zod'
import { PlayerSchema } from '~~/.generated/zod/models'

export type Snapshot = z.infer<typeof SnapshotSchem>
export type SnapshotData = z.infer<typeof SnapshotDataSchema>
export type SnapshotPlayer = z.infer<typeof SnapshotPlayerSchema>

export const SnapshotPlayerSchema = PlayerSchema.pick({ name: true, rank: true, isActive: true, isGoalie: true }).extend({
  id: z.number().optional(),
})
export const SnapshotDataSchema = z.record(
  z.union([z.string(), z.number()]).transform((val) => {
    // Then transform to ensure it's a number
    const num = typeof val === 'string' ? Number(val) : val

    if (isNaN(num)) {
      throw new Error(`Invalid numeric key: ${val}`)
    }
    return num
  }),
  z.array(SnapshotPlayerSchema),
)

export const SnapshotSchem = z.object({
  id: z.number().optional(),
  data: SnapshotDataSchema,
})
