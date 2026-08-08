# JSS — Jyothi Security Services

A premium, multilingual security-agency website and admin panel for Jyothi Security Services (JSS): a marketing site (services, industries, training, testimonials, gallery), two multi-step public forms (Request Security Guards, Become a Security Guard), and a full admin panel (guards, clients, enquiries, applications, assignments, attendance, salary, calendar, reports, settings) backed by Supabase.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend:** Next.js Server Actions, Supabase (Postgres, Auth, Storage)
- **Forms:** React Hook Form + Zod
- **Email:** Resend
- **Maps:** Google Maps Embed (iframe, no API key required)
- **i18n:** next-intl — English (default), Kannada, Hindi, Telugu
- **Monitoring:** Sentry (errors), Vercel Analytics + Speed Insights

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in the values described below
npm run dev
```

The site runs at `http://localhost:3000` (English at `/`, other locales at `/kn`, `/hi`, `/te`). The admin panel lives outside locale routing at `/admin`.

Public marketing pages render with **no environment variables required**. Supabase is only needed once you submit a form or sign in to `/admin`.

## Project Structure

```
src/
  app/
    [locale]/(site)/     Public marketing pages (home, about, services, ...)
    [locale]/layout.tsx  Root layout: fonts, i18n provider, JSON-LD, analytics
    admin/                Admin panel (auth-gated, outside locale routing)
    robots.ts, sitemap.ts
  components/
    layout/               Navbar, footer, accessibility toolbar, floating CTAs
    home/, forms/, admin/, shared/, icons/
  lib/
    actions/              Server Actions (public forms + admin/* CRUD)
    supabase/              Browser/server/middleware Supabase clients
    validations/           Zod schemas
    email/                 Resend integration
    constants/             Site content structure (translated copy lives in messages/*.json)
  i18n/                   next-intl routing/config
  messages/               en.json, kn.json, hi.json, te.json
  types/database.ts       Hand-written Supabase types (see note below)
supabase/migrations/      SQL schema — run this against your Supabase project
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Forms, Admin | From Supabase Project Settings → API. This project only ever uses the anon key (never a service-role key) — access control is enforced entirely through Postgres Row Level Security policies in the migration. |
| `RESEND_API_KEY` | Email notifications | From resend.com. If unset, enquiries/applications still save to the database — email sending is skipped and logged, per the fault-tolerant design (see below). |
| `RESEND_FROM_EMAIL` / `NOTIFY_EMAIL` | Email notifications | Sender identity and where admin notifications are delivered. |
| `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Error tracking | Optional. Leave blank to disable Sentry entirely (no-op, no errors). |
| `NEXT_PUBLIC_SITE_URL` | SEO | Canonical production URL, used in metadata, sitemap and JSON-LD. |

## Setting Up Supabase

1. Create a free project at [supabase.com](https://supabase.com) (or provision one via the Vercel Marketplace integration).
2. Open the SQL editor and run `supabase/migrations/20260714000000_init.sql`. This creates every table, enum, RLS policy, and storage bucket (`applications`, `guards`, `gallery`, `site-assets`) the app needs.
3. Copy the Project URL and anon public key into `.env.local`.
4. Create your first admin user under Authentication → Users → Add User (email + password). There is no public sign-up — admin accounts are provisioned manually, by design.
5. (Optional) Regenerate `src/types/database.ts` with `supabase gen types typescript` once the project is linked, keeping the hand-written `Relationships`/`Views`/`Functions` shape intact.

## Fault-Tolerant Enquiry/Application Flow

Every public form submission (Request Security Guards, Become a Security Guard) follows this order, per the original requirement that no enquiry should ever be lost:

1. Validate input (Zod, both client-side per wizard step and server-side in the Server Action).
2. Insert into Supabase **first**.
3. Only then attempt to send a Resend notification email. Success/failure is recorded on the row (`email_sent`, `email_error`) but never blocks the user-facing success screen.

If Resend is unreachable or misconfigured, the enquiry is still safely stored and visible in `/admin/enquiries` or `/admin/applications`.

## Content You Should Replace Before Launch

To keep the build honest, several pieces of content are explicitly placeholder and called out in the UI or code comments:

- **Contact details** (`src/lib/constants/site.ts`): phone/WhatsApp numbers use an obviously-fake `90000 00000` pattern — replace with real numbers, or edit them live from `/admin/settings`.
- **Statistics** (years of experience, guard count, etc. on the homepage): round placeholder figures — replace with verified numbers in `src/lib/constants/site.ts`.
- **Testimonials & gallery**: the public pages show clearly-labelled sample content until real entries are added and published via `/admin/settings`.
- **Training page**: carries an explicit disclaimer that curriculum details are illustrative and JSS does not claim third-party certification.
- **History timeline**: uses relative milestone stages rather than invented founding dates.
- **Legal pages** (Privacy Policy, Terms): placeholder text; have these reviewed by counsel before publishing.

## Admin Panel

`/admin/login` → Supabase Auth (email/password). Once signed in you get:

Dashboard · Security Guards (CRUD, search, CSV export) · Clients · Enquiries · Job Applications (with signed-URL access to uploaded Aadhaar files) · Assignments · Attendance · Salary · Companies (directory overview) · Reports (charts) · Calendar · Calculator · Settings (company info, testimonials, gallery).

Every admin table is protected by Postgres RLS (`authenticated` role only); the public site can only ever `INSERT` into `enquiries`/`job_applications` and `SELECT` published gallery/testimonial rows.

## Deployment (free-tier stack)

1. **Vercel** — import the repo, set the environment variables above in Project Settings → Environment Variables, deploy. `vercel.json`/`vercel.ts` isn't required; defaults (Next.js framework preset) work out of the box.
2. **Supabase** — free tier covers Postgres + Auth + Storage for this schema comfortably at small scale.
3. **Resend** — free tier (100 emails/day) is enough for enquiry notifications; verify a sending domain when you're ready to move off `onboarding@resend.dev`.
4. **Domain** — the only recurring cost in this stack.

## Scripts

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build + type-check + lint
npm run start    # run the production build
npm run lint     # lint only
```

## Accessibility

A floating accessibility toolbar (top-right, next to the language switcher) lets visitors adjust font size, letter/word spacing, line height, toggle high-contrast mode, and toggle a reading mode — all persisted to `localStorage`. Keyboard focus is visible site-wide and a "Skip to main content" link is available on every page.
