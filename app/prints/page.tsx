import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { generateMetadata as seoMeta } from "@/lib/seo";
import { ETSY_MAIN_SHOP, ETSY_PRINTABLES_SHOP, etsyUrl } from "@/config/links";
import EtsyLink from "@/components/common/EtsyLink/EtsyLink";

export const metadata = seoMeta({
  title: "Prints and printables",
  description:
    "Every Pixel Prince design comes two ways: printed, framed or on canvas and shipped to you, or as an instant download you print yourself.",
  canonical: "https://www.thepixelprince.com/prints",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.thepixelprince.com/" },
    { "@type": "ListItem", position: 2, name: "Prints", item: "https://www.thepixelprince.com/prints" },
  ],
};

export default function PrintsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <h1 className="text-3xl font-semibold text-charcoal sm:text-4xl">
          Want it on real paper?
        </h1>
        <p className="mt-4 text-lg text-soft-charcoal">
          Every design here is free to download. When you want it on real paper,
          there are two ways to get it.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-md bg-card p-8 shadow-card">
            <h2 className="text-xl font-semibold text-charcoal">
              Printed, framed or canvas, shipped to you
            </h2>
            <p className="mt-3 text-soft-charcoal">
              We print it, pack it, and ship it to your door. Paper, framed, or
              canvas, in the size you pick.
            </p>
            <EtsyLink
              href={etsyUrl(ETSY_MAIN_SHOP, "prints-page-main")}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-sage-500 px-6 font-sans text-sm font-semibold text-white transition-colors hover:bg-sage-400"
            >
              Visit the print shop
              <ArrowUpRight className="size-5" />
            </EtsyLink>
          </div>

          <div className="rounded-md bg-card p-8 shadow-card">
            <h2 className="text-xl font-semibold text-charcoal">
              Instant downloads you print yourself
            </h2>
            <p className="mt-3 text-soft-charcoal">
              Buy the file, download it in minutes, and print it at home or at a
              local print shop.
            </p>
            <EtsyLink
              href={etsyUrl(ETSY_PRINTABLES_SHOP, "prints-page-printables")}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-md border border-charcoal px-6 font-sans text-sm font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-white"
            >
              Browse the printables
              <ArrowUpRight className="size-5" />
            </EtsyLink>
          </div>
        </div>

        <p className="mt-8 text-sm text-soft-charcoal">
          Printed in the USA · Free US shipping · 7,000+ orders shipped on Etsy
        </p>

        <p className="mt-12 text-soft-charcoal">
          Not ready to buy?{" "}
          <Link href="/free-downloads" className="text-sage-500 underline hover:text-sage-400">
            Every print in the free library
          </Link>{" "}
          costs nothing.
        </p>
      </main>
    </div>
  );
}
