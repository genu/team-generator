# Team Generator
Generate teams randomly based on rank. This is useful if you want to create linueups of balanced teams. See it in action [here](https://team-generator-production.up.railway.app)

![CleanShot 2023-01-10 at 09 46 22](https://user-images.githubusercontent.com/928780/211582978-803c3a4a-3ce9-4187-97e5-83897c8283cd.gif)


Make sure to install the dependencies:

```bash
pnpm install
```

## Setup
Postgress is used for data storage, so have a postgtres instance running

1. Rename `.env.example` to `.env`
2. Update `.env` with  a `DATABASE_URL` to your postgres instance.
3. Create a database and schema with:

```bash
npx prisma migrate dev
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev
```

## Testing

### Automated Test Suite
To run the full test suite (handles all setup automatically):

```bash
bun run test
```

### Manual Test Setup (for VS Code or local debugging)
For running tests manually or in VS Code, follow these steps in order:

1. Start the test database:
```bash
bun test:db
```

2. Run migrations and start the dev server on port 3001:
```bash
bun test:dev
```

3. Run tests (in VS Code Playwright extension or command line):
```bash
bun playwright test
# OR
bun playwright:ui
```

### Other Test Commands
- `bun test:db:reset` - Reset the test database
- `bun test:ci` - Build and preview mode for CI (alternative to test:dev)
