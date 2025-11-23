import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-cream/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <h1 className="font-serif text-2xl font-bold text-charcoal transition-colors group-hover:text-sage-500">
              The Pixel Prince
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
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
        </div>
      </div>
    </nav>
  );
}
