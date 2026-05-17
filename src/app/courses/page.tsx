import { CourseCatalog } from "@/components/courses/CourseCatalog";
import { MarketingNav } from "@/components/MarketingNav";
import { listCourses } from "@/lib/store";

export const metadata = {
  title: "Courses",
  description: "Search Raagverse music courses by instrument, level, rating, and price.",
};

export default async function CoursesPage() {
  const courses = await listCourses();

  return (
    <main className="min-h-screen bg-[#070817] text-white">
      <MarketingNav />
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <CourseCatalog courses={courses} />
        </div>
      </section>
    </main>
  );
}
