import { seedClasses, seedCourses, seedNotifications, seedReviews, seedUsers } from "@/data/seed";
import { createLiveClassJoinUrl } from "@/lib/live-providers";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { CheckoutSession, Course, LiveClass, Notification, Review, SignupIntent, User } from "@/lib/types";

type StoreState = {
  users: User[];
  courses: Course[];
  classes: LiveClass[];
  notifications: Notification[];
  reviews: Review[];
};

const globalForStore = globalThis as typeof globalThis & {
  __raagverseStore?: StoreState;
};

function memoryStore() {
  if (!globalForStore.__raagverseStore) {
    globalForStore.__raagverseStore = {
      users: [...seedUsers],
      courses: [...seedCourses],
      classes: [...seedClasses],
      notifications: [...seedNotifications],
      reviews: [...seedReviews],
    };
  }

  return globalForStore.__raagverseStore;
}

function createId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`;
}

type ProfileRow = {
  id: string;
  name: string;
  email: string;
  role: User["role"];
  password_hash: string | null;
  verified: boolean;
  approval_status: User["approvalStatus"];
  age: number | null;
  instrument: string | null;
  level: User["level"] | null;
  created_at: string;
};

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  teacher_id: string;
  teacher_name: string;
  instrument: string;
  price: number;
  level: Course["level"];
  rating: number;
  reviews: number;
  modules: Course["modules"];
  enrolled_student_ids: string[];
  created_at: string;
};

type LiveClassRow = {
  id: string;
  course_id: string;
  title: string;
  teacher_id: string;
  starts_at: string;
  duration_minutes: number;
  provider: LiveClass["provider"];
  join_url: string;
  recording_url: string | null;
  chat_enabled: boolean;
  attendance: LiveClass["attendance"];
};

type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

type SignupIntentRow = {
  email: string;
  name: string;
  role: Exclude<User["role"], "admin">;
  approval_status: User["approvalStatus"];
  age: number | null;
  instrument: string | null;
  level: User["level"] | null;
  created_at: string;
};

type CheckoutSessionRow = {
  id: string;
  user_id: string;
  course_id: string;
  provider: CheckoutSession["provider"];
  checkout_id: string;
  amount: number;
  currency: CheckoutSession["currency"];
  mode: CheckoutSession["mode"];
  simulated: boolean;
  status: "created" | "paid" | "cancelled";
  created_at: string;
};

function toUser(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    passwordHash: row.password_hash ?? "",
    verified: row.verified,
    approvalStatus: row.approval_status,
    age: row.age ?? undefined,
    instrument: row.instrument ?? undefined,
    level: row.level ?? undefined,
    createdAt: row.created_at,
  };
}

function toProfileRow(user: User): ProfileRow {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    password_hash: user.passwordHash,
    verified: user.verified,
    approval_status: user.approvalStatus,
    age: user.age ?? null,
    instrument: user.instrument ?? null,
    level: user.level ?? null,
    created_at: user.createdAt,
  };
}

function toCourse(row: CourseRow): Course {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    teacherId: row.teacher_id,
    teacherName: row.teacher_name,
    instrument: row.instrument,
    price: Number(row.price),
    level: row.level,
    rating: Number(row.rating),
    reviews: row.reviews,
    modules: row.modules ?? [],
    enrolledStudentIds: row.enrolled_student_ids ?? [],
    createdAt: row.created_at,
  };
}

function toCourseRow(course: Course): CourseRow {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    teacher_id: course.teacherId,
    teacher_name: course.teacherName,
    instrument: course.instrument,
    price: course.price,
    level: course.level,
    rating: course.rating,
    reviews: course.reviews,
    modules: course.modules,
    enrolled_student_ids: course.enrolledStudentIds,
    created_at: course.createdAt,
  };
}

function toLiveClass(row: LiveClassRow): LiveClass {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    teacherId: row.teacher_id,
    startsAt: row.starts_at,
    durationMinutes: row.duration_minutes,
    provider: row.provider,
    joinUrl: row.join_url,
    recordingUrl: row.recording_url ?? undefined,
    chatEnabled: row.chat_enabled,
    attendance: row.attendance ?? [],
  };
}

function toLiveClassRow(liveClass: LiveClass): LiveClassRow {
  return {
    id: liveClass.id,
    course_id: liveClass.courseId,
    title: liveClass.title,
    teacher_id: liveClass.teacherId,
    starts_at: liveClass.startsAt,
    duration_minutes: liveClass.durationMinutes,
    provider: liveClass.provider,
    join_url: liveClass.joinUrl,
    recording_url: liveClass.recordingUrl ?? null,
    chat_enabled: liveClass.chatEnabled,
    attendance: liveClass.attendance,
  };
}

function toNotification(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    read: row.read,
    createdAt: row.created_at,
  };
}

function toSignupIntent(row: SignupIntentRow): SignupIntent {
  return {
    email: row.email,
    name: row.name,
    role: row.role,
    approvalStatus: row.approval_status,
    age: row.age ?? undefined,
    instrument: row.instrument ?? undefined,
    level: row.level ?? undefined,
    createdAt: row.created_at,
  };
}

function toSignupIntentRow(intent: SignupIntent): SignupIntentRow {
  return {
    email: intent.email.toLowerCase(),
    name: intent.name,
    role: intent.role,
    approval_status: intent.approvalStatus,
    age: intent.age ?? null,
    instrument: intent.instrument ?? null,
    level: intent.level ?? null,
    created_at: intent.createdAt,
  };
}

export async function listUsers() {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ProfileRow[]).map(toUser);
  }

  return memoryStore().users;
}

export async function findUserByEmail(email: string) {
  const normalized = email.toLowerCase();
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("profiles").select("*").eq("email", normalized).maybeSingle();
    if (error) throw error;
    return data ? toUser(data as ProfileRow) : null;
  }

  return memoryStore().users.find((user) => user.email === normalized) ?? null;
}

export async function findUserById(id: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? toUser(data as ProfileRow) : null;
  }

  return memoryStore().users.find((user) => user.id === id) ?? null;
}

export async function createUser(input: Omit<User, "id" | "createdAt">) {
  const user: User = {
    ...input,
    id: createId("usr"),
    email: input.email.toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("profiles").insert(toProfileRow(user));
    if (error) throw error;
  } else {
    memoryStore().users.push(user);
  }

  return user;
}

export async function upsertUser(user: User) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("profiles").upsert(toProfileRow(user), { onConflict: "id" });
    if (error) throw error;
    return user;
  }

  const store = memoryStore();
  const existingIndex = store.users.findIndex((item) => item.id === user.id || item.email === user.email);
  if (existingIndex >= 0) store.users[existingIndex] = user;
  else store.users.push(user);
  return user;
}

export async function updateTeacherApproval(userId: string, approvalStatus: User["approvalStatus"]) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const update: { approval_status: User["approvalStatus"]; verified?: boolean } = {
      approval_status: approvalStatus,
    };
    if (approvalStatus === "approved") update.verified = true;

    const { error } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", userId)
      .eq("role", "teacher");
    if (error) throw error;
    return findUserById(userId);
  }

  const user = memoryStore().users.find((item) => item.id === userId && item.role === "teacher");
  if (user) {
    user.approvalStatus = approvalStatus;
    if (approvalStatus === "approved") user.verified = true;
  }
  return user ?? null;
}

export async function saveSignupIntent(input: Omit<SignupIntent, "createdAt">) {
  const intent: SignupIntent = {
    ...input,
    email: input.email.toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("signup_intents").upsert(toSignupIntentRow(intent), { onConflict: "email" });
    if (error) throw error;
  }

  return intent;
}

export async function findSignupIntentByEmail(email: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("signup_intents")
      .select("*")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (error) throw error;
    return data ? toSignupIntent(data as SignupIntentRow) : null;
  }

  return null;
}

export async function deleteSignupIntent(email: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase.from("signup_intents").delete().eq("email", email.toLowerCase());
  if (error) throw error;
}

export async function listNotifications(userId?: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    let query = supabase.from("notifications").select("*").order("created_at", { ascending: false });
    if (userId) query = query.eq("user_id", userId);
    const { data, error } = await query;
    if (error) throw error;
    return (data as NotificationRow[]).map(toNotification);
  }

  const notifications = memoryStore().notifications;
  return userId ? notifications.filter((item) => item.userId === userId) : notifications;
}

export async function listCourses(filters?: { search?: string; level?: string; instrument?: string }) {
  const supabase = getSupabaseAdmin();
  let courses = memoryStore().courses;

  if (supabase) {
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    courses = (data as CourseRow[]).map(toCourse);
  }

  const query = filters?.search?.toLowerCase();

  return courses.filter((course) => {
    const matchesSearch =
      !query ||
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.instrument.toLowerCase().includes(query);
    const matchesLevel = !filters?.level || filters.level === "all" || course.level === filters.level;
    const matchesInstrument =
      !filters?.instrument || filters.instrument === "all" || course.instrument === filters.instrument;
    return matchesSearch && matchesLevel && matchesInstrument;
  });
}

export async function findCourseById(courseId: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("courses").select("*").eq("id", courseId).maybeSingle();
    if (error) throw error;
    return data ? toCourse(data as CourseRow) : null;
  }

  return memoryStore().courses.find((course) => course.id === courseId) ?? null;
}

export async function enrollStudentInCourse(courseId: string, studentId: string) {
  const course = await findCourseById(courseId);
  if (!course) return null;
  if (!course.enrolledStudentIds.includes(studentId)) {
    course.enrolledStudentIds = [...course.enrolledStudentIds, studentId];
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error: enrollmentError } = await supabase.from("course_enrollments").upsert(
      {
        course_id: courseId,
        student_id: studentId,
        status: "active",
      },
      { onConflict: "course_id,student_id" },
    );
    if (enrollmentError) throw enrollmentError;

    const { error } = await supabase
      .from("courses")
      .update({ enrolled_student_ids: course.enrolledStudentIds })
      .eq("id", courseId);
    if (error) throw error;
  } else {
    const store = memoryStore();
    const existingIndex = store.courses.findIndex((item) => item.id === courseId);
    if (existingIndex >= 0) store.courses[existingIndex] = course;
  }

  return course;
}

export async function saveCheckoutSession(userId: string, session: CheckoutSession) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const row: CheckoutSessionRow = {
    id: createId("pay"),
    user_id: userId,
    course_id: session.courseId,
    provider: session.provider,
    checkout_id: session.checkoutId,
    amount: session.amount,
    currency: session.currency,
    mode: session.mode,
    simulated: session.simulated,
    status: session.simulated ? "paid" : "created",
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("checkout_sessions").insert(row);
  if (error) throw error;
}

export async function createCourse(input: Omit<Course, "id" | "slug" | "rating" | "reviews" | "enrolledStudentIds" | "createdAt">) {
  const course: Course = {
    ...input,
    id: createId("crs"),
    slug: input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    rating: 0,
    reviews: 0,
    enrolledStudentIds: [],
    createdAt: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("courses").insert(toCourseRow(course));
    if (error) throw error;
  } else {
    memoryStore().courses.push(course);
  }

  return course;
}

export async function listClasses() {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("live_classes").select("*").order("starts_at", { ascending: true });
    if (error) throw error;
    return (data as LiveClassRow[]).map(toLiveClass);
  }

  return memoryStore().classes;
}

export async function findClassById(classId: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.from("live_classes").select("*").eq("id", classId).maybeSingle();
    if (error) throw error;
    return data ? toLiveClass(data as LiveClassRow) : null;
  }

  return memoryStore().classes.find((liveClass) => liveClass.id === classId) ?? null;
}

export async function createClass(input: Omit<LiveClass, "id" | "joinUrl" | "attendance">) {
  const id = createId("cls");
  const liveClass: LiveClass = {
    ...input,
    id,
    joinUrl: await createLiveClassJoinUrl({ ...input, id }),
    attendance: [],
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("live_classes").insert(toLiveClassRow(liveClass));
    if (error) throw error;
  } else {
    memoryStore().classes.push(liveClass);
  }

  return liveClass;
}

export async function updateClassRecording(classId: string, recordingUrl: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("live_classes").update({ recording_url: recordingUrl }).eq("id", classId);
    if (error) throw error;
    return findClassById(classId);
  }

  const liveClass = memoryStore().classes.find((item) => item.id === classId);
  if (liveClass) liveClass.recordingUrl = recordingUrl;
  return liveClass ?? null;
}

export async function platformAnalytics() {
  const [users, courses, classes] = await Promise.all([listUsers(), listCourses(), listClasses()]);
  const revenue = courses.reduce((sum, course) => sum + course.price * course.enrolledStudentIds.length, 0);

  return {
    students: users.filter((user) => user.role === "student").length,
    teachers: users.filter((user) => user.role === "teacher" && user.approvalStatus === "approved").length,
    pendingTeachers: users.filter((user) => user.role === "teacher" && user.approvalStatus === "pending").length,
    courses: courses.length,
    liveClasses: classes.length,
    revenue,
  };
}
