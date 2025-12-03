import { createEventHandler } from "@zenstackhq/server/nuxt"
import { RPCApiHandler } from "@zenstackhq/server/api"
import { schema } from "#generated/zenstack/schema"

const { db } = $database()

// @ts-expect-error - ZenStack types are too deep for TS to infer
export default createEventHandler({
  apiHandler: new RPCApiHandler({ schema }),
  getClient: () => db,
})
