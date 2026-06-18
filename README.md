# RollCall

Tire inventory and sales tracker for Vantyx. Built with Node, Express, PostgreSQL, and EJS, so it follows the same patterns as the CSE 340 project: routes call controllers, controllers call models, models run the actual SQL.

## What it does

- Tracks the full tire catalog: brand, size, type (new/used/retread), quantity on hand, price, and a low-stock threshold.
- Logs every sale, decrementing stock automatically.
- A single dashboard shows live stats: total tires in stock, how many are at or below their low-stock threshold, today's sales total, and current inventory value.
- A single shared password protects the whole app, since it's just you and your father-in-law using it.

## Local setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — your Postgres connection string
   - `APP_PASSWORD` — the shared login password
   - `SESSION_SECRET` — any long random string
   - `PORT` — defaults to 3000

3. Create the tables by running the schema against your database:
   ```
   psql "$DATABASE_URL" -f db/schema.sql
   ```
   (Or paste the contents of `db/schema.sql` into your database provider's SQL editor.)

4. Start the app:
   ```
   npm run dev
   ```

5. Visit `http://localhost:3000` and log in with your `APP_PASSWORD`.

## Setting up a free database on Neon

Render's free Postgres only allows one database per workspace and now expires after 30 days, which is what caused the original RouteCore database to get deleted. Neon doesn't have either limitation:

1. Create an account at neon.tech — no credit card required.
2. Create a new project for RollCall (separate from any class project databases, so they don't compete for the same slot).
3. Copy the connection string Neon provides into `DATABASE_URL` in your `.env` file.
4. Run `db/schema.sql` against it as described above.

## Deploying to Render

1. Push this project to a GitHub repo.
2. In Render, create a new Web Service connected to that repo.
3. Build command: `npm install`
   Start command: `npm start`
4. In Render's Environment tab, add `DATABASE_URL`, `APP_PASSWORD`, and `SESSION_SECRET` (same values as your `.env`), plus `NODE_ENV=production`.
5. Deploy. Free Render web services spin down after 15 minutes without traffic and take a few seconds to wake up on the next visit — that's normal, not a bug.

## Project structure

```
server.js            entry point, wires up middleware and routes
db/schema.sql         the two database tables
db/pool.js            PostgreSQL connection pool
models/               database queries (tireModel, saleModel)
controllers/          request handling logic
routes/                route definitions and validation rules
views/                  EJS templates (login, dashboard)
public/                CSS and the one small client-side JS file
```

## Notes on the login

Instead of a full sessions table with bcrypt like the CSE 340 project, login here is a single shared password checked against an HMAC-signed cookie. That keeps it simple for two users, and importantly it survives Render's free-tier server restarts, since there's no server-side session to lose. If RollCall ever grows to need individual accounts, that's a clean upgrade path later, not a rewrite.
