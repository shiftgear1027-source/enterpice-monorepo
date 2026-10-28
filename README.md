# Enterprise React Monorepo

Two independent React 19 apps (**Admin Panel**, **User Panel**) sharing eight internal packages, managed with **pnpm workspaces + Catalogs**.

| App         | Port | Roles allowed | Demo login                        |
| ----------- | ---- | ------------- | --------------------------------- |
| Admin Panel | 5173 | `admin`       | `admin@company.com` / `Admin@123` |
| User Panel  | 5174 | `user`        | `user@company.com` / `User@1234`  |

The demo runs against an **in-browser mock API** (see [Backend integration](#backend-integration)).

## Stack

React 19 · TypeScript (strict) · Vite 7 · pnpm 10 workspaces + catalogs · React Router 7 · Axios · Zustand · React Hook Form · Zod 4 · Tailwind CSS 4 · ESLint 9 · Prettier

## Setup

Requirements: Node ≥ 20.19 and pnpm ≥ 10.12 (`corepack enable` picks up the pinned version).

```bash
pnpm install
cp apps/admin-panel/.env.example apps/admin-panel/.env
cp apps/user-panel/.env.example  apps/user-panel/.env
```

## Commands (run from the repo root)

| Command                           | What it does                                            |
| --------------------------------- | ------------------------------------------------------- |
| `pnpm dev:admin` / `dev:user`     | Build shared packages, then start the app's Vite server |
| `pnpm dev:packages`               | Watch-compile shared packages (run alongside a dev app) |
| `pnpm build:admin` / `build:user` | Build shared packages + one app                         |
| `pnpm build`                      | Build all packages, then both apps                      |
| `pnpm typecheck`                  | Build packages, then type-check both apps               |
| `pnpm lint` / `pnpm lint:fix`     | ESLint (flat config in `config/eslint`)                 |
| `pnpm format` / `format:check`    | Prettier                                                |

## Structure

```text
apps/
  admin-panel/   sidebar dashboard: users CRUD, profile, settings
  user-panel/    top-nav storefront: products, profile, account settings
packages/
  shared-types/       User, Admin, ApiResponse, Pagination, Auth, error types
  shared-config/      constants, route maps, env parsing (createEnv)
  shared-utils/       formatters, string utils, debounce/throttle, storage, validators
  shared-validation/  Zod schemas (login, register, email, password, user form)
  shared-api/         Axios instance, interceptors, ApiError, services, mock adapter
  shared-hooks/       useDebounce, useLocalStorage, useToggle, usePagination, useOutsideClick, useAsync
  shared-auth/        Zustand auth store, login/logout/restoreSession, ProtectedRoute, RBAC
  shared-ui/          Button, Input, Select, Checkbox, Modal, Card, Table, Badge, Loader,
                      Pagination, Dropdown, Alert, Toast, PageHeader + theme.css tokens
config/
  eslint/ typescript/ prettier/   shared tooling configs
```

Dependency direction (no cycles): `types, config, utils, validation` → `api, hooks` → `auth, ui` → apps.

## Centralised dependency management

`pnpm-workspace.yaml` holds a `catalog:` with the version of every third-party dependency. Every `package.json` references it:

```json
"dependencies": { "react": "catalog:", "@company/shared-ui": "workspace:*" }
```

- **One place to upgrade**: bump a version in the catalog, run `pnpm install`.
- **One lockfile** (`pnpm-lock.yaml`) and one content-addressable store: identical versions are never downloaded or stored twice.
- **Why each app still has a `package.json`**: pnpm links dependencies per package. Each app (and each shared package) declares only what it directly imports, so nothing relies on undeclared parent-directory (phantom) resolution. Apps are also separate deployable units with their own scripts and Vite config. The catalog only centralises the _versions_.
- Shared packages declare `peerDependencies` (react, react-dom, react-router, zustand) with ranges, plus matching `devDependencies` from the catalog for building.
- Shared tooling (ESLint, Prettier, TypeScript for the root) is declared once in the root `package.json`.

## Shared package build strategy

Each package compiles with `tsc` to `dist/` (ESM + `.d.ts`) and exposes it through `exports`:

```json
"exports": { ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" } }
```

`pnpm --filter "./packages/*" build` runs in topological order from the dependency graph, so no manual ordering or TS project references are needed. Root scripts always build packages before running or type-checking apps. `shared-ui` additionally exports `./theme.css` (Tailwind v4 `@theme` tokens) that each app imports and may override (the User Panel overrides the brand colours with teal).

Using a package:

```tsx
import { Button, Card, Input } from '@company/shared-ui';
import { formatCurrency } from '@company/shared-utils';
import { usersApi } from '@company/shared-api';
```

## Authentication and security

- Preferred production approach: the backend sets an **httpOnly, Secure, SameSite cookie**. The Axios client already sends `withCredentials: true`, and the app restores sessions via `GET /auth/me`.
- Access tokens (if your API returns one) are kept **in memory only** (`tokenStorage`), never in `localStorage`. `localStorage` is used only for non-sensitive UI preferences.
- `ProtectedRoute` enforces authentication and role checks; each app passes its allowed roles. `login()` also rejects wrong-role accounts per app. **Client-side checks are UX only; enforce authorisation on the server.**

## Backend integration

All mock behaviour lives in `packages/shared-api/src/mock/`. To use a real backend:

1. Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=https://api.example.com` in each app's `.env`.
2. Implement the endpoints used in `packages/shared-api/src/services.ts` (`/auth/login`, `/auth/logout`, `/auth/me`, `/users`, `/products`), returning `{ success: true, data, message? }` and errors as `{ status, code, message, fieldErrors? }`.
3. Delete `src/mock/` and the demo-credential hints on the login pages.

## Environment variables

`apps/*/.env.example`: `VITE_API_BASE_URL`, `VITE_APP_NAME`, `VITE_APP_ENV`, `VITE_USE_MOCK_API`. Never commit `.env` files or secrets (they are git-ignored).

## Adding a new application

1. Copy `apps/user-panel` to `apps/<name>`; rename it to `@company/<name>` in `package.json` and change the Vite `port`.
2. Keep only the dependencies the app imports (use `catalog:` and `workspace:*`).
3. Add `dev:<name>` / `build:<name>` scripts to the root `package.json`.
4. Run `pnpm install`.

## Adding a new shared package

1. Copy a small package (e.g. `packages/shared-utils`) to `packages/shared-<name>`; rename to `@company/shared-<name>`.
2. Declare its dependencies (`catalog:` / `workspace:*`) and peers; export from `src/index.ts`.
3. Add `"@company/shared-<name>": "workspace:*"` to the apps that use it, then `pnpm install`.

## Push to GitHub

```bash
git init
git add .
git commit -m "chore: initial enterprise react monorepo"
git branch -M main
git remote add origin git@github.com:<your-org>/<your-repo>.git
git push -u origin main
```
