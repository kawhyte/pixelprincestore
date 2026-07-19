"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FreeArt } from "@/sanity/lib/client";
import ArtCard from "@/components/common/ArtCard/ArtCard";

interface FreeDownloadsClientProps {
  products: FreeArt[];
}

export default function FreeDownloadsClient({ products }: FreeDownloadsClientProps) {
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

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
              Free Wall Art Downloads
            </h1>
            <p className="mt-3 text-base text-soft-charcoal sm:text-lg">
              Free print-ready wall art, delivered to your inbox. 3 downloads a week.
            </p>
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
              <h2 className="text-xl font-semibold text-charcoal sm:text-2xl">How It Works</h2>
              <p className="mt-2 text-base leading-relaxed text-soft-charcoal sm:text-lg">
                Browse our collection and download up to{" "}
                <strong className="text-sage-500">3 sizes per week</strong>. Choose individual sizes or grab them all in a ZIP file. Each piece is available in 4 print-ready sizes, perfect for any frame or space.
              </p>
            </div>
          </div>
        </div> */}

        {/* Art Grid */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">
              No free art available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
            {products.map((art) => (
              <ArtCard
                key={art.id}
                art={art}
                href={`/art/${art.id}`}
                subtitle={art.category}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
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
