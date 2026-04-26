# Contributing

Thanks for your interest in contributing to `@k9n/eslint-plugin-prefer-implicit`! This guide covers everything you need to get started.

## Prerequisites

- **Node.js** >= 24
- **npm** (comes with Node.js)

## Setup

```bash
git clone https://github.com/k9n-dev/eslint-plugin-prefer-implicit.git
cd eslint-plugin-prefer-implicit
npm install
```

## Project Structure

```
├── src/                  # Plugin source code (TypeScript)
│   ├── index.ts          # Plugin entry point
│   ├── rules/            # ESLint rule implementations
│   └── utils/            # Shared utilities (ARIA data, attribute helpers)
├── tests/                # Test files (Vitest)
│   ├── rules/            # Rule-specific tests (RuleTester)
│   ├── utils/            # Utility unit tests
│   └── integration/      # Plugin integration tests
├── docs/                 # Documentation site (Docusaurus)
│   ├── docs/             # Markdown content
│   └── docusaurus.config.ts
├── dist/                 # Compiled output (git-ignored)
├── .changeset/           # Changesets config
├── .github/workflows/    # CI/CD workflows
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Development Workflow

### Build

```bash
npm run build
```

Compiles TypeScript from `src/` to `dist/` using `tsc`.

### Test

```bash
npm test
```

Runs all tests with Vitest. Tests use ESLint's `RuleTester` for rule-level testing.

### Lint

```bash
npm run lint
```

## Adding a New Rule

1. **Create the rule** in `src/rules/<rule-name>.ts` following the existing rule structure:
   - Export a `Rule.RuleModule` with `meta` (type, docs, fixable, messages) and `create`
   - Use the shared utilities from `src/utils/` for attribute access and ARIA data lookups
   - Only autofix static values — skip dynamic bindings

2. **Register the rule** in `src/index.ts`:
   - Import the rule
   - Add it to the `rules` object
   - Add it to `configs.recommended` with `"warn"` severity

3. **Write tests** in `tests/rules/<rule-name>.test.ts`:
   - Use `RuleTester` with JSX parser options
   - Cover valid cases, invalid cases with autofix output, and dynamic value skip cases

4. **Update the ARIA data** in `src/utils/aria-data.ts` if the rule needs new lookup tables

5. **Add documentation** in `docs/docs/rules/<rule-name>.md`:
   - Why the rule exists
   - Incorrect and correct examples
   - Autofix behavior
   - Technical details
   - Add the rule to `docs/sidebars.ts`

6. **Update the README** with the new rule in the rules table

## Modifying ARIA Data

The lookup tables in `src/utils/aria-data.ts` are derived from the [ARIA in HTML](https://www.w3.org/TR/html-aria/) and [WAI-ARIA](https://w3c.github.io/aria/) specifications. When updating:

- Verify changes against the spec
- Update the corresponding unit tests in `tests/utils/aria-data.test.ts`
- Run the full test suite to check for regressions across all rules

## Documentation

The docs site uses [Docusaurus](https://docusaurus.io/) and lives in the `docs/` directory with its own `package.json`.

```bash
# Install docs dependencies (only needed once)
npm run docs:install

# Start dev server
npm run docs:start

# Production build
npm run docs:build
```

The docs deploy automatically to GitHub Pages on push to `main` via the `.github/workflows/docs.yml` workflow.

When changing rules or behavior, update the corresponding docs page in `docs/docs/`.

## Creating a Changeset

We use [Changesets](https://github.com/changesets/changesets) for versioning and changelogs. Every PR that changes user-facing behavior needs a changeset.

```bash
npx changeset
```

This will prompt you to:

1. Select the package (there's only one)
2. Choose the semver bump type:
   - **patch** — bug fixes, documentation updates
   - **minor** — new rules, new features
   - **major** — breaking changes (rule renames, removed rules, config changes)
3. Write a summary of the change

This creates a markdown file in `.changeset/` — commit it with your PR.

## Release Process

Releases are managed by maintainers:

```bash
# 1. Apply changesets: bumps version in package.json, updates CHANGELOG.md
npx changeset version

# 2. Review the changes
git diff

# 3. Commit the version bump
git add .
git commit -m "chore: release v<version>"

# 4. Publish to npm
npx changeset publish

# 5. Push the commit and tags
git push --follow-tags
```

## Code Style

- TypeScript with strict mode
- ESM (`"type": "module"` in package.json)
- Imports use `.js` extensions (Node.js ESM resolution)
- Rules use `messageId`-based reporting (no inline message strings)
- Autofix only removes attributes — never rewrites values

## Pull Request Guidelines

- One feature or fix per PR
- Include a changeset for user-facing changes
- All tests must pass (`npm test`)
- Build must succeed (`npm run build`)
- Update docs if behavior changes
