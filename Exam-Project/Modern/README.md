# WDT E-Commerce Admin — Modern Stack

A complete rebuild of the Exam Project using a modern full-stack architecture.

## Stack

| Old | New |
|-----|-----|
| Express.js | SvelteKit |
| EJS templates | Svelte components |
| Sequelize ORM | Prisma |
| MySQL | SQLite |
| Manual validation | Zod |
| jsonwebtoken | jose |
| JavaScript | TypeScript |
| Bootstrap | Custom CSS |

## Features

- JWT auth via httpOnly cookie (Admin only)
- Products — CRUD, soft-delete, restore, hard-delete
- Brands — CRUD
- Categories — CRUD
- Users — list, edit role & membership
- Orders — list, update status
- Sidebar navigation with active state
- Dark theme

## Running locally

```bash
npm install
npm run db:push    # creates SQLite database
npm run db:seed    # seeds demo data
npm run dev        # starts dev server at http://localhost:5173
```

**Demo credentials:** `admin@noroff.no` / `P@ssword2023`

## Production build

```bash
npm run build
node build          # starts production server at http://localhost:3000
```

## Deploy to Railway

1. Push to GitHub
2. Create new Railway project from repo
3. Set env vars: `DATABASE_URL=file:./dev.db`, `JWT_SECRET=<random-string>`, `PORT=3000`
4. Add build command: `npm run build` and start command: `node build`
