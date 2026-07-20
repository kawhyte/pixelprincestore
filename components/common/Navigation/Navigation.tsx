"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Wordmark from "@/components/common/Wordmark/Wordmark";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll while the mobile menu overlay is open.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-cream/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group z-50">
              <Wordmark className="text-xl transition-colors group-hover:text-sage-500 sm:text-2xl" />
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden items-center gap-6 md:flex lg:gap-8">
              <Link
                href="/free-downloads"
                className="rounded-full border border-sage-500 px-5 py-2.5 font-sans text-sm font-semibold text-sage-500 transition-colors hover:bg-sage-500 hover:text-white"
              >
                Free Prints
              </Link>
              <Link
                href="/prints"
                className="font-sans text-sm font-medium text-charcoal transition-colors hover:text-sage-500"
              >
                Prints
              </Link>
              <Link
                href="/about"
                className="font-sans text-sm font-medium text-charcoal transition-colors hover:text-sage-500"
              >
                About
              </Link>
            </div>

            {/* Mobile right-side controls */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="z-50 flex size-11 items-center justify-center rounded-lg text-charcoal transition-colors hover:bg-sage-100"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="size-5" />
                ) : (
                  <Menu className="size-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - moved outside nav to escape backdrop-filter stacking context */}
      <div
        className={`fixed inset-0 top-16 z-40 transform bg-background transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-1 p-4">
          <Link
            href="/prints"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 font-sans text-base font-medium text-charcoal transition-colors hover:bg-sage-100 hover:text-sage-500"
          >
            Prints
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 font-sans text-base font-medium text-charcoal transition-colors hover:bg-sage-100 hover:text-sage-500"
          >
            About
          </Link>
          <Link
            href="/free-downloads"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 rounded-full bg-sage-500 px-6 py-3 text-center font-sans text-base font-semibold text-white transition-all hover:bg-sage-400"
          >
            Free Prints
          </Link>
        </div>
      </div>

      {/* Overlay - moved outside nav */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
