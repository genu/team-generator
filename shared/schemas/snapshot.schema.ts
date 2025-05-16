import z from 'zod'
import { PlayerSchema } from '~~/.generated/zod/models'

export type SnapshotData = z.infer<typeof SnapshotDataSchema>
export type SnapshotPlayer = z.infer<typeof SnapshotPlayerSchema>

export const SnapshotPlayerSchema = PlayerSchema.pick({ id: true, name: true, rank: true, isActive: true, isGoalie: true })
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
