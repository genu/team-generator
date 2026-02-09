# Team Generator
Generate teams randomly based on rank. This is useful if you want to create lineups of balanced teams. See it in action [here](https://team-generator-production.up.railway.app)

![CleanShot 2023-01-10 at 09 46 22](https://user-images.githubusercontent.com/928780/211582978-803c3a4a-3ce9-4187-97e5-83897c8283cd.gif)


Make sure to install the dependencies:

```bash
pnpm install
```

## Setup

PostgreSQL is used for data storage. You can use Docker or a local PostgreSQL instance.

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/team_generator"
   ```

3. Install dependencies (this will also run Nuxt prepare and generate ZenStack schemas):
   ```bash
   pnpm install
   ```
   The `postinstall` script automatically runs `nuxt:prepare` and `db:generate`.

4. Run database migrations:
   ```bash
   pnpm db:migrate
   ```
   This uses `zen migrate dev` under the hood.

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Testing

The project uses Playwright for end-to-end testing with a separate test database (configured in `.env.test`). The Playwright `webServer` config handles building, migrating, and starting the preview server automatically.

### Automated Test Suite

```bash
pnpm test        # Run tests headlessly
pnpm test:ui     # Run tests with Playwright UI
```

Both commands manage the Docker container lifecycle and delegate server startup to Playwright's `webServer` config, which resets the test database, builds, and starts a preview server on port 3000.

### Development Testing

For iterating on tests with hot reload:

```bash
pnpm test:dev
```

This starts Docker, resets the test database, and launches the dev server with `.env.test`. Then in a separate terminal:

```bash
pnpm playwright test --ui
```

### Test Scripts

| Script | Description |
|---|---|
| `pnpm test` | Full automated suite (Docker + Playwright) |
| `pnpm test:ui` | Full suite with Playwright UI |
| `pnpm test:dev` | Dev server with test database for manual testing |
| `pnpm test:db:reset` | Reset test database (force reset migrations) |
| `pnpm test:build` | Build the app with test environment |
| `pnpm test:preview` | Preview the app with test environment |
| `pnpm docker:up` | Start test database container |
| `pnpm docker:down` | Stop test database container |

