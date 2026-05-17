# Raagverse

Raagverse is a production-ready starter platform for a premium online music school. It includes a branded marketing site, course marketplace, student dashboard, teacher dashboard, admin CRM, Supabase Auth, Supabase Postgres persistence, live class scheduling, payment checkout, and a full brand identity board.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS v4
- Node route handlers for backend APIs
- Supabase Postgres with local seed fallback
- Supabase Auth email OTP plus app JWT HTTP-only cookies
- Zod validation
- Razorpay/Stripe-ready checkout endpoint
- WebRTC, Zoom, and Google Meet-ready class provider model
- Vercel-ready configuration

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The app works locally without Supabase by using seeded in-memory data. Add Supabase keys and `JWT_SECRET` in `.env.local` for persistent data and real email OTP.

## Demo Accounts

- Admin: `admin@raagverse.com / raagverse123`
- Teacher: `teacher@raagverse.com / raagverse123`
- Student: `student@raagverse.com / raagverse123`

## Main Routes

- `/` premium homepage and product overview
- `/courses` searchable course marketplace
- `/auth` signup/login UI
- `/dashboard/student` profile, courses, live classes, recordings, progress
- `/dashboard/teacher` course management, scheduling, recordings, attendance
- `/dashboard/admin` users, teacher approval, analytics, CRM, CSV export
- `/brand` brand identity board and mockups
- `/blog` SEO-friendly music tips section

## API Docs

See `API_DOCUMENTATION.md`.

## Deployment

### Vercel

1. Push this folder to a Git repository.
2. Import the project in Vercel.
3. Add environment variables from `.env.example`.
4. Deploy.

### Supabase Database + Email OTP

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. In Authentication -> Providers -> Email, enable Email provider and OTP/passwordless sign-ins.
4. Copy Project URL, anon key, and service role key into `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

Signup and login call Supabase Auth to send an email OTP. Signup profile data is stored in `signup_intents` before OTP verification, then `/api/auth/verify-otp` upserts the `profiles` row and sets the app's HTTP-only JWT cookie for RBAC-protected APIs. Role assignment does not trust user-editable Supabase user metadata.

### Payments

Use `/api/payments/checkout` as the integration point. The route creates Razorpay Orders or Stripe Checkout Sessions when keys from `.env.example` are present, stores checkout records in Supabase, and returns a simulated local checkout when keys are absent.

### Live Classes

The class model supports:

- `webrtc`: built-in classroom URL format
- `zoom`: Zoom Server-to-Server OAuth meeting creation
- `google-meet`: Google Calendar API Meet conference creation

## Production Hardening Checklist

- Configure Supabase email templates, SMTP, and OTP expiry for production.
- Remove demo password fallback in `src/lib/auth.ts`.
- Add refresh token rotation if long sessions are needed.
- Add webhook handlers for Razorpay/Stripe settlement updates.
- Add persistent notification delivery through email and in-app collections.
- Add upload storage for recordings using S3, Firebase Storage, or Vercel Blob.
- Add automated tests for RBAC, checkout, and class scheduling flows.
