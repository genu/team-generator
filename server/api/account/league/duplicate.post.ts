export default defineEventHandler(async (event) => {
  const { id: toDuplicate } = await readBody<{ id: string }>(event)

  const { db } = $database()

  const {
    id: _id,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    name,
    configuration,
    players,
    ...dataToDuplicate
  } = await db.league.findUniqueOrThrow({
    where: {
      id: parseInt(toDuplicate as string),
    },
    include: {
      players: true,
    },
  })

  return await $database().db.league.create({
    data: {
      ...dataToDuplicate,
      name: `${name} (copy)`,
      configuration: configuration,
      players: {
        createMany: {
          data: players.map(({ id: _id, leagueId: _leagueId, createdAt: _createdAt, updatedAt: _updatedAt, ...playerDataToCopy }) => ({
            ...playerDataToCopy,
          })),
        },
      },
    },
    select: {
      id: true,
      account: true,
    },
  })
})
