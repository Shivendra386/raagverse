export type UserRole = "admin" | "teacher" | "student";

export type ApprovalStatus = "approved" | "pending" | "rejected";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  verified: boolean;
  approvalStatus: ApprovalStatus;
  age?: number;
  instrument?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  createdAt: string;
};

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  teacherId: string;
  teacherName: string;
  instrument: string;
  price: number;
  level: CourseLevel;
  rating: number;
  reviews: number;
  modules: CourseModule[];
  enrolledStudentIds: string[];
  createdAt: string;
};

export type CheckoutProvider = "razorpay" | "stripe";

export type CheckoutSession = {
  provider: CheckoutProvider;
  courseId: string;
  amount: number;
  currency: "INR" | "USD";
  mode: "live" | "test";
  checkoutId: string;
  checkoutUrl?: string;
  orderId?: string;
  publishableKey?: string;
  simulated: boolean;
};

export type SignupIntent = {
  email: string;
  name: string;
  role: Exclude<UserRole, "admin">;
  approvalStatus: ApprovalStatus;
  age?: number;
  instrument?: string;
  level?: User["level"];
  createdAt: string;
};

export type CourseModule = {
  title: string;
  chapters: {
    title: string;
    duration: string;
    videoUrl?: string;
  }[];
};

export type LiveClass = {
  id: string;
  courseId: string;
  title: string;
  teacherId: string;
  startsAt: string;
  durationMinutes: number;
  provider: "zoom" | "google-meet" | "webrtc";
  joinUrl: string;
  recordingUrl?: string;
  chatEnabled: boolean;
  attendance: {
    userId: string;
    status: "present" | "absent" | "late";
  }[];
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type Review = {
  id: string;
  courseId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
};
