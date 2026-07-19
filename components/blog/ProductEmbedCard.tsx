import Image from "next/image";
import Link from "next/link";
import { etsyUrl } from "@/config/links";
import { resolveEtsyLinks } from "@/config/etsy-categories";
import type { EmbeddedProduct } from "@/sanity/lib/blog";
import EtsyLink from "@/components/common/EtsyLink/EtsyLink";

interface ProductEmbedCardProps {
  product: EmbeddedProduct | null;
  note?: string;
}

export default function ProductEmbedCard({ product, note }: ProductEmbedCardProps) {
  if (!product) return null;

  const etsyLinks = resolveEtsyLinks(product);

  return (
    <div className="my-8 flex gap-4 rounded-2xl border border-border bg-card p-4">
      {product.previewImage && (
        <div className="relative h-[160px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image
            src={product.previewImage}
            alt={product.title}
            fill
            className="object-cover"
            sizes="120px"
          />
        </div>
      )}
      <div className="flex flex-col justify-center gap-2">
        <h4 className="text-lg font-semibold text-charcoal">{product.title}</h4>
        {note && <p className="text-sm text-soft-charcoal">{note}</p>}
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <Link
            href={`/art/${product.slug}`}
            className="text-sm font-medium text-sage-600 hover:text-sage-700"
          >
            Free download
          </Link>
          <EtsyLink
            href={etsyUrl(etsyLinks.printed, "blog-embed")}
            className="text-sm font-medium text-sage-600 hover:text-sage-700"
          >
            {etsyLinks.styleLabel ? `Shop ${etsyLinks.styleLabel} prints →` : "Shop prints →"}
          </EtsyLink>
        </div>
      </div>
    </div>
  );
}
