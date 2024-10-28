import { createEventHandler } from '@zenstackhq/server/nuxt'

export default createEventHandler({
  getPrisma: async (event) => $database().db,
})
