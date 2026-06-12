# Uncommon Ground Utah — Full‑Stack

Premium small‑batch jerky storefront, now split into a **React front‑end** and a
**Node/Express + PostgreSQL back‑end**. The catalog, collections, contact form,
newsletter, and user accounts are served dynamically from the API (with a bundled
static fallback so the UI still renders if the API is offline).

```
UncommonGround/
├─ Frontend/   ← Vite + React 19 app (own package.json)
├─ Backend/    ← Express + PostgreSQL API (own package.json)
└─ Resources/  ← original brand media / design assets
```

## Prerequisites

- Node.js 18+
- PostgreSQL 13+ running locally (or a hosted Postgres URL)

## 1. Backend setup

```bash
cd Backend
npm install
cp .env.example .env   # then edit values (a working .env is already included for local dev)
```

Create the database once (matches the default `DATABASE_URL`):

```bash
createdb uncommon_ground
# or in psql:  CREATE DATABASE uncommon_ground;
```

Start the API. On boot it **auto‑creates all tables** and **seeds** the default
admin, products, and collections:

```bash
npm run dev      # http://localhost:4000  (auto‑reload)
# or
npm start
```

You can re‑seed at any time with `npm run seed`.

### Default admin credentials

| Field    | Value                       |
| -------- | --------------------------- |
| Email    | `admin@uncommonground.com`  |
| Password | `Admin@12345`               |

These come from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `Backend/.env` — change them
for any real deployment. The admin is created automatically on first run.

### API endpoints

| Method | Path                     | Access | Purpose                       |
| ------ | ------------------------ | ------ | ----------------------------- |
| POST   | `/api/auth/signup`       | public | Create a customer account     |
| POST   | `/api/auth/login`        | public | Log in, returns a JWT         |
| GET    | `/api/auth/me`           | auth   | Current user                  |
| GET    | `/api/products`          | public | List products                 |
| GET    | `/api/products/:slug`    | public | Product detail                |
| POST   | `/api/products`          | admin  | Create product                |
| PUT    | `/api/products/:id`      | admin  | Update product                |
| DELETE | `/api/products/:id`      | admin  | Deactivate product            |
| GET    | `/api/collections`       | public | List collections              |
| POST   | `/api/collections`       | admin  | Create collection             |
| PUT    | `/api/collections/:id`   | admin  | Update collection             |
| DELETE | `/api/collections/:id`   | admin  | Delete collection             |
| POST   | `/api/contact`           | public | Submit contact form           |
| GET    | `/api/contact`           | admin  | View submissions              |
| POST   | `/api/newsletter`        | public | Subscribe                     |
| GET    | `/api/newsletter`        | admin  | View subscribers              |

Admin routes expect an `Authorization: Bearer <token>` header from an account
whose `role` is `admin`.

## 2. Frontend setup

```bash
cd Frontend
npm install
npm run dev      # http://localhost:5173
```

`Frontend/.env` points the app at the API:

```
VITE_API_URL=http://localhost:4000
```

The header now includes **Log In / Sign Up** buttons (and a logged‑in state with
log out). Products, collections, the contact form, and newsletter all talk to the
backend; if the API is unreachable the site falls back to the bundled catalog.

## 3. Admin dashboard

Log in with the default admin account, then click **Dashboard** in the header (or
visit `/admin`). Admin uses a **completely separate UI** — its own sidebar layout
with no storefront nav/footer. The route is protected; non‑admins are redirected.

Sections:

- **Overview** — KPI cards (revenue, units sold, avg order value, products),
  revenue‑over‑time chart, and top sellers, all filtered by date range.
- **Sales** — product sales analytics: revenue/units by product, a daily revenue
  chart, and a filterable/sortable product breakdown table.
- **Orders** — every order with filters for date range, status, and a name/email
  search.
- **Products** — add, edit, delete, publish/unpublish, with search + status +
  flavor filters (every field: price, image, flavor notes, nutrition, etc.).
- **Categories** — create, edit, and delete flavor collections.
- **Inbox** — contact‑form submissions and newsletter subscribers.

Everything is **dynamic and near real‑time**: the dashboard re‑polls on an
interval and on tab focus, admin edits push straight to PostgreSQL, and the public
storefront refetches automatically so changes appear without a manual reload.

### Orders & sales data

- The cart's **checkout** creates a real order via `POST /api/orders` (prices are
  recomputed server‑side; login required). Each order immediately feeds the sales
  analytics.
- On first run the backend seeds ~90 sample historical orders so the dashboard has
  data to display out of the box.

### Order/analytics endpoints

| Method | Path                  | Access | Purpose                              |
| ------ | --------------------- | ------ | ------------------------------------ |
| POST   | `/api/orders`         | public | Create an order (checkout)           |
| GET    | `/api/orders`         | admin  | List orders (filters: status/date/q) |
| GET    | `/api/orders/stats`   | admin  | Aggregated sales (filters: date)     |

## 4. Email (SMTP via Nodemailer)

Transactional email is sent with **Nodemailer over SMTP**. Configure it in
`Backend/.env`:

```
SMTP_HOST=            # e.g. smtp.your-provider.com  (blank = sending disabled)
SMTP_PORT=587         # 465 if SMTP_SECURE=true
SMTP_SECURE=false     # true for port 465 (implicit TLS)
SMTP_USER=            # SMTP username
SMTP_PASS=            # SMTP password / app password
MAIL_FROM_NAME=Uncommon Ground
MAIL_FROM=sadaiah.r@d3e.studio
CONTACT_TO=sadaiah.r@d3e.studio   # where contact-form notifications go
```

What gets sent (all fire‑and‑forget — a mail failure never breaks the request):

- **Contact form** → owner notification (reply‑to = the customer) **and** an
  auto‑reply acknowledgement to the customer.
- **Newsletter** → a welcome email to brand‑new subscribers.
- **Checkout** → an order confirmation / receipt to the buyer.

If `SMTP_HOST` is blank, the app runs normally and logs each message as
`[mail] skipped` instead of sending — so nothing breaks before SMTP is set up.
On boot the server logs whether SMTP verified successfully.

## Notes

- Prices are stored in **cents** in the database and exposed as dollars to the UI.
- Product images use `image_key` values mapped to bundled assets in
  `Frontend/src/lib/assetMap.js`.
- Passwords are hashed with bcrypt; sessions use JWT (`JWT_SECRET` in `.env`).
- Secrets live only in `Backend/.env` and are never bundled into the front‑end.
