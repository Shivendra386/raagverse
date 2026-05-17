create extension if not exists pgcrypto;

do $$ begin
  create type app_role as enum ('admin', 'teacher', 'student');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type approval_status as enum ('approved', 'pending', 'rejected');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type course_level as enum ('Beginner', 'Intermediate', 'Advanced', 'All Levels');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type class_provider as enum ('zoom', 'google-meet', 'webrtc');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type payment_provider as enum ('razorpay', 'stripe');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type checkout_status as enum ('created', 'paid', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type enrollment_status as enum ('active', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.signup_intents (
  email text primary key,
  name text not null,
  role app_role not null check (role in ('teacher', 'student')),
  approval_status approval_status not null default 'approved',
  age integer,
  instrument text,
  level text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key,
  name text not null,
  email text not null unique,
  role app_role not null default 'student',
  password_hash text,
  verified boolean not null default false,
  approval_status approval_status not null default 'approved',
  age integer,
  instrument text,
  level text,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id text primary key,
  title text not null,
  slug text not null unique,
  description text not null,
  teacher_id text not null references public.profiles(id) on delete cascade,
  teacher_name text not null,
  instrument text not null,
  price numeric(12, 2) not null default 0,
  level course_level not null default 'All Levels',
  rating numeric(3, 2) not null default 0,
  reviews integer not null default 0,
  modules jsonb not null default '[]'::jsonb,
  enrolled_student_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.live_classes (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  teacher_id text not null references public.profiles(id) on delete cascade,
  starts_at timestamptz not null,
  duration_minutes integer not null,
  provider class_provider not null default 'webrtc',
  join_url text not null,
  recording_url text,
  chat_enabled boolean not null default true,
  attendance jsonb not null default '[]'::jsonb
);

create table if not exists public.course_enrollments (
  course_id text not null references public.courses(id) on delete cascade,
  student_id text not null references public.profiles(id) on delete cascade,
  status enrollment_status not null default 'active',
  enrolled_at timestamptz not null default now(),
  primary key (course_id, student_id)
);

create table if not exists public.checkout_sessions (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  provider payment_provider not null,
  checkout_id text not null,
  amount numeric(12, 2) not null,
  currency text not null check (currency in ('INR', 'USD')),
  mode text not null check (mode in ('live', 'test')),
  simulated boolean not null default false,
  status checkout_status not null default 'created',
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id text primary key,
  user_id text not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  user_id text not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.signup_intents enable row level security;
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.live_classes enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;

grant select on public.courses to anon, authenticated;
grant select, insert, update, delete on public.signup_intents to service_role;
grant select, insert, update, delete on public.profiles to service_role;
grant select, insert, update, delete on public.courses to service_role;
grant select, insert, update, delete on public.live_classes to service_role;
grant select, insert, update, delete on public.course_enrollments to service_role;
grant select, insert, update, delete on public.checkout_sessions to service_role;
grant select, insert, update, delete on public.notifications to service_role;
grant select, insert, update, delete on public.reviews to service_role;

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists courses_teacher_id_idx on public.courses (teacher_id);
create index if not exists live_classes_course_id_idx on public.live_classes (course_id);
create index if not exists live_classes_teacher_id_idx on public.live_classes (teacher_id);
create index if not exists course_enrollments_student_id_idx on public.course_enrollments (student_id);
create index if not exists checkout_sessions_user_id_idx on public.checkout_sessions (user_id);
create index if not exists notifications_user_id_idx on public.notifications (user_id);

drop policy if exists "signup intents service role full access" on public.signup_intents;
create policy "signup intents service role full access"
on public.signup_intents
for all
to service_role
using (true)
with check (true);

drop policy if exists "profiles service role full access" on public.profiles;
create policy "profiles service role full access"
on public.profiles
for all
to service_role
using (true)
with check (true);

drop policy if exists "courses public read" on public.courses;
create policy "courses public read"
on public.courses
for select
to anon, authenticated
using (true);

drop policy if exists "courses service role full access" on public.courses;
create policy "courses service role full access"
on public.courses
for all
to service_role
using (true)
with check (true);

drop policy if exists "live classes service role full access" on public.live_classes;
create policy "live classes service role full access"
on public.live_classes
for all
to service_role
using (true)
with check (true);

drop policy if exists "course enrollments service role full access" on public.course_enrollments;
create policy "course enrollments service role full access"
on public.course_enrollments
for all
to service_role
using (true)
with check (true);

drop policy if exists "checkout sessions service role full access" on public.checkout_sessions;
create policy "checkout sessions service role full access"
on public.checkout_sessions
for all
to service_role
using (true)
with check (true);

drop policy if exists "notifications service role full access" on public.notifications;
create policy "notifications service role full access"
on public.notifications
for all
to service_role
using (true)
with check (true);

drop policy if exists "reviews service role full access" on public.reviews;
create policy "reviews service role full access"
on public.reviews
for all
to service_role
using (true)
with check (true);

insert into public.profiles (id, name, email, role, password_hash, verified, approval_status, age, instrument, level, created_at)
values
  ('usr_admin', 'Aarav Mehta', 'admin@raagverse.com', 'admin', 'demo:raagverse123', true, 'approved', null, null, null, now()),
  ('usr_teacher_1', 'Vidushi Kavya Rao', 'teacher@raagverse.com', 'teacher', 'demo:raagverse123', true, 'approved', null, 'Vocal', 'Advanced', now()),
  ('usr_teacher_pending', 'Rohan Sen', 'pending.teacher@raagverse.com', 'teacher', 'demo:raagverse123', false, 'pending', null, 'Guitar', 'Advanced', now()),
  ('usr_student_1', 'Isha Kapoor', 'student@raagverse.com', 'student', 'demo:raagverse123', true, 'approved', 17, 'Sitar', 'Intermediate', now())
on conflict (id) do nothing;

insert into public.courses (
  id, title, slug, description, teacher_id, teacher_name, instrument, price, level, rating, reviews, modules, enrolled_student_ids, created_at
)
values
  (
    'crs_vocal_raaga',
    'Hindustani Vocal: Raag Foundations',
    'hindustani-vocal-raag-foundations',
    'Build pitch, breath, alaap, taan, and improvisation through a structured raag-first path.',
    'usr_teacher_1',
    'Vidushi Kavya Rao',
    'Vocal',
    7999,
    'Beginner',
    4.9,
    128,
    '[{"title":"Sur, Shruti, and Voice Culture","chapters":[{"title":"Tanpura alignment","duration":"18m","videoUrl":"https://video.example.com/tanpura"},{"title":"Breath-led meend","duration":"22m"}]},{"title":"Raag Yaman","chapters":[{"title":"Aroha-avaroha grammar","duration":"16m"},{"title":"Alaap development","duration":"29m"}]}]'::jsonb,
    array['usr_student_1'],
    now()
  ),
  (
    'crs_sitar_modern',
    'Sitar for Modern Performers',
    'sitar-for-modern-performers',
    'Learn right-hand clarity, mizrab patterns, gat composition, and stage-ready improvisation.',
    'usr_teacher_1',
    'Vidushi Kavya Rao',
    'Sitar',
    9999,
    'Intermediate',
    4.8,
    91,
    '[{"title":"Technique Lab","chapters":[{"title":"Da-ra stroke economy","duration":"20m"},{"title":"Jod and jhala stamina","duration":"31m"}]}]'::jsonb,
    array['usr_student_1'],
    now()
  ),
  (
    'crs_keys_fusion',
    'Piano Harmony for Indian Fusion',
    'piano-harmony-for-indian-fusion',
    'Turn raag phrases into tasteful chord movement for composing, arranging, and live accompaniment.',
    'usr_teacher_1',
    'Vidushi Kavya Rao',
    'Piano',
    6499,
    'All Levels',
    4.7,
    76,
    '[{"title":"Raag-aware Harmony","chapters":[{"title":"Avoid notes and color tones","duration":"24m"},{"title":"Drone-first voicings","duration":"28m"}]}]'::jsonb,
    '{}',
    now()
  )
on conflict (id) do nothing;

insert into public.live_classes (
  id, course_id, title, teacher_id, starts_at, duration_minutes, provider, join_url, recording_url, chat_enabled, attendance
)
values
  (
    'cls_yaman_weekly',
    'crs_vocal_raaga',
    'Live Riyaz: Raag Yaman',
    'usr_teacher_1',
    now() + interval '26 hours',
    75,
    'webrtc',
    '/classroom/cls_yaman_weekly',
    'https://recordings.example.com/yaman-week-1',
    true,
    '[{"userId":"usr_student_1","status":"present"}]'::jsonb
  ),
  (
    'cls_sitar_jhala',
    'crs_sitar_modern',
    'Sitar Speed Clinic',
    'usr_teacher_1',
    now() + interval '52 hours',
    60,
    'google-meet',
    '/classroom/cls_sitar_jhala?provider=google-meet',
    null,
    true,
    '[]'::jsonb
  )
on conflict (id) do nothing;

insert into public.course_enrollments (course_id, student_id, status, enrolled_at)
values
  ('crs_vocal_raaga', 'usr_student_1', 'active', now()),
  ('crs_sitar_modern', 'usr_student_1', 'active', now())
on conflict (course_id, student_id) do nothing;
