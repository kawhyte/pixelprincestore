import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category?: string;
  href: string;
  variant?: "sage" | "clay" | "lavender" | "cream";
}

const variantStyles = {
  sage: "bg-sage-50 hover:bg-sage-100",
  clay: "bg-clay-50 hover:bg-clay-100",
  lavender: "bg-lavender-50 hover:bg-lavender-100",
  cream: "bg-card hover:bg-secondary",
};

export default function ProductCard({
  title,
  price,
  imageUrl,
  category,
  href,
  variant = "cream",
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl",
        variantStyles[variant]
      )}
    >
      {/* Image Container - Vertical Aspect Ratio (Portrait) */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />

        {/* Category Badge (Optional) */}
        {category && (
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-charcoal backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content Area - Minimal & Clean */}
      <div className="space-y-2 p-4 sm:p-5">
        {/* Title - Serif, Truncated 2 Lines */}
        <h3 className="line-clamp-2 font-serif text-base font-semibold leading-snug text-charcoal transition-colors group-hover:text-sage-500 sm:text-lg">
          {title}
        </h3>

        {/* Price - Sans, Bold */}
        {/* <p className="font-sans text-lg font-bold text-charcoal sm:text-xl">
          ${price.toFixed(2)}
        </p> */}

        {/* Subtle "View Details" hint on hover */}
        <p className="text-sm text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View details →
        </p>
      </div>
    </Link>
  );
}
