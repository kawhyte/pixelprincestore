import Image from "next/image";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import EmailSignupForm from "@/components/common/EmailSignupForm/EmailSignupForm";
import ProductEmbedCard from "@/components/blog/ProductEmbedCard";
import type { BodyBlock, BlogImageSlot, ImageAttribution } from "@/sanity/lib/blog";
import { gridColsClass, attributionCredit } from "@/lib/blog-image-layout";

type ImageLike = {
  asset?: { _ref: string; _type: string };
  alt?: string;
  attribution?: ImageAttribution;
};

function AttributionCaption({ attribution }: { attribution?: ImageAttribution }) {
  const credit = attributionCredit(attribution);
  if (!credit) return null;
  const sourceUrl = attribution?.sourceUrl;
  return (
    <figcaption className="mt-2 text-xs text-soft-charcoal/70">
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener nofollow"
          className="underline hover:text-soft-charcoal"
        >
          {credit}
        </a>
      ) : (
        credit
      )}
    </figcaption>
  );
}

function BodyImage({
  image,
  width,
  height,
  crop = false,
  className,
}: {
  image: ImageLike;
  width: number;
  height: number;
  // crop=true fills a fixed-aspect container (row/grid, keeps slots aligned);
  // crop=false preserves the photo's natural ratio (single body image).
  crop?: boolean;
  className?: string;
}) {
  if (!image?.asset) return null;
  const alt = image.alt || "";
  if (crop) {
    return (
      <figure className={`my-0 ${className || ""}`}>
        <div className="aspect-[4/3] overflow-hidden rounded-md">
          <Image
            src={urlFor(image).width(width).height(height).url()}
            alt={alt}
            width={width}
            height={height}
            className="h-full w-full object-cover"
          />
        </div>
        <AttributionCaption attribution={image.attribution} />
      </figure>
    );
  }
  return (
    <figure className={`my-0 ${className || ""}`}>
      <Image
        src={urlFor(image).width(width).url()}
        alt={alt}
        width={width}
        height={height}
        className="w-full rounded-md"
      />
      <AttributionCaption attribution={image.attribution} />
    </figure>
  );
}

function slugifyHeading(block: PortableTextBlock): string {
  const text = (block.children as { text?: string }[] | undefined)
    ?.map((child) => child.text || "")
    .join("") || "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const components: PortableTextComponents = {
  block: {
    h1: ({ children, value }) => (
      <h2 id={slugifyHeading(value)} className="mt-10 mb-4 scroll-mt-24 text-2xl font-bold text-charcoal">
        {children}
      </h2>
    ),
    h2: ({ children, value }) => (
      <h2 id={slugifyHeading(value)} className="mt-10 mb-4 scroll-mt-24 text-2xl font-bold text-charcoal">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={slugifyHeading(value)} className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold text-charcoal">
        {children}
      </h3>
    ),
    normal: ({ children }) => <p className="mb-5 leading-relaxed text-soft-charcoal">{children}</p>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-sage-600 underline hover:text-sage-700"
          {...(isExternal ? { target: "_blank", rel: "noopener" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <div className="my-8">
          <BodyImage image={value as ImageLike} width={800} height={450} />
        </div>
      );
    },
    imageRow: ({ value }) => {
      const images = (value?.images as BlogImageSlot[] | undefined)?.filter((img) => img?.asset) || [];
      if (images.length === 0) return null;
      return (
        <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {images.map((img) => (
            <BodyImage key={img._key} image={img} width={600} height={450} crop />
          ))}
        </div>
      );
    },
    imageGrid: ({ value }) => {
      const images = (value?.images as BlogImageSlot[] | undefined)?.filter((img) => img?.asset) || [];
      if (images.length === 0) return null;
      return (
        <div className={`my-8 grid grid-cols-2 gap-3 ${gridColsClass(images.length)}`}>
          {images.map((img) => (
            <BodyImage key={img._key} image={img} width={500} height={375} crop />
          ))}
        </div>
      );
    },
    productEmbed: ({ value }) => <ProductEmbedCard product={value.product} note={value.note} />,
    emailCapture: ({ value }) => (
      <div className="my-8 rounded-md bg-sage-50 p-6">
        <h3 className="text-xl font-semibold text-charcoal">
          {value.heading || "Get a new free print every month"}
        </h3>
        <EmailSignupForm source="blog-inline" className="mt-4" />
      </div>
    ),
  },
};

export default function PortableBody({ value }: { value: BodyBlock[] }) {
  return <PortableText value={value as unknown as PortableTextBlock[]} components={components} />;
}
