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
- `pnpm prisma migrate dev` - Run database migrations (development)
- `pnpm db:migrate` - Prisma migrate wrapper with env loading
- `pnpm db:generate` - Generate ZenStack output to .generated/zenstack
- `zenstack generate` - Generate ZenStack schemas directly

### Testing
- `pnpm test` - Full automated test suite (manages Docker containers)
- `pnpm test:dev` - Start test server on port 3001 with test database
- `pnpm test:ci` - Build and preview for CI testing
- `pnpm test:db` - Start test database container
- `pnpm test:db:reset` - Reset test database
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
- **ZenStack**: Enhanced Prisma with additional features, schema located at `zenstack/schema.zmodel`
- **Models**: Account → League → Players/Snapshots hierarchy
- **Generated files**: ZenStack outputs to `.generated/zenstack`

### Frontend Architecture
- **Nuxt 4**: Vue.js framework with file-based routing
- **UI Framework**: Nuxt UI with custom theme colors
- **State Management**: Pinia with Pinia Colada for data fetching
- **Styling**: Tailwind CSS with custom components in `components/form/`

### Key Directories
- `app/` - Main application code (Nuxt 4 structure)
- `server/` - API routes and utilities
- `shared/` - Shared schemas and types
- `zenstack/` - Database schema and migrations
- `tests/` - Playwright test suites

### Data Flow
- ZenStack generates enhanced Prisma client
- Pinia Colada handles API state management
- Form validation using shared Zod schemas in `shared/schemas/`
- Team generation logic in `composables/useTeamShuffle.ts`

## Environment Setup

1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env` 
3. Set `DATABASE_URL` in `.env`
4. Run migrations: `pnpm prisma migrate dev`

## Testing Strategy

Tests run on port 3001 with separate test database. Use `pnpm test` for full automation or follow the manual setup sequence for development/debugging.

## Package Manager

Uses `pnpm` with lockfile. Node.js 22.x and pnpm 10.x required.