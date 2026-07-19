"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Sparkles, Frame, FileDown, CheckCircle2 } from "lucide-react";

import { type FreeArt } from "@/sanity/lib/client";
import { Button } from "@/components/ui/button";
import { getCardAspectClass } from "@/lib/image-utils";
import ArtGallery from "@/components/common/ArtGallery/ArtGallery";
import EmailGateDialog from "@/components/common/EmailGateDialog/EmailGateDialog";
import EtsyLink from "@/components/common/EtsyLink/EtsyLink";
import ArtCard from "@/components/common/ArtCard/ArtCard";
import { LICENSE_SUMMARY } from "@/config/license";
import { etsyUrl } from "@/config/links";
import { resolveEtsyLinks } from "@/config/etsy-categories";
import { PRINT_SIZES, deriveRatio } from "@/config/print-sizes";

interface ArtDetailClientProps {
  art: FreeArt;
  relatedArt: FreeArt[];
}

export default function ArtDetailClient({ art, relatedArt }: ArtDetailClientProps) {
  const [gateOpen, setGateOpen] = useState(false);
  const etsyLinks = resolveEtsyLinks(art);

  const ratio = art.artFile?.width && art.artFile?.height
    ? deriveRatio(art.artFile.width, art.artFile.height)
    : null;
  const printSizes = PRINT_SIZES[ratio ?? "4:5"];
  const hasFile = !!(art.artFile?.cloudinaryUrl || art.artFile?.externalUrl);

  const aspectClass = art.previewImageOrientation
    ? getCardAspectClass(art.previewImageOrientation.orientation)
    : "aspect-3/4";
  const slides = [
    { url: art.detailImage || art.previewImage, alt: art.title },
    ...(art.galleryImages ?? []),
  ];

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
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr]">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <ArtGallery images={slides} title={art.title} aspectClass={aspectClass} />

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {art.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-sage-100 px-3 py-1 text-sm font-medium text-sage-700"
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
              <h1 className="text-4xl font-bold text-charcoal lg:text-5xl">
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

            {/* Etsy cross-sell — quiet card */}
            <div className="space-y-3 rounded-md border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-charcoal">
                Love this style?
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <EtsyLink
                  href={etsyUrl(etsyLinks.printed, `art-${art.id}`)}
                  className="flex items-center justify-center gap-2 rounded-md bg-charcoal px-6 py-3 font-semibold text-cream transition-all hover:shadow-md"
                >
                  <Frame className="h-5 w-5" />
                  {etsyLinks.styleLabel ? `Shop ${etsyLinks.styleLabel} prints` : "Shop the print shop"}
                </EtsyLink>
                <EtsyLink
                  href={etsyUrl(etsyLinks.printable, `art-${art.id}`)}
                  className="flex items-center justify-center gap-2 rounded-md border border-charcoal px-6 py-3 font-semibold text-charcoal transition-all hover:bg-charcoal hover:text-cream"
                >
                  <FileDown className="h-5 w-5" />
                  {etsyLinks.styleLabel ? `Printable ${etsyLinks.styleLabel} bundles` : "Shop printable bundles"}
                </EtsyLink>
              </div>
              <p className="text-xs text-muted-foreground">
                Prints & bundles on Etsy — this exact piece stays free below.
              </p>
            </div>

            {/* Print Sizes */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-charcoal">
                Prints At 3 Sizes
              </h2>

              <div className="grid gap-3 sm:grid-cols-3">
                {printSizes.map((size) => (
                  <div
                    key={size.label}
                    className="rounded-md border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sage-500" />
                      <span className="font-semibold text-charcoal">{size.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{size.cm}</p>
                    <p className="mt-2 text-xs text-sage-600">{size.fits}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-soft-charcoal">
                One high-res file covers all three sizes — a step-by-step printing guide is included in your download.
              </p>
            </div>

            {/* Download Button */}
            <div className="space-y-3">
              <Button
                onClick={() => setGateOpen(true)}
                disabled={!hasFile}
                className="w-full rounded-md bg-sage-500 py-6 text-lg font-semibold hover:bg-sage-400 disabled:opacity-50"
                size="lg"
              >
                <Download className="h-5 w-5" />
                <span className="ml-2">Email me this print — free</span>
              </Button>
            </div>

            {/* Info Banner */}
            <div className="rounded-md border border-sage-200 bg-sage-50 p-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-charcoal">
                <Sparkles className="h-5 w-5 text-sage-600" />
                High-Resolution Printable File
              </h3>
              <p className="mb-3 text-sm text-soft-charcoal">
                Your download includes: the high-res PNG, a printing guide (PDF), and the personal-use license.
              </p>
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
            <h2 className="mb-8 text-3xl font-bold text-charcoal">
              You Might Also Like
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArt.map((relatedItem) => (
                <ArtCard
                  key={relatedItem.id}
                  art={relatedItem}
                  href={`/art/${relatedItem.id}`}
                  subtitle={relatedItem.category}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <EmailGateDialog
        open={gateOpen}
        onOpenChange={setGateOpen}
        artId={art.id}
        artTitle={art.title}
      />
    </div>
  );
}
