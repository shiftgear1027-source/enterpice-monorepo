# Contributing

## Workflow

1. Branch from `main` (`feat/…`, `fix/…`).
2. `pnpm install`, then `pnpm dev:admin` or `pnpm dev:user`.
3. Before opening a PR run: `pnpm lint && pnpm typecheck && pnpm build && pnpm format:check`.

## Rules

- **Dependencies**: add third-party versions to the `catalog:` in `pnpm-workspace.yaml`, then reference them with `catalog:`. Internal packages use `workspace:*`. Use pnpm only (no npm/yarn).
- Declare every dependency you import in that package's own `package.json`.
- Put code in a shared package only when at least two apps need it. Avoid circular package dependencies.
- TypeScript is strict: no `any`, use `import type` for types.
- Shared UI must be accessible (labels, focus states, ARIA roles) and responsive.
- Never commit secrets or `.env` files; never store credentials in `localStorage`.
- Changes to the mock API must keep the same contract the real backend will implement.
