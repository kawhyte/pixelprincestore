"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  return (
    <>
      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-cream shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
          <h2 className="font-serif text-lg font-semibold text-charcoal">Your Collection</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-charcoal transition-colors hover:bg-sage-100"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          {/* Doodle Tote Bag SVG */}
          <svg
            viewBox="0 0 160 180"
            className="mb-6 h-44 w-44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Bag body */}
            <path
              d="M30 65 Q28 63 30 61 L130 61 Q132 63 130 65 L138 148 Q138 154 132 156 L28 156 Q22 154 22 148 Z"
              stroke="#2a2a2a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Left handle */}
            <path
              d="M55 61 Q50 35 65 30 Q80 26 80 30"
              stroke="#2a2a2a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right handle */}
            <path
              d="M105 61 Q110 35 95 30 Q80 26 80 30"
              stroke="#2a2a2a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Picture frame inside bag */}
            <rect x="48" y="85" width="64" height="52" rx="3" stroke="#4a7bc7" strokeWidth="2" />
            {/* Frame inner mat */}
            <rect x="56" y="93" width="48" height="36" rx="2" stroke="#4a7bc7" strokeWidth="1.2" strokeDasharray="3 2" />
            {/* Frame corner marks */}
            <line x1="56" y1="93" x2="62" y2="93" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="93" x2="56" y2="99" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="104" y1="93" x2="98" y2="93" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="104" y1="93" x2="104" y2="99" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="129" x2="62" y2="129" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="129" x2="56" y2="123" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="104" y1="129" x2="98" y2="129" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="104" y1="129" x2="104" y2="123" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />

            {/* Stray doodle marks */}
            <path d="M35 80 Q38 76 40 80" stroke="#2a2a2a" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M120 100 Q124 96 126 102" stroke="#2a2a2a" strokeWidth="1.2" strokeLinecap="round" />
          </svg>

          <h3 className="mb-2 font-serif text-xl font-semibold text-charcoal">
            Your collection is empty
          </h3>
          <p className="mb-6 text-sm text-soft-charcoal">
            Discover free art to download and add to your collection.
          </p>
          <Link
            href="/free-downloads"
            onClick={onClose}
            className="inline-block rounded-2xl bg-sage-500 px-5 py-2.5 font-sans text-sm font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-md"
          >
            Browse Free Art
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        />
      )}
    </>
  );
}
