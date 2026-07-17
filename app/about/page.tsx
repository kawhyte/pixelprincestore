import Image from "next/image";

import { generateMetadata as buildMetadata } from "@/lib/seo";
import { ETSY_MAIN_SHOP, etsyUrl } from "@/config/links";
import EmailSignupForm from "@/components/common/EmailSignupForm/EmailSignupForm";

export const metadata = buildMetadata({
  title: "About Kenny — The Pixel Prince",
  noIndex: false,
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
          The human behind the pixels
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted">
            {/* TODO(KENNY): replace with real photo */}
            <Image
              src="/categories/quotes.webp"
              alt="Kenny, The Pixel Prince"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 text-base leading-relaxed text-soft-charcoal">
            <p>
              [KENNY: 2–3 paragraphs — who you are, why retro gaming + maps, the
              NBA-arena traveling detail, that every piece is hand-designed]
            </p>
          </div>
        </div>
      </div>

      {/* CTA Band */}
      <section className="bg-sage-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
              Want it printed, framed and shipped?
            </h2>
          </div>

          <div className="mx-auto max-w-xl rounded-2xl bg-cream p-8 text-center shadow-sm">
            <h3 className="font-serif text-xl font-semibold text-charcoal">
              The Pixel Prince on Etsy
            </h3>
            <p className="mt-2 text-sm text-soft-charcoal">
              Printed prints, maps &amp; personalized pieces
            </p>
            <a
              href={etsyUrl(ETSY_MAIN_SHOP, "about")}
              target="_blank"
              rel="noopener"
              className="mt-6 inline-block rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-lg"
            >
              Visit the print shop
            </a>

            <div className="mt-8 border-t border-border pt-8">
              <p className="mb-4 text-sm text-soft-charcoal">
                Or get a free print in your inbox every month:
              </p>
              <EmailSignupForm source="about" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
