import type { BlogPost, Course, LiveClass, Notification, Review, User } from "@/lib/types";

const now = new Date().toISOString();

export const seedUsers: User[] = [
  {
    id: "usr_admin",
    name: "Aarav Mehta",
    email: "admin@raagverse.com",
    role: "admin",
    passwordHash: "demo:raagverse123",
    verified: true,
    approvalStatus: "approved",
    createdAt: now,
  },
  {
    id: "usr_teacher_1",
    name: "Vidushi Kavya Rao",
    email: "teacher@raagverse.com",
    role: "teacher",
    passwordHash: "demo:raagverse123",
    verified: true,
    approvalStatus: "approved",
    instrument: "Vocal",
    level: "Advanced",
    createdAt: now,
  },
  {
    id: "usr_teacher_pending",
    name: "Rohan Sen",
    email: "pending.teacher@raagverse.com",
    role: "teacher",
    passwordHash: "demo:raagverse123",
    verified: false,
    approvalStatus: "pending",
    instrument: "Guitar",
    level: "Advanced",
    createdAt: now,
  },
  {
    id: "usr_student_1",
    name: "Isha Kapoor",
    email: "student@raagverse.com",
    role: "student",
    passwordHash: "demo:raagverse123",
    verified: true,
    approvalStatus: "approved",
    age: 17,
    instrument: "Sitar",
    level: "Intermediate",
    createdAt: now,
  },
];

export const seedCourses: Course[] = [
  {
    id: "crs_vocal_raaga",
    title: "Hindustani Vocal: Raag Foundations",
    slug: "hindustani-vocal-raag-foundations",
    description: "Build pitch, breath, alaap, taan, and improvisation through a structured raag-first path.",
    teacherId: "usr_teacher_1",
    teacherName: "Vidushi Kavya Rao",
    instrument: "Vocal",
    price: 7999,
    level: "Beginner",
    rating: 4.9,
    reviews: 128,
    enrolledStudentIds: ["usr_student_1"],
    createdAt: now,
    modules: [
      {
        title: "Sur, Shruti, and Voice Culture",
        chapters: [
          { title: "Tanpura alignment", duration: "18m", videoUrl: "https://video.example.com/tanpura" },
          { title: "Breath-led meend", duration: "22m" },
        ],
      },
      {
        title: "Raag Yaman",
        chapters: [
          { title: "Aroha-avaroha grammar", duration: "16m" },
          { title: "Alaap development", duration: "29m" },
        ],
      },
    ],
  },
  {
    id: "crs_sitar_modern",
    title: "Sitar for Modern Performers",
    slug: "sitar-for-modern-performers",
    description: "Learn right-hand clarity, mizrab patterns, gat composition, and stage-ready improvisation.",
    teacherId: "usr_teacher_1",
    teacherName: "Vidushi Kavya Rao",
    instrument: "Sitar",
    price: 9999,
    level: "Intermediate",
    rating: 4.8,
    reviews: 91,
    enrolledStudentIds: ["usr_student_1"],
    createdAt: now,
    modules: [
      {
        title: "Technique Lab",
        chapters: [
          { title: "Da-ra stroke economy", duration: "20m" },
          { title: "Jod and jhala stamina", duration: "31m" },
        ],
      },
    ],
  },
  {
    id: "crs_keys_fusion",
    title: "Piano Harmony for Indian Fusion",
    slug: "piano-harmony-for-indian-fusion",
    description: "Turn raag phrases into tasteful chord movement for composing, arranging, and live accompaniment.",
    teacherId: "usr_teacher_1",
    teacherName: "Vidushi Kavya Rao",
    instrument: "Piano",
    price: 6499,
    level: "All Levels",
    rating: 4.7,
    reviews: 76,
    enrolledStudentIds: [],
    createdAt: now,
    modules: [
      {
        title: "Raag-aware Harmony",
        chapters: [
          { title: "Avoid notes and color tones", duration: "24m" },
          { title: "Drone-first voicings", duration: "28m" },
        ],
      },
    ],
  },
];

export const seedClasses: LiveClass[] = [
  {
    id: "cls_yaman_weekly",
    courseId: "crs_vocal_raaga",
    title: "Live Riyaz: Raag Yaman",
    teacherId: "usr_teacher_1",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    durationMinutes: 75,
    provider: "webrtc",
    joinUrl: "/classroom/cls_yaman_weekly",
    recordingUrl: "https://recordings.example.com/yaman-week-1",
    chatEnabled: true,
    attendance: [{ userId: "usr_student_1", status: "present" }],
  },
  {
    id: "cls_sitar_jhala",
    courseId: "crs_sitar_modern",
    title: "Sitar Speed Clinic",
    teacherId: "usr_teacher_1",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 52).toISOString(),
    durationMinutes: 60,
    provider: "google-meet",
    joinUrl: "/classroom/cls_sitar_jhala?provider=google-meet",
    chatEnabled: true,
    attendance: [],
  },
];

export const seedNotifications: Notification[] = [
  {
    id: "ntf_1",
    userId: "usr_student_1",
    title: "Class starts tomorrow",
    body: "Live Riyaz: Raag Yaman opens 10 minutes before the scheduled time.",
    read: false,
    createdAt: now,
  },
];

export const seedReviews: Review[] = [
  {
    id: "rev_1",
    courseId: "crs_vocal_raaga",
    userId: "usr_student_1",
    rating: 5,
    comment: "The clearest introduction to raag structure I have taken online.",
    createdAt: now,
  },
];

export const seedBlogPosts: BlogPost[] = [
  {
    slug: "how-to-build-daily-riyaz",
    title: "How to Build a Daily Riyaz Ritual",
    excerpt: "A practical 30-minute routine for pitch, breath, rhythm, and reflection.",
    category: "Practice",
    readTime: "4 min",
    publishedAt: "2026-05-01",
  },
  {
    slug: "raag-yaman-for-beginners",
    title: "Raag Yaman for Beginners",
    excerpt: "Understand the mood, movement, and phrase vocabulary that make Yaman luminous.",
    category: "Raag Guide",
    readTime: "6 min",
    publishedAt: "2026-04-24",
  },
  {
    slug: "choosing-your-first-instrument",
    title: "Choosing Your First Instrument",
    excerpt: "Sitar, tabla, guitar, piano, or voice: how to choose based on temperament and goals.",
    category: "Learning",
    readTime: "5 min",
    publishedAt: "2026-04-18",
  },
];
