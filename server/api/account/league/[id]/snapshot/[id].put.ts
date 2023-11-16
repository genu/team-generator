export default defineEventHandler(async (event) => {
  const { snapshotId } = getQuery(event)
  const snapshotData = await readBody(event)

  return await $prisma.snapshot.update({
    data: {
      data: snapshotData as any,
      updatedAt: new Date(),
    },
    where: {
      id: parseInt(snapshotId as string),
    },
    select: {
      league: {
        select: {
          id: true,
        },
      },
    },
  })
})
