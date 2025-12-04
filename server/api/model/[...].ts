import { createEventHandler } from "@zenstackhq/server/nuxt"
import { RPCApiHandler } from "@zenstackhq/server/api"
import { schema } from "#generated/zenstack/schema"

const { db } = $database()

export default createEventHandler({
  apiHandler: new RPCApiHandler({ schema }),
  getClient: () => db,
})
