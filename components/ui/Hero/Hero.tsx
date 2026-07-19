import Link from "next/link";
import Image from "next/image";
import EmailSignupForm from "@/components/common/EmailSignupForm/EmailSignupForm";
import { FreeArt } from "@/sanity/lib/client";

interface HeroProps {
  featured: FreeArt | null;
  totalDownloads?: number;
}

export default function Hero({ featured, totalDownloads = 0 }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Eyebrow — plain small-caps, no pill */}
            <p className="text-xs font-medium uppercase tracking-widest text-soft-charcoal">
              A new free print every month
            </p>

            {/* Headline */}
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-charcoal sm:text-5xl lg:text-7xl">
              Free retro gaming &amp; map wall art — a new print every month
            </h1>

            {/* Subheadline */}
            <p className="text-balance text-lg leading-relaxed text-soft-charcoal sm:text-xl lg:text-2xl">
              Designed by a human. Download this month&apos;s featured print
              free, or browse the whole collection. No account, no cost —
              pick a print and it lands in your inbox.
            </p>

            <div className="space-y-3">
              <EmailSignupForm source="home-hero" />
              {/* Trust microline above the fold */}
              <p className="text-xs text-muted-foreground">
                Free downloads · Printed in the USA · 7,000+ orders shipped on Etsy
              </p>
              <Link
                href="/free-downloads"
                className="inline-block text-sm font-medium text-sage-500 transition-colors hover:text-sage-400"
              >
                Or just browse the free prints →
              </Link>
            </div>

            {totalDownloads >= 100 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-charcoal">
                  {totalDownloads.toLocaleString()}+
                </span>{" "}
                prints downloaded
              </p>
            )}
          </div>

          {/* Right: Featured Artwork */}
          {featured && (
            <div className="relative">
              <Link
                href={`/art/${featured.id}`}
                className="group relative z-10 block transform transition-transform duration-700 hover:scale-105"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-md shadow-xl">
                  <Image
                    src={featured.previewImage}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <span className="absolute left-3 top-3 rounded-md bg-sage-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                  Featured this month
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
