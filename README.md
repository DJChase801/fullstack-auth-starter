# Fullstack Auth Starter

A reusable boilerplate for React + TypeScript + Express + Node + Postgres applications with authentication and org-aware data modeling.

## What is included

- React + Vite frontend in `apps/web`
- Express + TypeScript API in `apps/api`
- Prisma + Postgres schema with `users`, `organizations`, and `organization_memberships`
- Email/password auth with secure HTTP-only cookie sessions
- Registration flow that creates the first org and owner membership
- Seed script for a demo org and user

## Project structure

```text
fullstack-auth-starter/
  apps/
    api/   Express API, Prisma schema, seed script
    web/   React app and auth UI
  docker-compose.yml
  .env
  .env.example
```

## Start a new app from this boilerplate

Recommended flow: copy the code, give the new app its own Git history, then connect it to a new remote.

1. Clone this repo into a new folder:

   ```bash
   git clone <current-boilerplate-repo-url> my-new-app
   cd my-new-app
   ```

2. Remove the inherited Git history and initialize a new repo:

   ```bash
   rm -rf .git
   git init
   git branch -M main
   ```

3. Replace the starter branding values listed in the checklist below.

4. Reinstall dependencies so `package-lock.json` reflects any renamed packages:

   ```bash
   npm install
   ```

5. Create the first commit for the new app:

   ```bash
   git add .
   git commit -m "Initial commit from boilerplate"
   ```

6. Create a new empty repository on GitHub, then connect and push:

   ```bash
   git remote add origin git@github.com:<your-org>/<your-new-repo>.git
   git push -u origin main
   ```

If you want to keep the original commit history, skip the `rm -rf .git` and `git init` steps and replace the `origin` remote instead.

## Branding checklist

These are the main places to replace the starter's default branding and naming:

- `README.md`: update the app name and any starter-specific setup notes.
- `package.json`: replace the root package name `fullstack-auth-starter`.
- `apps/api/package.json` and `apps/web/package.json`: replace the workspace package names `@starter/api` and `@starter/web`. If you rename them, also update the workspace references in the root `package.json`.
- `apps/web/index.html`: replace the browser tab title `Fullstack Auth Starter`.
- `apps/web/src/pages/AuthPage.tsx`: replace the starter marketing copy on the auth screen.
- `apps/web/src/pages/DashboardPage.tsx`: replace the default post-login placeholder content.
- `.env.example` and `.env`: replace seeded values like `SEED_OWNER_NAME=Starter Owner`, `SEED_ORG_NAME=Starter Organization`, and the local database name `starter_app` if you want app-specific local data.
- `docker-compose.yml`: align `container_name` and `POSTGRES_DB` with the new app name if you do not want starter defaults locally.
- `apps/api/src/lib/jwt.ts`: rename the session cookie `starter_session` if you want browser cookies to be app-specific.

To catch leftovers quickly, run:

```bash
rg -n "Fullstack Auth Starter|fullstack-auth-starter|starter_app|@starter|starter_session|Starter " .
```

## Quick start

### Local development

1. Install dependencies:

   ```bash
   nvm use
   npm install
   ```

2. Start Postgres:

   ```bash
   npm run db:start
   ```

3. Apply the Prisma migration and seed demo data:

   ```bash
   npm run db:setup
   ```

4. Start the frontend and API together:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`.

Local development runs as two processes:

- Vite frontend on `http://localhost:5173`
- Express API on `http://localhost:4000`

Postgres is mapped to host port `5433` by default so the starter is less likely to collide with an existing local database.

## Vercel deployment

This repo is configured to deploy as a single Vercel project.

- Keep one GitHub repository
- Create one Vercel project from the repo root
- Use a hosted Postgres database in production

### How deployment differs from local development

- Local development still runs `apps/web` and `apps/api` as separate processes
- Vercel uses the `api/` directory entrypoint for the backend function
- The frontend is built into the root `public/` directory during the Vercel build
- Non-`/api` routes are rewritten to `index.html` so the React SPA handles routing

### Vercel settings

- Root Directory: `.`
- Framework Preset: `Other`
- Install Command: `npm install`
- Build Command: `npm run build:vercel`
- Output Directory: leave blank

### Production environment variables

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`

`DATABASE_URL` should be the pooled runtime connection string when your provider offers one. `DIRECT_URL` should be the direct connection string for Prisma CLI commands like migrations.

`CLIENT_ORIGIN` is only needed for local split-origin development. In the single-project Vercel deployment, the frontend and API share the same origin.

### Production database setup

After creating your hosted Postgres database, run the Prisma migration against it before using the deployed app:

```bash
npm run db:migrate -w @starter/api
```

## Default seeded credentials

- Email: `owner@example.com`
- Password: `ChangeMe123!`

## API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/health`

## Auth model

- Users authenticate with email and password.
- Sessions are stored as signed JWTs in an HTTP-only cookie.
- Org membership is modeled explicitly through `organization_memberships` so apps can grow into role-based or multi-org experiences cleanly.

## Useful scripts

- `npm run dev` starts both apps
- `npm run build` builds both apps
- `npm run build:vercel` builds the single-project Vercel deployment shape
- `npm run db:start` starts Postgres
- `npm run db:stop` stops Postgres
- `npm run db:setup` generates Prisma client, applies migrations, and seeds demo data

## Where to extend this starter

- Add feature modules under `apps/api/src/routes`
- Add domain tables to `apps/api/prisma/schema.prisma`
- Add authenticated pages in `apps/web/src/pages`
- Replace JWT cookie auth with a session store if you need revocation or device tracking
