import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/sanity/lib/blog";
import { generateMetadata as seoMeta } from "@/lib/seo";
import EmailSignupForm from "@/components/common/EmailSignupForm/EmailSignupForm";

export const revalidate = 60;

export const metadata = seoMeta({
  title: "Blog",
  description:
    "Practical guides on game room decor, printable wall art, and framing — from a real human designer.",
  canonical: "https://www.thepixelprince.com/blog",
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-cream">
      <main className="container mx-auto px-4 py-12 sm:py-16">
        <h1 className="font-serif text-4xl font-bold text-charcoal lg:text-5xl">Blog</h1>

        {posts.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-base text-muted-foreground sm:text-lg">
              First post is in the works — join the list and you won&apos;t miss it.
            </p>
            <EmailSignupForm source="blog-index" className="mx-auto mt-4 max-w-xl" />
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl bg-sage-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {post.hero && (
                    <Image
                      src={post.hero}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {formatDate(post.publishedAt)}
                  </p>
                  <h2 className="line-clamp-2 font-serif text-xl font-bold leading-snug text-charcoal">
                    {post.title}
                  </h2>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
