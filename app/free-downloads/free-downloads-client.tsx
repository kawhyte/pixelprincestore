"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Sparkles, Gift, ArrowLeft } from "lucide-react";

import { useDownloadTracking } from "@/lib/use-download-tracking";
import { FreeArt } from "@/sanity/lib/client";

// Earth-tone variant assignment
const variants = ["sage", "clay", "lavender", "sage"] as const;

const variantStyles = {
  sage: "bg-sage-50 hover:bg-sage-100",
  clay: "bg-clay-50 hover:bg-clay-100",
  lavender: "bg-lavender-50 hover:bg-lavender-100",
  cream: "bg-card hover:bg-secondary",
};

interface FreeDownloadsClientProps {
  products: FreeArt[];
}

export default function FreeDownloadsClient({ products }: FreeDownloadsClientProps) {
  const tracking = useDownloadTracking();

  // Assign earth-tone variants to each art piece
  const artWithVariants = products.map((art, index) => ({
    ...art,
    variant: variants[index % 4],
  }));

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Back to Home */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-sage-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-sage-100 sm:h-16 sm:w-16">
              <Gift className="h-6 w-6 text-sage-500 sm:h-8 sm:w-8" />
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
                Free Wall Art Downloads
              </h1>
              <p className="mt-2 text-base text-soft-charcoal sm:text-lg">
                Download <span className="font-semibold text-sage-500">3 sizes per week</span> — completely free!
              </p>
              {!tracking.isLoading && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {tracking.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* https://thepixelprince.netlify.app/ */}
        {/* Info Banner */}
        {/* <div className="mb-12 rounded-2xl border border-sage-200 bg-sage-50 p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-sage-100">
              <Sparkles className="h-6 w-6 text-sage-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-xl font-semibold text-charcoal sm:text-2xl">How It Works</h2>
              <p className="mt-2 text-base leading-relaxed text-soft-charcoal sm:text-lg">
                Browse our collection and download up to{" "}
                <strong className="text-sage-500">3 sizes per week</strong>. Choose individual sizes or grab them all in a ZIP file. Each piece is available in 4 print-ready sizes, perfect for any frame or space.
              </p>
            </div>
          </div>
        </div> */}

        {/* Art Grid */}
        {artWithVariants.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">
              No free art available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {artWithVariants.map((art) => (
              <Link
                key={art.id}
                href={`/art/${art.id}`}
                className={`group block overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  variantStyles[art.variant]
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image
                    src={art.previewImage}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white shadow-lg">
                      <Download className="h-5 w-5" />
                      <span>View Details</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-3 p-4 sm:p-5">
                  <h3 className="line-clamp-2 font-serif text-lg font-bold leading-snug text-charcoal sm:text-xl">
                    {art.title}
                  </h3>
                  <p className="text-sm text-sage-500">by {art.artist}</p>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {art.description}
                  </p>

                  {/* Tags */}
                  {art.tags && art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {art.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-soft-charcoal"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Available Sizes */}
                  <div className="border-t border-border/50 pt-3">
                    <p className="text-xs text-muted-foreground">
                      {art.sizes.length} sizes available
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-base text-muted-foreground sm:text-lg">
            Looking for more art?
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-2xl border-2 border-charcoal bg-transparent px-8 py-4 font-semibold text-charcoal transition-all hover:bg-charcoal hover:text-cream hover:shadow-lg"
          >
            Browse Full Collection
          </Link>
        </div>
      </main>
    </div>
  );
}
