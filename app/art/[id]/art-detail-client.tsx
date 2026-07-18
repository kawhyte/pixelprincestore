"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Package, Sparkles, Frame, FileDown } from "lucide-react";

import { type FreeArt, type ArtSize } from "@/sanity/lib/client";
import { Button } from "@/components/ui/button";
import { getCardAspectClass } from "@/lib/image-utils";
import EmailGateDialog from "@/components/common/EmailGateDialog/EmailGateDialog";
import EtsyLink from "@/components/common/EtsyLink/EtsyLink";
import { LICENSE_SUMMARY } from "@/config/license";
import { etsyUrl } from "@/config/links";
import { resolveEtsyLinks } from "@/config/etsy-categories";

interface ArtDetailClientProps {
  art: FreeArt;
  relatedArt: FreeArt[];
}

export default function ArtDetailClient({ art, relatedArt }: ArtDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<ArtSize | null>(
    () => art.sizes.find((s) => s.availability === "available") ?? null
  );
  const [gateSize, setGateSize] = useState<{ sizeId: string; sizeLabel: string } | null>(null);
  const etsyLinks = resolveEtsyLinks(art);

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/free-downloads"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-sage-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Free Downloads
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <div className={`relative ${
              art.previewImageOrientation
                ? getCardAspectClass(art.previewImageOrientation.orientation)
                : 'aspect-3/4'
            } overflow-hidden rounded-2xl bg-muted shadow-xl`}>
              <Image
                src={art.detailImage || art.previewImage}
                alt={art.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {art.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-sage-100 px-4 py-2 text-sm font-medium text-sage-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            {/* Title & Artist */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl font-bold text-charcoal lg:text-5xl">
                {art.title}
              </h1>
              <p className="text-lg text-sage-500">by {art.artist}</p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-soft-charcoal">
                {art.longDescription || art.description}
              </p>
            </div>

            {/* Etsy CTAs */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-semibold text-charcoal">
                Love this style?
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <EtsyLink
                  href={etsyUrl(etsyLinks.printed, `art-${art.id}`)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-charcoal px-6 py-4 font-semibold text-cream transition-all hover:shadow-lg"
                >
                  <Frame className="h-5 w-5" />
                  {etsyLinks.styleLabel ? `Shop ${etsyLinks.styleLabel} prints` : "Shop the print shop"}
                </EtsyLink>
                <EtsyLink
                  href={etsyUrl(etsyLinks.printable, `art-${art.id}`)}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-charcoal px-6 py-4 font-semibold text-charcoal transition-all hover:bg-charcoal hover:text-cream"
                >
                  <FileDown className="h-5 w-5" />
                  {etsyLinks.styleLabel ? `Printable ${etsyLinks.styleLabel} bundles` : "Shop printable bundles"}
                </EtsyLink>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Prints & bundles on Etsy — this exact piece stays free below.
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-charcoal">
                Choose Your Size
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {art.sizes.map((size) => {
                  const isComingSoon = size.availability === 'coming-soon';
                  const isAvailable = size.availability === 'available';

                  return (
                    <button
                      key={size.id}
                      onClick={() => isAvailable ? setSelectedSize(size) : null}
                      disabled={isComingSoon}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        isComingSoon
                          ? "cursor-not-allowed border-border bg-muted/30 opacity-60"
                          : selectedSize?.id === size.id
                          ? "border-sage-500 bg-sage-50 shadow-md"
                          : "border-border bg-card hover:border-sage-200 hover:bg-sage-50/50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className={`font-semibold ${isComingSoon ? "text-muted-foreground" : "text-charcoal"}`}>
                              {size.displayLabel || size.label}
                            </span>
                            {size.alternateLabel && (
                              <span className="text-xs text-muted-foreground">
                                {size.alternateLabel}
                              </span>
                            )}
                          </div>
                          {isComingSoon && (
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                              Coming Soon
                            </span>
                          )}
                          {!isComingSoon && selectedSize?.id === size.id && (
                            <div className="h-5 w-5 rounded-full bg-sage-500 flex items-center justify-center">
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {size.dimensions}
                        </p>
                        {isComingSoon && size.comingSoonMessage && (
                          <p className="text-xs font-medium text-amber-600">
                            {size.comingSoonMessage}
                          </p>
                        )}
                        {!isComingSoon && size.recommendedFor && (
                          <p className="text-xs text-sage-600">
                            {size.recommendedFor}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-charcoal">
                            {size.fileSize}
                          </p>
                          {!isComingSoon && (
                            <div className="flex items-center gap-1 text-xs font-medium text-lavender-600">
                              <Sparkles className="h-3 w-3" />
                              <span>High-Res PNG</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() =>
                  selectedSize &&
                  setGateSize({
                    sizeId: selectedSize.id,
                    sizeLabel: selectedSize.displayLabel || selectedSize.id,
                  })
                }
                disabled={!selectedSize || selectedSize.availability !== 'available'}
                className="w-full rounded-2xl bg-sage-500 py-6 text-lg font-semibold hover:bg-sage-400 disabled:opacity-50"
                size="lg"
              >
                <Download className="h-5 w-5" />
                <span className="ml-2">Email me this size — free</span>
              </Button>

              {/* Only show ZIP download button if zipUrl is available */}
              {art.zipUrl && (
                <Button
                  onClick={() => setGateSize({ sizeId: "all", sizeLabel: "All sizes (ZIP)" })}
                  variant="outline"
                  className="w-full rounded-2xl border-2 border-charcoal py-6 text-lg font-semibold hover:bg-charcoal hover:text-cream disabled:opacity-50"
                  size="lg"
                >
                  <Package className="h-5 w-5" />
                  <span className="ml-2">Email me all sizes (ZIP) — free</span>
                </Button>
              )}
            </div>

            {/* Info Banner */}
            <div className="rounded-2xl border border-sage-200 bg-sage-50 p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-charcoal">
                <Sparkles className="h-5 w-5 text-sage-600" />
                High-Resolution Printable Files
              </h3>
              <p className="mb-3 text-sm text-soft-charcoal">
                All downloads are professional quality PNG files, perfect for printing at home or at your local print shop.
              </p>
              {art.zipUrl && (
                <>
                  <p className="mb-3 text-sm font-semibold text-charcoal">
                    📦 ZIP includes all available sizes:
                  </p>
                  <ul className="space-y-1 text-sm text-soft-charcoal">
                    {art.sizes.filter(size => size.availability === 'available').map((size) => (
                      <li key={size.id} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                        {size.displayLabel || size.label} {size.alternateLabel && `(${size.alternateLabel})`} - {size.dimensions} ({size.fileSize})
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="mt-4 border-t border-sage-200 pt-3 text-xs text-muted-foreground">
                {LICENSE_SUMMARY}{" "}
                <Link href="/terms" className="underline hover:text-sage-500">
                  Full license
                </Link>
              </p>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedArt.length > 0 && (
          <section className="mt-20 border-t border-border pt-12">
            <h2 className="mb-8 font-serif text-3xl font-bold text-charcoal">
              You Might Also Like
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArt.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  href={`/art/${relatedItem.id}`}
                  className="group block overflow-hidden rounded-2xl bg-card shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={`relative ${
                    relatedItem.previewImageOrientation
                      ? getCardAspectClass(relatedItem.previewImageOrientation.orientation)
                      : 'aspect-3/4'
                  } overflow-hidden bg-muted`}>
                    <Image
                      src={relatedItem.previewImage}
                      alt={relatedItem.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-charcoal group-hover:text-sage-600 transition-colors">
                      {relatedItem.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {relatedItem.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <EmailGateDialog
        open={!!gateSize}
        onOpenChange={(o) => !o && setGateSize(null)}
        artId={art.id}
        artTitle={art.title}
        sizeId={gateSize?.sizeId ?? ""}
        sizeLabel={gateSize?.sizeLabel ?? ""}
      />
    </div>
  );
}
