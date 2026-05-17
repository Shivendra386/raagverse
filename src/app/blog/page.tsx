import { MarketingNav } from "@/components/MarketingNav";
import { seedBlogPosts } from "@/data/seed";

export const metadata = {
  title: "Music Tips Blog",
  description: "SEO-friendly music tips, practice guides, raag explainers, and learner resources.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#070817] text-white">
      <MarketingNav />
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f4a742]">Raagverse Journal</p>
          <h1 className="mt-3 font-serif text-5xl">Music tips for serious learners.</h1>
          <div className="mt-10 grid gap-5">
            {seedBlogPosts.map((post) => (
              <article key={post.slug} className="rounded-lg border border-white/10 bg-white/[0.05] p-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                  <span className="text-[#f4a742]">{post.category}</span>
                  <span>{post.readTime}</span>
                  <span>{post.publishedAt}</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold">{post.title}</h2>
                <p className="mt-3 text-white/62">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
