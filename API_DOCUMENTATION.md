# Raagverse API Documentation

Base URL: `/api`

Authentication uses Supabase email OTP, then an HTTP-only JWT cookie named `raagverse_token` for app role checks. Verify OTP first, then call role-protected endpoints.

## Auth

### `POST /api/auth/signup`
Sends a Supabase email OTP for a student or teacher signup. The server stores the signup profile in `signup_intents`, then uses that trusted row after OTP verification. Teachers become `approvalStatus: pending` after OTP verification.

```json
{
  "name": "Isha Kapoor",
  "email": "isha@example.com",
  "role": "student",
  "age": 17,
  "instrument": "Sitar",
  "level": "Intermediate"
}
```

### `POST /api/auth/login`
Sends a Supabase email OTP for login when Supabase is configured. In local fallback mode, accepts demo password login and sets the JWT cookie.

```json
{
  "email": "student@raagverse.com",
  "password": "raagverse123"
}
```

Demo users:

- `admin@raagverse.com / raagverse123`
- `teacher@raagverse.com / raagverse123`
- `student@raagverse.com / raagverse123`

### `POST /api/auth/forgot-password`
Sends a Supabase recovery email when Supabase is configured. Local fallback returns demo OTP `123456`.

### `POST /api/auth/verify-otp`
Verifies Supabase email/recovery OTP, upserts the profile in Supabase Postgres, and sets the app JWT cookie. Local demo OTP is `123456`.

## Courses

### `GET /api/courses`
Public course search.

Query params:

- `search`
- `level`
- `instrument`

### `POST /api/courses`
Roles: `teacher`, `admin`

Creates a course with modules and chapters.

## Live Classes

### `GET /api/classes`
Roles: `student`, `teacher`, `admin`

Lists scheduled live sessions.

### `POST /api/classes`
Roles: `teacher`, `admin`

Creates a live class. For `provider: "webrtc"`, the API generates `/classroom/:id`. For Zoom and Google Meet, the API creates real provider links when the matching credentials are configured; otherwise it falls back to the built-in classroom URL.

### `PATCH /api/classes/:id/recording`
Roles: `teacher`, `admin`

Links a recording URL to an existing class.

## Payments

### `POST /api/payments/checkout`
Roles: `student`, `admin`

Creates a Razorpay order or Stripe Checkout Session when provider keys are configured. Without payment keys, local development returns a simulated checkout session so the enrollment flow can be tested.
Checkout attempts are stored in `checkout_sessions` when Supabase is configured.

```json
{
  "courseId": "crs_vocal_raaga",
  "provider": "razorpay",
  "currency": "INR"
}
```

## Admin

### `GET /api/admin/analytics`
Roles: `admin`

Returns students, teachers, pending teachers, courses, live classes, and revenue.

### `PATCH /api/admin/teachers/:id/approval`
Roles: `admin`

Approves, rejects, or resets a teacher approval status.

### `POST /api/courses/:id/enroll`
Roles: `student`, `admin`

Enrolls the current user in a course after checkout.
Supabase-backed enrollments are written to `course_enrollments` and mirrored into `courses.enrolled_student_ids` for fast dashboard reads.

### `GET /api/crm/export`
Roles: `admin`

Exports users and courses as CSV.

## Security Notes

- All mutating API handlers validate request bodies with Zod.
- Role checks are performed inside route handlers, not only at navigation/proxy level.
- JWT is stored in an HTTP-only cookie with `secure` enabled in production.
- Supabase role/profile assignment is read from `signup_intents`, not user-editable Auth metadata.
- RLS is enabled for all public tables; application writes use the server-only service role client.
- Database clients are initialized lazily so production builds do not require secrets at module import time.
- Replace demo OTP and demo passwords before launch.
