import Image from "next/image";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import EmailSignupForm from "@/components/common/EmailSignupForm/EmailSignupForm";
import ProductEmbedCard from "@/components/blog/ProductEmbedCard";
import type { BodyBlock } from "@/sanity/lib/blog";

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
      <h2 id={slugifyHeading(value)} className="mt-10 mb-4 text-2xl font-bold text-charcoal">
        {children}
      </h2>
    ),
    h2: ({ children, value }) => (
      <h2 id={slugifyHeading(value)} className="mt-10 mb-4 text-2xl font-bold text-charcoal">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={slugifyHeading(value)} className="mt-8 mb-3 text-xl font-semibold text-charcoal">
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
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt || ""}
          width={800}
          height={450}
          className="my-8 rounded-2xl"
        />
      );
    },
    productEmbed: ({ value }) => <ProductEmbedCard product={value.product} note={value.note} />,
    emailCapture: ({ value }) => (
      <div className="my-8 rounded-2xl bg-sage-50 p-6">
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
