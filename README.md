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

The project uses Playwright for end-to-end testing with a separate test database.

### Automated Test Suite
To run the full test suite (handles Docker container setup automatically):

```bash
pnpm test
```

### Manual Test Setup (for debugging or VS Code Playwright extension)
For running tests manually, follow these steps in order:

1. Start the test database:
   ```bash
   pnpm test:db
   ```

2. Reset database and start the dev server on port 3001:
   ```bash
   pnpm test:dev
   ```
   This command automatically resets the test database before starting the server.

3. Run tests (in VS Code Playwright extension or command line):
   ```bash
   pnpm playwright test
   # OR use the interactive UI
   pnpm playwright:ui
   ```

### Other Test Commands
- `pnpm test:db:reset` - Reset the test database
- `pnpm test:server` - Preview production build with test database

