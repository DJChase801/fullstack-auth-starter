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

Postgres is mapped to host port `5433` by default so the starter is less likely to collide with an existing local database.

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
- `npm run db:start` starts Postgres
- `npm run db:stop` stops Postgres
- `npm run db:setup` generates Prisma client, applies migrations, and seeds demo data

## Where to extend this starter

- Add feature modules under `apps/api/src/routes`
- Add domain tables to `apps/api/prisma/schema.prisma`
- Add authenticated pages in `apps/web/src/pages`
- Replace JWT cookie auth with a session store if you need revocation or device tracking
