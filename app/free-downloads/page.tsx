"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Sparkles, Gift } from "lucide-react";
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
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

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
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Gift className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Free Downloads</h1>
          </div>
          <p className="mt-2 text-zinc-400">
            Claim <span className="font-semibold text-purple-400">one</span> piece of premium digital art — completely free!
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Info Banner */}
        <div className="mb-12 rounded-lg border border-purple-500/20 bg-purple-950/20 p-6">
          <div className="flex items-start gap-4">
            <Sparkles className="h-6 w-6 flex-shrink-0 text-purple-400" />
            <div>
              <h2 className="text-lg font-semibold text-purple-300">How It Works</h2>
              <p className="mt-1 text-zinc-300">
                Choose your favorite piece and claim it as your own. You can only claim{" "}
                <strong>one gift</strong>, so pick wisely! Once claimed, the high-resolution file
                will download automatically to your device.
              </p>
            </div>
          </div>
        </div>

        {/* Art Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {freeArtCollection.map((art) => (
            <div
              key={art.id}
              onClick={() => handleCardClick(art)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-zinc-950">
                <Image
                  src={art.previewImage}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white shadow-lg">
                    <Download className="h-5 w-5" />
                    <span>Claim Now</span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white">{art.title}</h3>
                <p className="mt-1 text-sm text-purple-400">by {art.artist}</p>
                <p className="mt-3 line-clamp-2 text-sm text-zinc-400">{art.description}</p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {art.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Specs */}
                <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-500">
                  <span>{art.dimensions}</span>
                  <span>{art.fileSize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Claim Your Free Gift?</DialogTitle>
            <DialogDescription className="pt-2 text-base">
              You can only claim <strong>one</strong> piece of digital art for free. Once you claim{" "}
              <strong className="text-purple-400">{selectedArt?.title}</strong>, you won&apos;t be able to
              download any other pieces from this collection.
            </DialogDescription>
          </DialogHeader>

          {selectedArt && (
            <div className="my-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={selectedArt.previewImage}
                    alt={selectedArt.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{selectedArt.title}</h4>
                  <p className="text-sm text-zinc-400">by {selectedArt.artist}</p>
                  <div className="mt-2 flex gap-4 text-xs text-zinc-500">
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
            >
              Cancel
            </Button>
            <Button
              onClick={handleClaim}
              disabled={isDownloading}
              className="bg-purple-600 hover:bg-purple-700"
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
