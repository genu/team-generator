import path from "path"
import { defineConfig } from "prisma/config"

export default defineConfig({
  earlyAccess: true,
  schema: path.join("zenstack", "schema.prisma"),
})
