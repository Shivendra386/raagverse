import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).optional(),
  role: z.enum(["student", "teacher"]),
  age: z.coerce.number().int().min(5).max(100).optional(),
  instrument: z.string().min(2).optional(),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
});

export const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).optional(),
});

export const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  teacherId: z.string().min(3),
  teacherName: z.string().min(2),
  instrument: z.string().min(2),
  price: z.coerce.number().nonnegative(),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "All Levels"]),
  modules: z
    .array(
      z.object({
        title: z.string().min(3),
        chapters: z.array(
          z.object({
            title: z.string().min(3),
            duration: z.string().min(2),
            videoUrl: z.string().url().optional(),
          }),
        ),
      }),
    )
    .default([]),
});

export const classSchema = z.object({
  courseId: z.string().min(3),
  title: z.string().min(3),
  teacherId: z.string().min(3),
  startsAt: z.string().datetime(),
  durationMinutes: z.coerce.number().int().min(15).max(240),
  provider: z.enum(["zoom", "google-meet", "webrtc"]),
  recordingUrl: z.string().url().optional(),
  chatEnabled: z.boolean().default(true),
});
