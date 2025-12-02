"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Package, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

import { type FreeArt, type ArtSize } from "@/sanity/lib/client";
import { Button } from "@/components/ui/button";
import { useDownloadTracking } from "@/lib/use-download-tracking";

interface ArtDetailClientProps {
  art: FreeArt;
}

export default function ArtDetailClient({ art }: ArtDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<ArtSize | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const tracking = useDownloadTracking();

  // Select first available size by default
  if (!selectedSize && art.sizes.length > 0) {
    const firstAvailable = art.sizes.find(size => size.availability === 'available');
    if (firstAvailable) {
      setSelectedSize(firstAvailable);
    }
  }

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ["#7a9d66", "#d4bfae", "#cbbfdd", "#f3f1e8"],
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleDownloadSize = async () => {
    if (!selectedSize) return;
    setIsDownloading(true);

    try {
      const response = await fetch(
        `/api/claim-art?artId=${art.id}&sizeId=${selectedSize.id}`
      );

      if (!response.ok) {
        const error = await response.json();

        if (response.status === 403) {
          toast.error("Download limit reached", {
            description: error.error || "You've reached your download limit.",
            duration: 5000,
          });
        } else {
          toast.error("Download failed", {
            description: error.error || "Please try again later.",
          });
        }

        setIsDownloading(false);
        tracking.refresh();
        return;
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${art.title.replace(/\s+/g, "-")}-${selectedSize.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Success! Trigger confetti and toast
      triggerConfetti();
      toast.success("🎉 Download successful!", {
        description: `${art.title} (${selectedSize.displayLabel || selectedSize.label}) is now in your downloads folder.`,
        duration: 6000,
      });

      // Refresh tracking
      tracking.refresh();
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);

    try {
      const response = await fetch(
        `/api/claim-art?artId=${art.id}&type=all`
      );

      if (!response.ok) {
        const error = await response.json();

        if (response.status === 403) {
          toast.error("Download limit reached", {
            description: error.error || "You've reached your download limit.",
            duration: 5000,
          });
        } else {
          toast.error("Download failed", {
            description: error.error || "Please try again later.",
          });
        }

        setIsDownloading(false);
        tracking.refresh();
        return;
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${art.title.replace(/\s+/g, "-")}-all-sizes.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Success! Trigger confetti and toast
      triggerConfetti();
      toast.success("🎉 Download successful!", {
        description: `${art.title} (All Sizes) is now in your downloads folder.`,
        duration: 6000,
      });

      // Refresh tracking
      tracking.refresh();
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

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
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted shadow-xl">
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

            {/* Size Selector */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-charcoal">
                Choose Your Size
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {art.sizes.map((size) => {
                  const isDownloaded = tracking.hasDownloadedSize(art.id, size.id);
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
                          : isDownloaded
                          ? "border-lavender-200 bg-lavender-50/50 opacity-75"
                          : "border-border bg-card hover:border-sage-200 hover:bg-sage-50/50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className={`font-semibold ${isDownloaded || isComingSoon ? "text-muted-foreground" : "text-charcoal"}`}>
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
                          {!isComingSoon && selectedSize?.id === size.id && !isDownloaded && (
                            <div className="h-5 w-5 rounded-full bg-sage-500 flex items-center justify-center">
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          {!isComingSoon && isDownloaded && (
                            <span className="text-xs font-medium text-sage-600">
                              Downloaded ✓
                            </span>
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
                onClick={handleDownloadSize}
                disabled={!selectedSize || selectedSize.availability !== 'available' || isDownloading || tracking.remaining === 0}
                className="w-full rounded-2xl bg-sage-500 py-6 text-lg font-semibold hover:bg-sage-400 disabled:opacity-50"
                size="lg"
              >
                {isDownloading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span className="ml-2">Downloading...</span>
                  </>
                ) : tracking.remaining === 0 ? (
                  <>
                    <Download className="h-5 w-5" />
                    <span className="ml-2">Weekly Limit Reached</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span className="ml-2">
                      Download {selectedSize?.displayLabel || selectedSize?.label || "Selected Size"}
                    </span>
                  </>
                )}
              </Button>

              {/* Only show ZIP download button if zipUrl is available */}
              {art.zipUrl && (
                <>
                  {tracking.hasDownloadedAllSizes(art.id) ? (
                    <div className="w-full rounded-2xl border-2 border-lavender-200 bg-lavender-50 py-6 text-center">
                      <p className="text-lg font-semibold text-muted-foreground">
                        ZIP Already Downloaded ✓
                      </p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleDownloadAll}
                      disabled={isDownloading || tracking.remaining === 0}
                      variant="outline"
                      className="w-full rounded-2xl border-2 border-charcoal py-6 text-lg font-semibold hover:bg-charcoal hover:text-cream disabled:opacity-50"
                      size="lg"
                    >
                      {isDownloading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          <span className="ml-2">Preparing...</span>
                        </>
                      ) : tracking.remaining === 0 ? (
                        <>
                          <Package className="h-5 w-5" />
                          <span className="ml-2">Weekly Limit Reached</span>
                        </>
                      ) : (
                        <>
                          <Package className="h-5 w-5" />
                          <span className="ml-2">Download All Sizes (ZIP)</span>
                        </>
                      )}
                    </Button>
                  )}
                </>
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
            </div>

            {/* Weekly Limit Info */}
            <div className="rounded-2xl bg-lavender-50 p-6">
              {tracking.isLoading ? (
                <p className="text-sm text-soft-charcoal">Loading download status...</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-soft-charcoal">
                    <strong className="text-charcoal">Free downloads:</strong> {tracking.message}
                  </p>
                  {tracking.remaining > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Choose wisely or grab the ZIP to get all sizes at once!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
