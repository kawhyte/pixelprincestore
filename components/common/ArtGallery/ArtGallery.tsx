"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ArtGallerySlide {
  url: string;
  alt: string;
}

interface ArtGalleryProps {
  images: ArtGallerySlide[];
  /** Fallback alt when a slide carries none. */
  title?: string;
  /** Aspect ratio class for the frame — the CLS guard. */
  aspectClass?: string;
}

export default function ArtGallery({
  images,
  title = "",
  aspectClass = "aspect-3/4",
}: ArtGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToSlide = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
    }
  }, []);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slideWidth = track.clientWidth || 1;
    setActive(Math.round(track.scrollLeft / slideWidth));
  }, []);

  // Keep active dot in sync if the viewport resizes.
  useEffect(() => {
    onScroll();
  }, [onScroll]);

  // Single image: render exactly like the pre-carousel markup — no chrome.
  if (images.length === 1) {
    const only = images[0];
    return (
      <div
        className={`relative ${aspectClass} overflow-hidden rounded-md bg-muted shadow-xl`}
      >
        <Image
          src={only.url}
          alt={only.alt || title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    );
  }

  const total = images.length;
  const go = (dir: -1 | 1) =>
    scrollToSlide(Math.min(Math.max(active + dir, 0), total - 1));

  return (
    <div className="space-y-3">
      <div
        className={`group relative ${aspectClass} overflow-hidden rounded-md bg-muted shadow-xl`}
      >
        <div
          ref={trackRef}
          onScroll={onScroll}
          role="group"
          aria-roledescription="carousel"
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((img, i) => (
            <div
              key={`${img.url}-${i}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              className="relative h-full w-full shrink-0 snap-center"
            >
              <Image
                src={img.url}
                alt={img.alt || title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Desktop chevrons — hidden on touch */}
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => go(-1)}
          disabled={active === 0}
          className="absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 p-2 text-charcoal shadow-md transition hover:bg-cream disabled:pointer-events-none disabled:opacity-0 md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => go(1)}
          disabled={active === total - 1}
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 p-2 text-charcoal shadow-md transition hover:bg-cream disabled:pointer-events-none disabled:opacity-0 md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots — mobile (44px tall hit area, small visual dot) */}
      <div className="-my-3 flex justify-center gap-1 md:hidden">
        {images.map((_, i) => (
          <button
            type="button"
            key={i}
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === active}
            onClick={() => scrollToSlide(i)}
            className="flex h-11 items-center px-1"
          >
            <span
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-sage-500" : "w-2 bg-sage-200"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Thumbnails — desktop */}
      <div className="hidden gap-3 md:flex">
        {images.map((img, i) => (
          <button
            type="button"
            key={`${img.url}-thumb-${i}`}
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === active}
            onClick={() => scrollToSlide(i)}
            className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${
              i === active ? "border-sage-500" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              src={img.url}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
