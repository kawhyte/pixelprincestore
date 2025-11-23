"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-cream/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group z-50">
            <h1 className="font-serif text-xl font-bold text-charcoal transition-colors group-hover:text-sage-500 sm:text-2xl">
              The Pixel Prince
            </h1>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            <Link
              href="/"
              className="font-sans text-sm font-medium text-charcoal transition-colors hover:text-sage-500"
            >
              Home
            </Link>
            <Link
              href="#collection"
              className="font-sans text-sm font-medium text-charcoal transition-colors hover:text-sage-500"
            >
              Shop
            </Link>
            <Link
              href="/free-downloads"
              className="rounded-2xl bg-sage-500 px-6 py-2.5 font-sans text-sm font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-md"
            >
              Free Downloads
            </Link>
          </div>

          {/* Mobile Menu Button - Visible on mobile only */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="z-50 rounded-lg p-2 text-charcoal transition-colors hover:bg-sage-100 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Slide in from right */}
      <div
        className={`fixed inset-0 top-16 z-40 transform bg-cream transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-1 p-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 font-sans text-base font-medium text-charcoal transition-colors hover:bg-sage-100 hover:text-sage-500"
          >
            Home
          </Link>
          <Link
            href="#collection"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 font-sans text-base font-medium text-charcoal transition-colors hover:bg-sage-100 hover:text-sage-500"
          >
            Shop
          </Link>
          <Link
            href="/free-downloads"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 rounded-2xl bg-sage-500 px-6 py-3 text-center font-sans text-base font-semibold text-white transition-all hover:bg-sage-400"
          >
            Free Downloads
          </Link>
        </div>
      </div>

      {/* Overlay - Click to close mobile menu */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-sm md:hidden"
        />
      )}
    </nav>
  );
}
