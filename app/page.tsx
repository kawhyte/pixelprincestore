import Link from "next/link";

import Hero from "@/components/ui/Hero/Hero";
import EtsyLink from "@/components/common/EtsyLink/EtsyLink";
import ArtCard from "@/components/common/ArtCard/ArtCard";
import { getAllProducts, getFeaturedProduct } from "@/sanity/lib/client";
import { ETSY_MAIN_SHOP, ETSY_PRINTABLES_SHOP, etsyUrl } from "@/config/links";

const variants = ["sage", "clay", "lavender", "sage"] as const;

export default async function Home() {
  const products = await getAllProducts();
  const featured = (await getFeaturedProduct()) ?? products[0] ?? null;
  const totalDownloads = products.reduce((sum, p) => sum + (p.downloads || 0), 0);
  const gridProducts = products.slice(0, 8).map((art, index) => ({
    ...art,
    variant: variants[index % 4],
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero featured={featured} totalDownloads={totalDownloads} />

      {/* Free Art Grid */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
              Browse the free collection
            </h2>
          </div>

          {gridProducts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-cream p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No free art available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
              {gridProducts.map((art) => (
                <ArtCard
                  key={art.id}
                  art={art}
                  href={`/art/${art.id}`}
                  variant={art.variant}
                  subtitle={art.category}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link
              href="/free-downloads"
              className="inline-block rounded-2xl border-2 border-charcoal bg-transparent px-8 py-4 font-semibold text-charcoal transition-all hover:bg-charcoal hover:text-cream hover:shadow-lg"
            >
              See all free downloads
            </Link>
          </div>
        </div>
      </section>

      {/* Etsy Band */}
      <section className="bg-sage-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
              Want it printed, framed and shipped?
            </h2>
            <p className="mt-3 text-sm text-soft-charcoal">
              Printed in the USA · Free US shipping · 7,000+ orders shipped on Etsy
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-cream p-8 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-charcoal">
                The Pixel Prince on Etsy
              </h3>
              <p className="mt-2 text-sm text-soft-charcoal">
                Printed prints, maps &amp; personalized pieces
              </p>
              <EtsyLink
                href={etsyUrl(ETSY_MAIN_SHOP, "home")}
                className="mt-6 inline-block rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-lg"
              >
                Visit the print shop
              </EtsyLink>
            </div>

            <div className="rounded-2xl bg-cream p-8 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-charcoal">
                Pixel Prince Printables
              </h3>
              <p className="mt-2 text-sm text-soft-charcoal">
                Instant-download bundles
              </p>
              <EtsyLink
                href={etsyUrl(ETSY_PRINTABLES_SHOP, "home")}
                className="mt-6 inline-block rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-lg"
              >
                Browse printables
              </EtsyLink>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            {/* TODO(KENNY): real photo of Kenny & Rene — placeholder monogram until then */}
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-2xl font-semibold tracking-tight text-sage-600">
              PP
            </div>
            <p className="text-base leading-relaxed text-soft-charcoal sm:text-lg">
              We&apos;re Kenny and Rene — we design every piece ourselves,
              inspired by the places we&apos;ve traveled and things we&apos;ve experienced.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
