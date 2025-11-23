"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Sparkles, Gift, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";

import { freeArtCollection, type FreeArt } from "@/config/free-art";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Assign earth-tone variants to each art piece
const artWithVariants = freeArtCollection.map((art, index) => ({
  ...art,
  variant: (["sage", "clay", "lavender", "sage"] as const)[index % 4],
}));

const variantStyles = {
  sage: "bg-sage-50 hover:bg-sage-100",
  clay: "bg-clay-50 hover:bg-clay-100",
  lavender: "bg-lavender-50 hover:bg-lavender-100",
  cream: "bg-card hover:bg-secondary",
};

export default function FreeDownloadsPage() {
  const [selectedArt, setSelectedArt] = useState<FreeArt | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCardClick = (art: FreeArt) => {
    setSelectedArt(art);
    setIsDialogOpen(true);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ['#7a9d66', '#d4bfae', '#cbbfdd', '#f3f1e8'], // Earth-tone confetti!
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

  const handleClaim = async () => {
    if (!selectedArt) return;

    setIsDownloading(true);

    try {
      const response = await fetch(`/api/claim-art?artId=${selectedArt.id}`);

      if (!response.ok) {
        const error = await response.json();

        if (response.status === 403) {
          toast.error("You have already claimed your free gift!", {
            description: "Each user can only claim one free art piece.",
            duration: 5000,
          });
        } else {
          toast.error("Something went wrong", {
            description: error.error || "Please try again later.",
          });
        }

        setIsDialogOpen(false);
        return;
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedArt.title.replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Success! Trigger confetti and toast
      setIsDialogOpen(false);
      triggerConfetti();

      toast.success("🎉 Congratulations!", {
        description: `${selectedArt.title} is now yours! Check your downloads folder.`,
        duration: 6000,
      });
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
        <div className="container mx-auto px-4 py-8">
          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-sage-500 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-100">
              <Gift className="h-8 w-8 text-sage-500" />
            </div>
            <div>
              <h1 className="font-serif text-4xl font-bold text-charcoal lg:text-5xl">
                Free Downloads
              </h1>
              <p className="mt-2 text-lg text-soft-charcoal">
                Claim <span className="font-semibold text-sage-500">one</span> piece of premium digital art — completely free!
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Info Banner */}
        <div className="mb-12 rounded-2xl border border-sage-200 bg-sage-50 p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-sage-100">
              <Sparkles className="h-6 w-6 text-sage-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-semibold text-charcoal">How It Works</h2>
              <p className="mt-2 text-lg leading-relaxed text-soft-charcoal">
                Choose your favorite piece and claim it as your own. You can only claim{" "}
                <strong className="text-sage-500">one gift</strong>, so pick wisely! Once claimed, the high-resolution file
                will download automatically to your device.
              </p>
            </div>
          </div>
        </div>

        {/* Art Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {artWithVariants.map((art) => (
            <div
              key={art.id}
              onClick={() => handleCardClick(art)}
              className={`group cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
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
                    <span>Claim Now</span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-3 p-5">
                <h3 className="line-clamp-2 font-serif text-xl font-bold leading-snug text-charcoal">
                  {art.title}
                </h3>
                <p className="text-sm text-sage-500">by {art.artist}</p>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {art.description}
                </p>

                {/* Tags */}
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

                {/* Specs */}
                <div className="flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <span>{art.dimensions}</span>
                  <span>{art.fileSize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">
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

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Claim Your Free Gift?</DialogTitle>
            <DialogDescription className="pt-2 text-base">
              You can only claim <strong>one</strong> piece of digital art for free. Once you claim{" "}
              <strong className="text-sage-500">{selectedArt?.title}</strong>, you won&apos;t be able to
              download any other pieces from this collection.
            </DialogDescription>
          </DialogHeader>

          {selectedArt && (
            <div className="my-4 rounded-2xl border border-border bg-sage-50/50 p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={selectedArt.previewImage}
                    alt={selectedArt.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif font-semibold text-charcoal">{selectedArt.title}</h4>
                  <p className="text-sm text-muted-foreground">by {selectedArt.artist}</p>
                  <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                    <span>{selectedArt.dimensions}</span>
                    <span>{selectedArt.fileSize}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isDownloading}
              className="rounded-2xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleClaim}
              disabled={isDownloading}
              className="rounded-2xl bg-sage-500 hover:bg-sage-400"
            >
              {isDownloading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span className="ml-2">Claiming...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span className="ml-2">Claim & Download</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
