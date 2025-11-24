import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";

// SEO Metadata for Free Downloads Page
export const metadata: Metadata = generateSEOMetadata({
  title: "Free Downloads - Digital Art & Printable Decor",
  description:
    "Download free printable wall art, gaming posters, and world maps. High-quality digital downloads at no cost. Perfect for decorating your space on a budget.",
  keywords: [
    "Free Printable Wall Art",
    "Free Digital Downloads",
    "Free Gaming Posters",
    "Free World Maps",
    "Free Printable Decor",
    "No Cost Digital Art",
  ],
  canonical: "https://www.thepixelprince.com/free-downloads",
});

// Mock free products data - replace with your actual data source
const freeProducts = [
  {
    id: 1,
    slug: "retro-gaming-pixel-art",
    name: "Retro Gaming Pixel Art",
    description: "Classic pixel art perfect for any gaming setup",
    image: "/products/retro-gaming.jpg",
    category: "Gaming",
  },
  {
    id: 2,
    slug: "minimalist-world-map",
    name: "Minimalist World Map",
    description: "Clean and modern world map design",
    image: "/products/world-map.jpg",
    category: "Maps",
  },
  {
    id: 3,
    slug: "8bit-mario-tribute",
    name: "8-Bit Mario Tribute",
    description: "Nostalgic 8-bit gaming tribute art",
    image: "/products/mario-8bit.jpg",
    category: "Gaming",
  },
  {
    id: 4,
    slug: "abstract-geometric",
    name: "Abstract Geometric Pattern",
    description: "Modern geometric wall art",
    image: "/products/geometric.jpg",
    category: "Abstract",
  },
  {
    id: 5,
    slug: "vintage-game-controller",
    name: "Vintage Game Controller",
    description: "Classic gaming controller illustration",
    image: "/products/controller.jpg",
    category: "Gaming",
  },
  {
    id: 6,
    slug: "pixel-art-landscape",
    name: "Pixel Art Landscape",
    description: "Beautiful pixelated landscape scene",
    image: "/products/landscape.jpg",
    category: "Nature",
  },
];

export default function FreeDownloadsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 md:text-5xl">
            Free Downloads
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            High-quality printable art at no cost. Download instantly and print
            at home or your local print shop.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {freeProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group"
            >
              <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-lg dark:bg-zinc-900 dark:shadow-zinc-800">
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-6xl">🎨</span>
                  </div>
                  {/* Free Badge */}
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    FREE
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Category */}
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    {product.category}
                  </p>

                  {/* Product Name */}
                  <h3 className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 line-clamp-1">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price Section */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-500">
                        FREE
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400 line-through">
                        $9.99
                      </span>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button className="mt-4 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                    Download Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center text-white md:p-12">
          <h2 className="text-3xl font-bold">Want More Premium Art?</h2>
          <p className="mt-4 text-lg opacity-90">
            Check out our premium collection for exclusive high-resolution
            designs
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-purple-600 transition-transform hover:scale-105"
          >
            Browse Premium Collection
          </Link>
        </div>
      </main>
    </div>
  );
}
