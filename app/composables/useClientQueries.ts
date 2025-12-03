import { useClientQueries as useZenstackClientQueries } from "zenstack-pinia-colada"

import { schema } from "#generated/zenstack/schema-lite"

export const useClientQueries = () => {
  const client = useZenstackClientQueries(schema)
  return client
}
