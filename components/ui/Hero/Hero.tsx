"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Hero() {
  const [animationData, setAnimationData] = useState(null);
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted for hydration
    setIsMounted(true);

    // Try to load the animation file when component mounts
    fetch("/animations/hero-art.json")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Animation not found");
      })
      .then((data) => {
        setAnimationData(data);
        // Delay showing animation slightly to ensure smooth transition
        setTimeout(() => setIsAnimationReady(true), 100);
      })
      .catch(() => {
        // Animation file not uploaded yet - keep fallback image shown
        setAnimationData(null);
      });
  }, []);

  return (
    <section className="relative overflow-hidden bg-cream py-20 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="inline-block">
              <span className="rounded-full bg-sage-100 px-4 py-2 text-sm font-medium text-sage-500">
                Pixel Masterpieces. 100% Free.
              </span>
            </div>

            {/* Headline - Massive Serif */}
            <h1 className="text-balance font-serif text-4xl font-bold leading-tight tracking-tight text-charcoal sm:text-5xl lg:text-7xl">
            Premium Digital Wall Art.
            </h1>

            {/* Subheadline */}
            <p className="text-balance text-lg leading-relaxed text-soft-charcoal sm:text-xl lg:text-2xl">
              Discover curated digital art for modern living. Premium posters,
              video game decor, and world maps—ready for instant download. No account needed.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-sage-500 px-8 py-6 text-lg font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-lg"
              >
                <Link href="/free-downloads">Start Downloading</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl border-2 border-charcoal bg-transparent px-8 py-6 text-lg font-semibold text-charcoal transition-all hover:bg-charcoal hover:text-cream"
              >
                <Link href="#collection">View Collections</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-cream from-sage-300 to-lavender-300"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-charcoal">2,500+</span>{" "}
                customers have transformed their spaces
              </p>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            {/* Floating Card Animation */}
            <div className="relative">
              {/* Main Visual Container - Fixed aspect ratio to prevent layout shift */}
              <div className="relative z-10 transform transition-transform duration-700 hover:scale-105">
                <div className="overflow-hidden">
                  <div className="relative aspect-square w-full" style={{ background: 'transparent' }}>
                    {/* Priority-loaded fallback image for optimal LCP */}
                    <Image
                      src="/animations/hero-fallback.webp"
                      alt="The Pixel Prince Store - Premium Digital Art"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`object-contain transition-opacity duration-500 ${
                        isMounted && isAnimationReady && animationData
                          ? 'opacity-0'
                          : 'opacity-100'
                      }`}
                      style={{ mixBlendMode: 'multiply' }}
                    />

                    {/* Lottie Animation - Only shown after hydration and loading */}
                    {isMounted && animationData && (
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          isAnimationReady ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <Lottie
                          animationData={animationData}
                          loop={true}
                          autoplay={true}
                          className="h-full w-full"
                          style={{
                            background: 'transparent',
                            mixBlendMode: 'multiply'
                          }}
                          rendererSettings={{
                            preserveAspectRatio: 'xMidYMid meet'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
