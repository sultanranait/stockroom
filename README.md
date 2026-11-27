# Stockroom

Inventory management app: a Next.js dashboard backed by two Express services (auth and products) on PostgreSQL.

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, TanStack Query
- **Backend:** Node.js 22, Express 5, TypeScript, Sequelize 6, PostgreSQL 17
- **Tooling:** ESLint, Prettier, Jest + Supertest, Vitest, esbuild

## Architecture

```
Browser ──► Next.js (frontend)
              ├─ /api/auth/*      ──► auth service     :4001 ─┐
              └─ /api/products/*  ──► product service  :4002 ─┴─► PostgreSQL
```

The browser only talks to the Next.js origin. Next.js rewrites `/api/*` to the matching service, so the session cookie (`httpOnly`, `SameSite=Lax`) stays first-party and the browser never makes cross-origin calls.

Each backend service is a small Express app with the same layers:

| Layer          | Responsibility                                                  |
| -------------- | --------------------------------------------------------------- |
| `route.ts`     | URLs, authentication, role checks, request validation           |
| `controllers/` | read the validated request, call the service, send the response |
| `services/`    | business rules; throw `ApiError` for expected failures          |
| `repo/`        | all database queries (Sequelize)                                |

Code used by more than one service lives in `services/shared` and is imported through the `@shared/*` alias.

```
backend/
├── db/                    migrations, seeders, sequelize-cli config
├── services/
│   ├── shared/
│   │   ├── config/        env, database, logger, rate limits, app factory
│   │   ├── interfaces/    shared types
│   │   ├── middlewares/   authenticate, authorize, validate, error handler
│   │   ├── models/        Sequelize models and associations
│   │   └── utils/         ApiError, response helpers, JWT helpers
│   ├── auth/src/          app.ts, server.ts, route.ts, controllers/, services/, repo/
│   └── product/src/       app.ts, server.ts, route.ts, controllers/, services/, repo/
└── tests/

frontend/src/
├── app/                   routes: login, products list, new, edit
├── components/            ui/, layout/, products/
├── hooks/                 TanStack Query hooks
├── services/              typed API calls per resource
├── lib/                   fetch wrapper and ApiError
└── types/
```

Every endpoint answers with the same envelope:

```json
{
  "status": "success",
  "message": "Products fetched successfully",
  "statusCode": 200,
  "data": {}
}
```

Errors follow one shape too, with field-level `details` for validation failures:

```json
{
  "error": "badRequest",
  "message": "Validation errors",
  "statusCode": 400,
  "details": []
}
```

## Getting started

Requires Node.js 22.12+ and Docker (for PostgreSQL).

```bash
# 1. Database
docker compose up -d db

# 2. Backend
cd backend
cp .env.example .env        # set JWT_SECRET
npm install
npm run db:migrate
npm run db:seed
npm run dev                 # auth on :4001, products on :4002

# 3. Frontend, in a second terminal
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

The seed creates two users. Their password is `SEED_USER_PASSWORD` from `backend/.env`.

| Email               | Role  | Can                                     |
| ------------------- | ----- | --------------------------------------- |
| `admin@example.com` | admin | everything, including deleting products |
| `staff@example.com` | staff | view, create and edit products          |

## Scripts

| Backend                                            | Frontend                              |
| -------------------------------------------------- | ------------------------------------- |
| `npm run dev` runs both services with reload       | `npm run dev`                         |
| `npm run build` bundles each service into `dist/`  | `npm run build`                       |
| `npm run start:auth`, `npm run start:product`      | `npm start`                           |
| `npm test` (Jest + Supertest)                      | `npm test` (Vitest)                   |
| `npm run lint`, `typecheck`, `format`              | `npm run lint`, `typecheck`, `format` |
| `npm run db:migrate`, `db:migrate:undo`, `db:seed` |                                       |

## API

| Method | Path                                         | Access               |
| ------ | -------------------------------------------- | -------------------- |
| POST   | `/api/auth/login`                            | public, rate limited |
| POST   | `/api/auth/logout`                           | public               |
| GET    | `/api/auth/me`                               | signed in            |
| GET    | `/api/products?page=&limit=&search=&status=` | signed in            |
| GET    | `/api/products/:id`                          | signed in            |
| POST   | `/api/products`                              | signed in            |
| PATCH  | `/api/products/:id`                          | signed in            |
| DELETE | `/api/products/:id`                          | admin                |

Each service also serves `GET /health`.

## Environment

| Variable                                  | Where    | Notes                                         |
| ----------------------------------------- | -------- | --------------------------------------------- |
| `DATABASE_URL`                            | backend  | PostgreSQL connection string                  |
| `DB_SSL`                                  | backend  | `true` for hosted databases that require TLS  |
| `JWT_SECRET`                              | backend  | long random string                            |
| `JWT_EXPIRES_IN`                          | backend  | session length in seconds (default 86400)     |
| `CORS_ORIGIN`                             | backend  | only needed for direct cross-origin clients   |
| `AUTH_PORT`, `PRODUCT_PORT`               | backend  | defaults 4001 and 4002                        |
| `SEED_USER_PASSWORD`                      | backend  | password for the seeded demo users            |
| `AUTH_SERVICE_URL`, `PRODUCT_SERVICE_URL` | frontend | where `/api/*` is proxied; read at build time |
