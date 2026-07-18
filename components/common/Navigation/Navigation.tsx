"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ETSY_MAIN_SHOP, ETSY_PRINTABLES_SHOP, etsyUrl } from "@/config/links";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
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
                href="/about"
                className="font-sans text-sm font-medium text-charcoal transition-colors hover:text-sage-500"
              >
                About
              </Link>
              <Link
                href="/blog"
                className="font-sans text-sm font-medium text-charcoal transition-colors hover:text-sage-500"
              >
                Blog
              </Link>
              <Link
                href="/free-downloads"
                className="rounded-2xl bg-sage-500 px-6 py-2.5 font-sans text-sm font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-md"
              >
                Free Downloads
              </Link>
              <a
                href={etsyUrl(ETSY_MAIN_SHOP, "nav")}
                target="_blank"
                rel="noopener"
                className="font-sans text-sm font-medium text-charcoal transition-colors hover:text-sage-500"
              >
                Print Shop
              </a>
              <a
                href={etsyUrl(ETSY_PRINTABLES_SHOP, "nav")}
                target="_blank"
                rel="noopener"
                className="font-sans text-sm font-medium text-charcoal transition-colors hover:text-sage-500"
              >
                Printables
              </a>
            </div>

            {/* Mobile right-side controls */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="z-50 rounded-lg p-2 text-charcoal transition-colors hover:bg-sage-100"
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
        </div>
      </nav>

      {/* Mobile Menu - moved outside nav to escape backdrop-filter stacking context */}
      <div
        className={`fixed inset-0 top-16 z-40 transform bg-[#f3f1e8] transition-transform duration-300 md:hidden ${
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
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 font-sans text-base font-medium text-charcoal transition-colors hover:bg-sage-100 hover:text-sage-500"
          >
            About
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 font-sans text-base font-medium text-charcoal transition-colors hover:bg-sage-100 hover:text-sage-500"
          >
            Blog
          </Link>
          <a
            href={etsyUrl(ETSY_MAIN_SHOP, "nav-mobile")}
            target="_blank"
            rel="noopener"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 font-sans text-base font-medium text-charcoal transition-colors hover:bg-sage-100 hover:text-sage-500"
          >
            Print Shop
          </a>
          <a
            href={etsyUrl(ETSY_PRINTABLES_SHOP, "nav-mobile")}
            target="_blank"
            rel="noopener"
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-xl px-4 py-3 font-sans text-base font-medium text-charcoal transition-colors hover:bg-sage-100 hover:text-sage-500"
          >
            Printables
          </a>
          <Link
            href="/free-downloads"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 rounded-2xl bg-sage-500 px-6 py-3 text-center font-sans text-base font-semibold text-white transition-all hover:bg-sage-400"
          >
            Free Downloads
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
