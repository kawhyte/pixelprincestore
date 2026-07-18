import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "lucide-react";

import { getAllProducts } from "@/sanity/lib/client";
import { generateMetadata as seoMeta } from "@/lib/seo";
import { getCardAspectClass } from "@/lib/image-utils";
import { etsyUrl } from "@/config/links";
import { resolveEtsyLinks } from "@/config/etsy-categories";
import { COLLECTIONS, getCollection } from "@/config/collections";
import EmailSignupForm from "@/components/common/EmailSignupForm/EmailSignupForm";
import FaqAccordion from "@/components/common/FaqAccordion/FaqAccordion";

export const revalidate = 3600;
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection Not Found" };
  return seoMeta({
    title: collection.title,
    description: collection.metaDescription,
    canonical: `https://www.thepixelprince.com/collections/${slug}`,
  });
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const products = await getAllProducts();
  const matchTags = collection.matchTags.map((t) => t.toLowerCase());
  const matchedProducts =
    matchTags.length === 0
      ? products
      : products.filter((art) => {
          const haystack = [...(art.tags || []), art.category || ""].map((t) => t.toLowerCase());
          return matchTags.some((tag) => haystack.some((h) => h.includes(tag)));
        });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: collection.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl font-bold text-charcoal lg:text-5xl">
            {collection.title}
          </h1>
          <div className="mt-6 space-y-4">
            {collection.intro.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-soft-charcoal">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-12">
          {matchedProducts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-base text-muted-foreground sm:text-lg">
                New pieces are coming to this collection — join the list to hear first.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
              {matchedProducts.map((art) => {
                const etsyLinks = resolveEtsyLinks(art);
                return (
                  <div
                    key={art.id}
                    className="group block overflow-hidden rounded-2xl bg-sage-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <Link href={`/art/${art.id}`} className="block">
                      <div
                        className={`relative ${
                          art.previewImageOrientation
                            ? getCardAspectClass(art.previewImageOrientation.orientation)
                            : "aspect-[3/4]"
                        } overflow-hidden bg-muted`}
                      >
                        <Image
                          src={art.previewImage}
                          alt={art.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      </div>
                      <div className="space-y-2 p-4 sm:p-5">
                        <h3 className="line-clamp-2 font-serif text-lg font-bold leading-snug text-charcoal sm:text-xl">
                          {art.title}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {art.description}
                        </p>
                      </div>
                    </Link>
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                      <a
                        href={etsyUrl(etsyLinks.printed, collection.etsyCampaign)}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:text-sage-700"
                      >
                        <Frame className="h-4 w-4" />
                        {etsyLinks.styleLabel
                          ? `Shop ${etsyLinks.styleLabel} prints →`
                          : "Shop prints →"}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-16 rounded-2xl bg-sage-50 p-8">
          <h2 className="font-serif text-2xl font-semibold text-charcoal">
            Get a new free print every month
          </h2>
          <EmailSignupForm source={`collection-${slug}`} className="mt-4 max-w-xl" />
        </div>

        <div className="mt-16 max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold text-charcoal">Common questions</h2>
          <div className="mt-6">
            <FaqAccordion faq={collection.faq} />
          </div>
        </div>
      </main>
    </div>
  );
}
