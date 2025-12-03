# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Team Generator is a Nuxt 4 application for creating balanced teams based on player rankings. It uses PostgreSQL for data persistence, ZenStack for enhanced Prisma schema management, and Pinia Colada for data fetching.

## Development Commands

### Core Development
- `pnpm dev` - Start development server on http://localhost:3000
- `pnpm start` - Start production server
- `pnpm generate` - Generate static site
- `pnpm preview` - Preview production build

### Database Management
- `pnpm db:migrate` - Run database migrations (development) - uses `zen migrate dev`
- `pnpm db:generate` - Generate ZenStack output with `--lite` flag to `.generated/zenstack` (runs on postinstall)
- `pnpm db:deploy` - Deploy migrations (production) - uses `zen migrate deploy`
- Direct ZenStack CLI usage:
  - `zen generate` - Generate ZenStack schemas directly
  - `zen migrate dev` - Run migrations with ZenStack directly
  - `zen migrate deploy` - Deploy migrations (production) directly

### Testing
- `pnpm test` - Full automated test suite (manages Docker containers)
- `pnpm test:dev` - Reset test database and start dev server on port 3001 with test database
- `pnpm test:server` - Preview production build with test database
- `pnpm test:db` - Stop and restart test database container (fresh start)
- `pnpm test:db:reset` - Reset test database (force reset migrations)
- `pnpm playwright test` - Run Playwright tests
- `pnpm playwright:ui` - Run Playwright with UI

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically

### Infrastructure
- `pnpm docker:up` - Start Docker containers
- `pnpm docker:down` - Stop Docker containers
- `pnpm clean` - Clean all generated files and node_modules

## Architecture

### Database Layer
- **ZenStack**: Enhanced Prisma with additional features, schema located at [zenstack/schema.zmodel](zenstack/schema.zmodel)
- **Models**: Account → League → Players/Snapshots hierarchy with cascade delete
- **Generated files**: ZenStack outputs to `.generated/zenstack` (both full and lite schemas)
- **Database client**: Server uses ZenStackClient with PostgreSQL via Kysely dialect in [server/utils/database.ts](server/utils/database.ts)
- **API endpoint**: ZenStack RPC handler at [server/api/model/[...].ts](server/api/model/[...].ts) provides model CRUD operations

### Frontend Architecture
- **Nuxt 4**: Vue.js framework with file-based routing in [app/pages/](app/pages/)
- **UI Framework**: Nuxt UI with custom theme colors (primary, secondary, tertiary, info, success, warning, error)
- **State Management**: Pinia with Pinia Colada for reactive data fetching
  - Global Pinia Colada options in [colada.options.ts](colada.options.ts)
- **Data Fetching**: `zenstack-pinia-colada` package integrates ZenStack with Pinia Colada queries
  - [app/composables/useClientQueries.ts](app/composables/useClientQueries.ts) wraps the integration
  - [app/components/provide/ZenstackContext.vue](app/components/provide/ZenstackContext.vue) provides query settings with custom fetch
  - [app/components/provide/AppContext.vue](app/components/provide/AppContext.vue) wraps the app with necessary providers
- **Styling**: Tailwind CSS
- **Forms**: Formwerk (`@formwerk/core`) for form handling with custom components in [layers/core/app/components/formwerk/](layers/core/app/components/formwerk/)

### Key Directories
- `app/` - Main application code (Nuxt 4 structure)
- `server/` - API routes and utilities
- `shared/` - Shared schemas and types
- `zenstack/` - Database schema and migrations
- `layers/core/` - Nuxt layer with core Formwerk components and configuration
- `tests/` - Playwright test suites
- `.generated/zenstack/` - Auto-generated ZenStack client code (do not edit)

### Data Flow
1. ZenStack generates enhanced Prisma client with type-safe models and RPC client
2. Frontend uses `useClientQueries()` to create reactive queries against `/api/model` endpoint
3. Pinia Colada manages query caching, invalidation, and optimistic updates
4. Form validation uses shared Zod schemas in [shared/schemas/](shared/schemas/)
5. Team generation algorithm in [app/composables/useTeamShuffle.ts](app/composables/useTeamShuffle.ts:48):
   - Optionally assigns goalies first (if `rules.goaliesFirst`)
   - Distributes players by rank (highest to lowest) across teams in round-robin fashion
   - Supports drag-and-drop player reordering with snapshot updates

## Environment Setup

1. Install dependencies: `pnpm install` (runs `nuxt:prepare` and `db:generate` on postinstall)
2. Copy `.env.example` to `.env`
3. Set `DATABASE_URL` in `.env` (PostgreSQL connection string)
4. Run migrations: `pnpm db:migrate`
5. Start development server: `pnpm dev`

## Testing Strategy

Playwright tests run on port 3001 with separate test database (`.env.test`). The test suite includes:
- [tests/manage-leagues.spec.ts](tests/manage-leagues.spec.ts) - League CRUD operations
- [tests/manage-squad.spec.ts](tests/manage-squad.spec.ts) - Player and team management

**Automated approach:** `pnpm test` handles Docker container lifecycle and runs full suite.

**Manual approach** (for debugging):
1. `pnpm test:db` - Start PostgreSQL container
2. `pnpm test:dev` - Run migrations and start dev server on port 3001
3. `pnpm playwright:ui` - Launch Playwright UI

## Important Notes

- **Package Manager**: pnpm with lockfile (Node.js 22.x, pnpm 10.x required)
  - Package manager is pinned via `packageManager` field in package.json
  - Uses `.npmrc` with `shamefully-hoist=true` configuration
- **Generated files**: Never edit files in `.generated/zenstack` - regenerate with `pnpm db:generate`
- **Database changes**: Always update [zenstack/schema.zmodel](zenstack/schema.zmodel), then run `pnpm db:migrate` or `zen migrate dev`
- **Nuxt config**: Module configuration at [nuxt.config.ts](nuxt.config.ts) with layer support in [layers/core/](layers/core/)
- **Custom form components**: Removed in favor of Nuxt UI native components and Formwerk integration in core layer
- **Test database**: Uses separate `.env.test` file - test commands automatically reset the database before running