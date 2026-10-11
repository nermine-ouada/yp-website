# The YP Pinboard

A pinboard of IEEE Young Professionals scholarships, fellowships and internships, curated by the YP Tunisia AG Task Force.

**Live:** https://ieee-yp-opportunities.vercel.app

- **Public board** (`/`): browse, search and filter opportunities across three tabs: Scholarships, PhD & Fellowships and Internships.
- **Admin portal** (`/admin`): a password-protected area to create, edit, trash and recover opportunities, and to bulk-import them from an Excel/CSV file.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, Server Actions) with React 19
- PostgreSQL ([Neon](https://neon.tech)) via [Prisma](https://www.prisma.io) 6
- Tailwind CSS 4, plus `three` for the 3D logo and `xlsx` for import/export
- Hosted on [Vercel](https://vercel.com)

## Getting started

Requirements: Node.js 20+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run db:migrate           # apply Prisma migrations
npm run dev
```

Open http://localhost:3000 for the board. The admin portal is at http://localhost:3000/admin.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. On Neon, use the **pooled** URL (the hostname contains `-pooler`) |
| `ADMIN_PASSWORD` | Shared password for `/admin` |
| `SESSION_SECRET` | Secret that signs the admin session cookie. Generate one with `openssl rand -hex 32` |

`.env.local` is git-ignored. Never commit real values.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply pending migrations (`prisma migrate deploy`) using `.env.local` |
| `npm run db:studio` | Open Prisma Studio |

## Admin portal

- **Login:** one shared password and no user accounts. A session lasts **15 minutes** and isn't extended by activity.
- **Show / hide:** each row on the dashboard has a Hide/Show button. A hidden opportunity disappears from the public board, the `/links` count and the public API, but stays in the admin, marked **Hidden**. The dashboard can filter by visibility.
- **Delete is a soft delete.** Deleted rows go to the trash at `/admin/trash`, where they can be recovered or permanently deleted.
- **Bulk import** at `/admin/import`: download the template, fill it in, upload it, then review each row before saving.

## Project structure

```
prisma/              schema, migrations
src/app/             routes: public board, /about, /links, /admin/*
src/app/admin/       admin pages + Server Actions (actions.ts)
src/components/      UI components (admin/ for portal-only ones)
src/lib/             auth (signed session cookie), Prisma client, data queries
src/middleware.ts    redirects unauthenticated /admin/* requests to login
```

## API & testing

- `GET /api/opportunities` is a public, read-only JSON endpoint with filters, for external integrations.
- [docs/API.md](docs/API.md) documents the Server Actions, the template route, authentication and the data model.
- [postman/ypboard.postman_collection.json](postman/ypboard.postman_collection.json) is a Postman collection that tests every endpoint end-to-end. It creates its own test rows and cleans them up afterwards. Set `adminPassword` in the collection variables before running it.

## Deployment

The app is hosted on Vercel. The source is at [nermine-ouada/yp-board](https://github.com/nermine-ouada/yp-board).

1. In the Vercel project settings, set `DATABASE_URL`, `ADMIN_PASSWORD` and `SESSION_SECRET`.
2. The Vercel build doesn't run migrations. When `prisma/schema.prisma` changes, run `npm run db:migrate` against the production database (with `.env.local` pointing at it) **before** deploying. The new code expects the new columns, so deploying first breaks the site.
3. Run migrations over Neon's **direct** connection string (the hostname without `-pooler`). Through the pooler, Prisma's migration lock can stay stuck on an idle connection, and later migrations then time out (`P1002`).
