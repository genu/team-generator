import { createEventHandler } from "@zenstackhq/server/nuxt"

export default createEventHandler({
  getPrisma: async () => $database().db,
})
