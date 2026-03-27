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
- Vercel uses the root `app.ts` entrypoint for the Express app
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
