export default defineEventHandler(async (event) => {
  const client = usePrisma()
  const query = getQuery(event)

  return await client.league.findUnique({
    where: { hash: query.teamHash as string },
  })
})
