import { ZenStackClient } from "@zenstackhq/orm"
import { schema } from "#generated/zenstack/schema"
import { PostgresDialect } from "kysely"
import { Pool } from "pg"

const db = new ZenStackClient(schema, {
  dialect: new PostgresDialect({
    pool: new Pool({ connectionString: process.env.DATABASE_URL }),
  }),
})

export const $database = () => {
  return {
    db,
  }
}
