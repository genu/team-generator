# Changelog


## [1.3.0](https://github.com/genu/team-generator/compare/v1.2.0...v1.3.0) (2026-02-09)


### Features

* add ability to set team colors ([70ad4b7](https://github.com/genu/team-generator/commit/70ad4b7211ba6a4d868bba558835cf6adbc48c14))
* add CI and release workflows for integration testing and deployment ([d52711c](https://github.com/genu/team-generator/commit/d52711c2ccdca7d844a786c56051b6156b36fa3b))
* enhance team color functionality and UI updates across components ([73b62d8](https://github.com/genu/team-generator/commit/73b62d83357b6faf87592ea134e6bf49aa5fad23))
* implement legacy URL redirection and add tests for query parameter preservation ([c060b0b](https://github.com/genu/team-generator/commit/c060b0b9bc39ed18b58e97d2477b7e1c8d7a39a4))


### Bug Fixes

* correct formatting in nuxt.config.ts and streamline command in playwright.config.ts ([04fc3f4](https://github.com/genu/team-generator/commit/04fc3f4746a1fd083c6ff2543c577f34306b484e))
* remove conditional workers setting in Playwright configuration ([b6f26fc](https://github.com/genu/team-generator/commit/b6f26fcb7ed8efa71e48eca709e366d267fbf6f3))
* rename variables for clarity in duplicate league handler ([8970d0b](https://github.com/genu/team-generator/commit/8970d0b655cc459253d65c12baf15d45697f00b4))

## [1.2.0](https://github.com/genu/team-generator/compare/v1.1.0...v1.2.0) (2026-02-03)


### Features

* add PWA support ([51a8b8a](https://github.com/genu/team-generator/commit/51a8b8a722efc30d19bdf9c43fddc1b8c9261e28))
* add PWA support ([53538e0](https://github.com/genu/team-generator/commit/53538e084b55b22d784e14bb56638d896c740aa9))


### Bug Fixes

* **deps:** update all non-major dependencies ([3e05769](https://github.com/genu/team-generator/commit/3e05769b2e41f5d1fc824aad3bf54d0aa78ec30b))
* **deps:** update all non-major dependencies ([a68d2b2](https://github.com/genu/team-generator/commit/a68d2b2f9fbc974da914860180ae46c9356fcf3e))
* **deps:** update all non-major dependencies ([#337](https://github.com/genu/team-generator/issues/337)) ([a356ca5](https://github.com/genu/team-generator/commit/a356ca50bd13b997b523a6920130a9739a793e06))
* **deps:** update all non-major dependencies ([#359](https://github.com/genu/team-generator/issues/359)) ([512b2b2](https://github.com/genu/team-generator/commit/512b2b297a1c02e7259acff2fcb20cb22085e66c))
* **deps:** update all non-major dependencies ([#362](https://github.com/genu/team-generator/issues/362)) ([55e07b3](https://github.com/genu/team-generator/commit/55e07b3c8f102a015134f3c2b72cf83bcb3aea51))
* **deps:** update all non-major dependencies to v3.2.0 ([#348](https://github.com/genu/team-generator/issues/348)) ([98852f6](https://github.com/genu/team-generator/commit/98852f6b7d4377c8b845f383c9617f84b9464e43))
* **deps:** update all non-major dependencies to v3.2.1 ([#354](https://github.com/genu/team-generator/issues/354)) ([bd257e2](https://github.com/genu/team-generator/commit/bd257e2c3eb433c69cac146d4bfd77ef45885290))
* **deps:** update dependency pg to v8.17.1 ([#360](https://github.com/genu/team-generator/issues/360)) ([267901a](https://github.com/genu/team-generator/commit/267901a9403f73ad38f01acdb4460ed04f3226cd))
* issue with improper redirect when using hashes ([fad2f97](https://github.com/genu/team-generator/commit/fad2f9760e58f457a3b8e5345ca869350016e108))

## v1.1.0


### 🚀 Enhancements

- Add color mode preference to nuxt.config.ts ([a7872bd](https://github.com/genu/team-generator/commit/a7872bd))
- Update nuxt configuration and dependencies ([0509f53](https://github.com/genu/team-generator/commit/0509f53))
- Add disableKeyboardInput prop to input-number component and implement readonly behavior; refactor league edit functionality to utilize useLeague composable ([bc9b540](https://github.com/genu/team-generator/commit/bc9b540))
- Add disable-keyboard-input attribute to input-number component in league edit view ([0493ba5](https://github.com/genu/team-generator/commit/0493ba5))
- Add viewport meta tag for responsive design in app.vue ([5757e49](https://github.com/genu/team-generator/commit/5757e49))
- Add PiniaColada options and integrate @pinia/colada modules in nuxt.config.ts ([104e408](https://github.com/genu/team-generator/commit/104e408))

### 🩹 Fixes

- Include the first team to choose in the snapshot ([ac7b76a](https://github.com/genu/team-generator/commit/ac7b76a))
- Spacing issues ([fd0a677](https://github.com/genu/team-generator/commit/fd0a677))
- **deps:** Update dependency @vueuse/components to v10.6.0 ([a94f09f](https://github.com/genu/team-generator/commit/a94f09f))
- Correct comment formatting in migration_lock.toml ([ef3bbca](https://github.com/genu/team-generator/commit/ef3bbca))
- Add click handler to EmptyStateButton for league player addition ([0b66c35](https://github.com/genu/team-generator/commit/0b66c35))
- Update team number selection method in squad management tests ([5593521](https://github.com/genu/team-generator/commit/5593521))
- Update snapshot ordering and improve league save logic ([3b9e18c](https://github.com/genu/team-generator/commit/3b9e18c))
- **deps:** Update all non-major dependencies ([#281](https://github.com/genu/team-generator/pull/281))
- **deps:** Update dependency @formwerk/core to ^0.11.0 ([#284](https://github.com/genu/team-generator/pull/284))
- **deps:** Update all non-major dependencies to v2.16.1 ([#285](https://github.com/genu/team-generator/pull/285))
- **deps:** Update all non-major dependencies to v2.17.0 ([#292](https://github.com/genu/team-generator/pull/292))
- **deps:** Update all non-major dependencies to v2.17.1 ([#293](https://github.com/genu/team-generator/pull/293))
- **deps:** Update all non-major dependencies to v2.17.2 ([#298](https://github.com/genu/team-generator/pull/298))
- **deps:** Update dependency @vueuse/components to v13.6.0 ([#299](https://github.com/genu/team-generator/pull/299))
- **deps:** Update all non-major dependencies to v2.18.0 ([#303](https://github.com/genu/team-generator/pull/303))
- **deps:** Update all non-major dependencies to v2.18.1 ([#305](https://github.com/genu/team-generator/pull/305))
- **deps:** Update all non-major dependencies ([#306](https://github.com/genu/team-generator/pull/306))
- **deps:** Update dependency @vueuse/components to v13.8.0 ([#308](https://github.com/genu/team-generator/pull/308))
- Remove unused social-clients directory and add alias for generated files ([2d844b1](https://github.com/genu/team-generator/commit/2d844b1))
- **deps:** Update all non-major dependencies ([#310](https://github.com/genu/team-generator/pull/310))
- Add name attribute to teamCount for formwerk compatibility ([0ac2856](https://github.com/genu/team-generator/commit/0ac2856))

### 💅 Refactors

- Update Node.js version to 22.x and package dependencies ([a29dcab](https://github.com/genu/team-generator/commit/a29dcab))
- Remove unused files and update configurations ([71cc1b9](https://github.com/genu/team-generator/commit/71cc1b9))
- Update confirm dialog component and replace VueFinalModal with UModal ([a920582](https://github.com/genu/team-generator/commit/a920582))
- Remove unused line and update dropdown menu item property ([5d8ca1a](https://github.com/genu/team-generator/commit/5d8ca1a))
- Streamline player management and enhance form validation in league edit component ([58e5586](https://github.com/genu/team-generator/commit/58e5586))
- Simplify league creation logic and enhance form validation ([9e010e9](https://github.com/genu/team-generator/commit/9e010e9))
- Remove unused type definitions and emits from league edit component ([0f81ca8](https://github.com/genu/team-generator/commit/0f81ca8))
- Add color and formField configuration to app settings ([349b7bf](https://github.com/genu/team-generator/commit/349b7bf))
- Remove unused input components from form module ([2a6a029](https://github.com/genu/team-generator/commit/2a6a029))
- Enhance modal component by adding ui prop support and improving size class handling ([5365f9a](https://github.com/genu/team-generator/commit/5365f9a))
- Update player table bindings to use row.original for better data handling ([0be474d](https://github.com/genu/team-generator/commit/0be474d))
- Streamline player management by removing unused forms and integrating new player form handling ([635edc0](https://github.com/genu/team-generator/commit/635edc0))
- Add forms directory to imports for improved module accessibility ([ad45cc1](https://github.com/genu/team-generator/commit/ad45cc1))
- Add useEditLeagueForm and useNewPlayerForm for league and player management ([5ae840b](https://github.com/genu/team-generator/commit/5ae840b))
- Integrate player form handling into league edit component for improved player management ([914b364](https://github.com/genu/team-generator/commit/914b364))
- Update League model to make configuration field non-nullable ([2084aaf](https://github.com/genu/team-generator/commit/2084aaf))
- Define LeagueRules and LeagueConfiguration types for improved league structure ([67f530f](https://github.com/genu/team-generator/commit/67f530f))
- Add migration to make League.configuration column non-nullable ([57a18ed](https://github.com/genu/team-generator/commit/57a18ed))
- Remove unused account and league snapshot API endpoints and composables ([cb3dc83](https://github.com/genu/team-generator/commit/cb3dc83))
- Streamline league creation form and add share league component ([95660f0](https://github.com/genu/team-generator/commit/95660f0))
- Update league management components and schemas for improved structure and functionality ([931ff89](https://github.com/genu/team-generator/commit/931ff89))
- Update snapshot handling and player types for improved data integrity ([5443e3d](https://github.com/genu/team-generator/commit/5443e3d))
- Enhance player management and team shuffle functionality ([60fedcb](https://github.com/genu/team-generator/commit/60fedcb))
- Remove form initialization from league and player edit forms for cleaner code ([95a61b6](https://github.com/genu/team-generator/commit/95a61b6))
- Update league creation and management functionality with improved error handling and test identifiers ([4146c0b](https://github.com/genu/team-generator/commit/4146c0b))
- Enhance team display by using team names instead of numbers and add team name prop ([35e9be6](https://github.com/genu/team-generator/commit/35e9be6))
- Switch from Node.js to Bun for Playwright test workflow ([b633b76](https://github.com/genu/team-generator/commit/b633b76))
- Enhance league and team components with shirt color functionality and validation ([5ae0e64](https://github.com/genu/team-generator/commit/5ae0e64))
- Update team color handling and validation in league forms and components ([5348804](https://github.com/genu/team-generator/commit/5348804))
- Switch from pnpm to bun for build and migration commands ([630508b](https://github.com/genu/team-generator/commit/630508b))
- Update e2e test ([d725bc0](https://github.com/genu/team-generator/commit/d725bc0))
- Update web server command in Playwright config to use 'bun test:dev' ([4c5b660](https://github.com/genu/team-generator/commit/4c5b660))
- Uncomment dotfiles exclusion in VSCode settings ([5b5a66b](https://github.com/genu/team-generator/commit/5b5a66b))
- Remove unused league form schemas and update form validation with Zod ([6afaa51](https://github.com/genu/team-generator/commit/6afaa51))
- Update league form ID and reset logic in edit component ([2c5ad74](https://github.com/genu/team-generator/commit/2c5ad74))
- Update VSCode settings to exclude node_modules and config files ([0a0ebb1](https://github.com/genu/team-generator/commit/0a0ebb1))
- Reorganize schema files and update package configuration for ZenStack integration ([68adf03](https://github.com/genu/team-generator/commit/68adf03))
- Update VSCode settings to exclude schema.prisma files ([8e11fba](https://github.com/genu/team-generator/commit/8e11fba))
- Enhance checkbox and switch components to accept value and modelValue props ([6673804](https://github.com/genu/team-generator/commit/6673804))
- Streamline player data handling and save logic in account page ([ce9d4a3](https://github.com/genu/team-generator/commit/ce9d4a3))
- Optimize league update logic to only include changed players and latest snapshot ([cf72e9b](https://github.com/genu/team-generator/commit/cf72e9b))
- Enhance useTeamShuffle to manage latest unsaved snapshot updates during team modifications ([73fcef2](https://github.com/genu/team-generator/commit/73fcef2))
- **schema:** Comment out unused plugins and permissions in schema.zmodel ([f6443fa](https://github.com/genu/team-generator/commit/f6443fa))
- Streamline dialog open method and enhance league deletion confirmation flow ([02eda59](https://github.com/genu/team-generator/commit/02eda59))
- Update league deletion logic to auto-select next league and prevent deletion of the last league ([1160583](https://github.com/genu/team-generator/commit/1160583))
- Improve animation duration and switch size in league edit modal ([f0af4e1](https://github.com/genu/team-generator/commit/f0af4e1))

### 📖 Documentation

- Add CLAUDE.md for project guidance and setup instructions ([4234cdb](https://github.com/genu/team-generator/commit/4234cdb))

### 🏡 Chore

- Refactor and clean up ([23054c8](https://github.com/genu/team-generator/commit/23054c8))
- Update dependencies in package.json ([ce57d08](https://github.com/genu/team-generator/commit/ce57d08))
- Update dependencies for Nuxt and Zod to latest versions ([9f3ec61](https://github.com/genu/team-generator/commit/9f3ec61))
- Update dependencies for @tanstack/vue-query, zod, and @types/node to latest versions ([6cf43cd](https://github.com/genu/team-generator/commit/6cf43cd))
- Update dependencies for @playwright/test, @types/node, eslint, and zod to latest versions ([532dd80](https://github.com/genu/team-generator/commit/532dd80))
- Clean up .env.test by removing unused analytics and floatie configurations ([f24f698](https://github.com/genu/team-generator/commit/f24f698))
- Add @nuxt/test-utils module and update test configurations for improved testing setup ([9e4fff1](https://github.com/genu/team-generator/commit/9e4fff1))
- Update build command in railway.toml and upgrade prisma dependencies in package.json ([c5ee165](https://github.com/genu/team-generator/commit/c5ee165))
- Upgrade dependencies for @prisma/client, @tanstack/vue-query, @vueuse components, and zenstack to latest versions; update start and preview scripts in package.json ([6c3abb8](https://github.com/genu/team-generator/commit/6c3abb8))
- Add caching for Playwright browsers in GitHub Actions workflow ([654351e](https://github.com/genu/team-generator/commit/654351e))
- Update Playwright caching key in GitHub Actions workflow to use bun.lock only ([2e54fdf](https://github.com/genu/team-generator/commit/2e54fdf))
- Remove heroicons in favor or `ph` ([9fd4ba8](https://github.com/genu/team-generator/commit/9fd4ba8))
- Remove methodology ([3ada2b4](https://github.com/genu/team-generator/commit/3ada2b4))
- Cleanup ([666b81f](https://github.com/genu/team-generator/commit/666b81f))
- Update cache action to actions/cache@v4 ([734492f](https://github.com/genu/team-generator/commit/734492f))
- Refine caching strategy in setup action for pnpm ([72e737c](https://github.com/genu/team-generator/commit/72e737c))
- Remove version specification for pnpm in setup action ([56d59d3](https://github.com/genu/team-generator/commit/56d59d3))
- **tsconfig:** Update TypeScript configuration to use project references for improved modularity ([08ae2f0](https://github.com/genu/team-generator/commit/08ae2f0))
- Update readme ([8265158](https://github.com/genu/team-generator/commit/8265158))
- Bump dependencies ([71f33da](https://github.com/genu/team-generator/commit/71f33da))
- Update start and preview scripts, migrate to zen for database commands, and bump kysely version ([9f7ce6b](https://github.com/genu/team-generator/commit/9f7ce6b))
- Update nuxt.config.ts to streamline imports and alias configuration ([f5f8f46](https://github.com/genu/team-generator/commit/f5f8f46))
- Refactor formwerk integration ([9e52cf7](https://github.com/genu/team-generator/commit/9e52cf7))
- Use providers ([59b267e](https://github.com/genu/team-generator/commit/59b267e))
- Deprecate custom empty state in favor of NuxtUI component ([460bbc5](https://github.com/genu/team-generator/commit/460bbc5))
- Remove formwerk wrappers ([286d184](https://github.com/genu/team-generator/commit/286d184))
- Cleanup and refactor ([f4a7660](https://github.com/genu/team-generator/commit/f4a7660))
- Update documentation for database management and testing setup ([30622b2](https://github.com/genu/team-generator/commit/30622b2))
- Add mcp configuration for nuxt-ui server ([0ecaa00](https://github.com/genu/team-generator/commit/0ecaa00))
- Update package.json and pnpm-lock.yaml to include changelogen and adjust test scripts ([4d25afe](https://github.com/genu/team-generator/commit/4d25afe))
- Remove unused leagueId and accountId from updateLeagueAsync data ([7bf8c10](https://github.com/genu/team-generator/commit/7bf8c10))
- Update database URL in test environment configuration ([bc9af40](https://github.com/genu/team-generator/commit/bc9af40))
- Update Playwright workflow to build test application and adjust web server command for CI ([48fe9a5](https://github.com/genu/team-generator/commit/48fe9a5))
- Update Playwright workflow to use pnpm for building test application ([3ec83f4](https://github.com/genu/team-generator/commit/3ec83f4))
- Update build command in Playwright workflow to use correct database generation script ([e18fa58](https://github.com/genu/team-generator/commit/e18fa58))
- Rename build step to clarify database setup and application build process ([4cc4dd1](https://github.com/genu/team-generator/commit/4cc4dd1))
- Remove database setup and build step from Playwright workflow ([e866d7f](https://github.com/genu/team-generator/commit/e866d7f))
- Update web server command in Playwright config for local development ([777fd14](https://github.com/genu/team-generator/commit/777fd14))
- Update test scripts to remove redundant zen generate command ([0681a79](https://github.com/genu/team-generator/commit/0681a79))
- Update test scripts and Playwright config for improved local development ([137c888](https://github.com/genu/team-generator/commit/137c888))
- Add build step for Nuxt application in Playwright workflow ([62e7425](https://github.com/genu/team-generator/commit/62e7425))
- Add ZenStack schema generation step in Playwright workflow ([d94966a](https://github.com/genu/team-generator/commit/d94966a))
- Update Playwright workflow to include Nuxt preparation step ([3139d75](https://github.com/genu/team-generator/commit/3139d75))
- Update documentation for database management and testing commands ([0f44742](https://github.com/genu/team-generator/commit/0f44742))
- Add database migration step in Playwright workflow ([7e55e84](https://github.com/genu/team-generator/commit/7e55e84))
- Update query cache key to use correct casing and enhance league duplication tests ([f0fb94c](https://github.com/genu/team-generator/commit/f0fb94c))
- Increase retry count for Playwright tests in CI environment ([f389e4f](https://github.com/genu/team-generator/commit/f389e4f))
- Update start command to include database deployment step ([f8c24fd](https://github.com/genu/team-generator/commit/f8c24fd))

### ✅ Tests

- Improve reliability of player count check in squad management tests ([fee4ce7](https://github.com/genu/team-generator/commit/fee4ce7))
- Add new tests for team shuffle and save functionality in squad management ([d762cc3](https://github.com/genu/team-generator/commit/d762cc3))
- Enhance save confirmation and refresh logic in squad management ([e1ac21e](https://github.com/genu/team-generator/commit/e1ac21e))
- Enhance team shuffle and save logic for stability and visibility ([f7d253f](https://github.com/genu/team-generator/commit/f7d253f))
- Ensure team arrangement matches saved state after shuffle and refresh ([b298891](https://github.com/genu/team-generator/commit/b298891))

### 🎨 Styles

- Standardize import syntax in main.css ([c688d42](https://github.com/genu/team-generator/commit/c688d42))

### ❤️ Contributors

- Eugen Istoc <eugenistoc@gmail.com>
