# IEEE YP Tunisia website

The website of the IEEE Young Professionals Tunisia Affinity Group: events, the team, key figures, and a board of IEEE scholarships, fellowships and internships. Everything on it is managed from a password-protected dashboard.

**Repository:** [nermine-ouada/yp-website](https://github.com/nermine-ouada/yp-website)

## Pages

| Page | What it shows |
| --- | --- |
| `/` | Hero and intro video, key figures, impact KPIs, opportunities and recent events, activities, collaborations, the team |
| `/events` | Upcoming and past events, collaborations and news, paginated. Each event has its own page at `/events/<web address>` |
| `/opportunities` | The opportunities board: search and filter by category and level |
| `/officers` | Officers, YP Task Force committees (as tabs) and ambassadors |
| `/about` | Mission, values and the global IEEE YP community |
| `/contact` | Email, phone and social links |
| `/links` | Link page for flyers and QR codes |
| `/admin` | The dashboard (see below) |

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, Server Actions) with React 19
- PostgreSQL ([Neon](https://neon.tech)) via [Prisma](https://www.prisma.io) 6
- Tailwind CSS 4, and `xlsx` for spreadsheet import and templates
- Hosted on [Vercel](https://vercel.com)

## Getting started

Requirements: Node.js 20+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run db:migrate           # apply Prisma migrations
npm run db:seed              # starting events and team (only fills empty tables)
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the dashboard.

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
| `npm run db:seed` | Fill the events and team tables with the starting content (only touches empty tables) |
| `npm run db:studio` | Open Prisma Studio |

## Dashboard

The dashboard at `/admin` manages all site content:

- **Overview:** counts and recent changes.
- **Opportunities** (`/admin/opportunities`): the opportunities board.
- **Events** (`/admin/events`): events, talks, challenges and announcements.
- **Team** (`/admin/team`): officers, YP Task Force members (grouped by committee) and ambassadors.
- **Site content** (`/admin/site`): home page text, key figures, impact KPIs, about, contact, footer links and the YouTube video.
- **Trash** (`/admin/trash`): deleted opportunities, events and people, until restored or deleted for good.

How it works:

- **Login:** one shared password and no user accounts. A session lasts **15 minutes** and isn't extended by activity.
- **Show / hide:** every list has a Hide/Show button. Hidden items disappear from the public site but stay in the dashboard, marked **Hidden**.
- **Delete is a soft delete.** Deleted items go to the trash, where they can be restored or permanently deleted.
- **Import:** opportunities, events and team members can each be imported from Excel or CSV (an Import button on each list). Download the template, fill it in, then review every row before saving. The team import also accepts the Task Force sheet as it is: it reads Full Name, Position, Committee, IEEE membership and IEEE Student Branch, and ignores other columns such as phone and email.
- **Images** can be uploaded from the forms (JPEG, PNG, WebP or GIF, up to 3 MB). They're stored in the database and served from `/api/uploads/<id>`. Images that ship with the site live in `public/yp/`.

## Project structure

```
prisma/              schema, migrations, seed.ts (starting content)
public/yp/           event posters and team photos
src/app/             public pages and /admin/*
src/app/admin/       dashboard pages + Server Actions (actions.ts, content-actions.ts)
src/components/      UI components (admin/ for dashboard-only ones)
src/data/            types and starting content used by the seed
src/lib/             auth (signed session cookie), Prisma client, data queries
src/proxy.ts         redirects unauthenticated /admin/* requests to login
```

## API & testing

- `GET /api/opportunities` is a public, read-only JSON endpoint with filters, for external integrations.
- [docs/API.md](docs/API.md) documents the opportunity Server Actions, the template route, authentication and the data model.
- [postman/ypboard.postman_collection.json](postman/ypboard.postman_collection.json) tests the opportunity endpoints end-to-end. It creates its own test rows and cleans them up afterwards. Set `adminPassword` in the collection variables before running it.

## Deployment

The app is hosted on Vercel, building from the repository root.

1. In the Vercel project settings, set `DATABASE_URL`, `ADMIN_PASSWORD` and `SESSION_SECRET`, and leave **Root Directory** empty.
2. The Vercel build doesn't run migrations. When `prisma/schema.prisma` changes, run `npm run db:migrate` against the production database (with `.env.local` pointing at it) **before** deploying. The new code expects the new columns, so deploying first breaks the site.
3. Run migrations over Neon's **direct** connection string (the hostname without `-pooler`). Through the pooler, Prisma's migration lock can stay stuck on an idle connection, and later migrations then time out (`P1002`).
