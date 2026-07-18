import Image from "next/image";

import { generateMetadata as buildMetadata } from "@/lib/seo";
import { ETSY_MAIN_SHOP, etsyUrl } from "@/config/links";
import EmailSignupForm from "@/components/common/EmailSignupForm/EmailSignupForm";
import EtsyLink from "@/components/common/EtsyLink/EtsyLink";

export const metadata = buildMetadata({
  title: "About Kenny & Rene — The Pixel Prince",
  description:
    "Meet Kenny and Rene, the husband-and-wife duo behind The Pixel Prince — retro gaming and map wall art inspired by world travel and retro nostalgia.",
  canonical: "https://www.thepixelprince.com/about",
  noIndex: false,
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
          The humans behind the pixels
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted">
            {/* TODO(KENNY): replace with real photo */}
            <Image
              src="/categories/quotes.webp"
              alt="Kenny and Rene, The Pixel Prince"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 text-base leading-relaxed text-soft-charcoal">
            <p>
              We&apos;re Kenny and Rene — husband and wife, and the two people
              behind The Pixel Prince. We design every piece together, in
              Affinity and Photoshop, chasing clean grids and good color
              palettes.
            </p>
            <p>
              Most of it comes from somewhere real: places we&apos;ve
              traveled and people we&apos;ve met along the way. We&apos;ve
              visited more than 18 countries together — Japan, Jakarta,
              Copenhagen, Jamaica, and counting — which we chronicle on our
              travel blog,{" "}
              <a
                href="https://www.meetthewhytes.com/"
                target="_blank"
                rel="noopener"
                className="underline hover:text-sage-500"
              >
                Meet the Whytes
              </a>
              . Kenny&apos;s also made it to every NBA arena in the league,
              and more than a few of those trips have turned into a print.
              Other times the spark is pure nostalgia — the retro consoles we
              grew up on, and that specific, slightly ridiculous joy of an
              8-bit skyline.
            </p>
            <p>
              Whatever sparks it, it ends up as a piece the two of us design
              together, free for you to download and print. If one of these
              makes your space feel a little more like you, that&apos;s the
              whole point.
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
            <EtsyLink
              href={etsyUrl(ETSY_MAIN_SHOP, "about")}
              className="mt-6 inline-block rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-lg"
            >
              Visit the print shop
            </EtsyLink>

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
