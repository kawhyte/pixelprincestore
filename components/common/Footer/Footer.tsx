import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-charcoal text-cream">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {/* Main Footer Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold sm:text-2xl">The Pixel Prince</h2>
            <p className="text-sm leading-relaxed text-cream/70">
              Curated digital art for modern living. Transform your space with
              premium downloadable prints.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://pinterest.com/thepixelprince/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 transition-colors hover:text-sage-300"
                aria-label="Pinterest"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </Link>
              <Link
                href="https://twitter.com/thepixelprince"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 transition-colors hover:text-sage-300"
                aria-label="Twitter"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="http://facebook.com/thepixelprince/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 transition-colors hover:text-sage-300"
                aria-label="Facebook"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href="https://www.etsy.com/shop/thepixelprince"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/70 transition-colors hover:text-sage-300"
                aria-label="Etsy"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.875 5.5h3.563l.313 4.313h-.625c-.438-1.626-1.25-2.938-2.438-2.938h-1.563v8.75c0 1.063.5 1.375 1.563 1.375h.313v.625h-5.313V17h.313c1.063 0 1.563-.313 1.563-1.375v-8.75h-1.563c-1.188 0-2 1.313-2.438 2.938h-.625l.313-4.313h6.624zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Shop</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  All Prints
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Video Game Art
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  World Maps
                </Link>
              </li>
              <li>
                <Link
                  href="/free-downloads"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Free Downloads
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Printing Guide
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Licensing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-cream/70 transition-colors hover:text-sage-300"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-cream/10 pt-8 sm:mt-16">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-cream/70 md:flex-row">
            <p>© 2024 The Pixel Prince. All rights reserved.</p>
            <p>Designed with care for modern living.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
