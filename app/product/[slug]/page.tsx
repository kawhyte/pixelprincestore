import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  generateMetadata as generateSEOMetadata,
  generateProductSchema,
} from "@/lib/seo";

// This would typically come from your database or API
interface Product {
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  sku: string;
  availability: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued";
  brand?: string;
}

// Mock function to fetch product data
// Replace this with your actual data fetching logic
async function getProduct(slug: string): Promise<Product | null> {
  // Example product data - replace with actual database/API call
  const mockProducts: Record<string, Product> = {
    "zelda-map-hyrule": {
      slug: "zelda-map-hyrule",
      name: "Legend of Zelda - Hyrule Map Print",
      description:
        "High-quality printable map of Hyrule from The Legend of Zelda. Perfect for any gaming room or man cave. Instant digital download in high resolution.",
      price: 12.99,
      currency: "USD",
      images: [
        "https://www.thepixelprince.com/products/zelda-map-hyrule.jpg",
        "https://www.thepixelprince.com/products/zelda-map-hyrule-2.jpg",
      ],
      category: "Video Game Maps",
      sku: "TPP-ZELDA-001",
      availability: "InStock",
      brand: "The Pixel Prince",
    },
    "world-map-vintage": {
      slug: "world-map-vintage",
      name: "Vintage World Map - High Resolution Print",
      description:
        "Beautiful vintage-style world map perfect for home or office. Downloadable in multiple sizes up to 24x36 inches. Instant access after purchase.",
      price: 9.99,
      currency: "USD",
      images: [
        "https://www.thepixelprince.com/products/world-map-vintage.jpg",
      ],
      category: "World Maps",
      sku: "TPP-MAP-002",
      availability: "InStock",
      brand: "The Pixel Prince",
    },
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return mockProducts[slug] || null;
}

// Generate dynamic metadata for each product page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return generateSEOMetadata({
    title: product.name,
    description: product.description,
    keywords: [
      product.name,
      product.category,
      "Digital Download",
      "Printable Art",
      "Wall Decor",
      "Instant Download",
    ],
    image: product.images[0],
    canonical: `https://www.thepixelprince.com/product/${product.slug}`,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Generate Product JSON-LD Schema
  const productSchema = generateProductSchema(
    {
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      images: product.images,
      category: product.category,
      sku: product.sku,
      brand: product.brand,
      availability: product.availability,
    },
    `https://www.thepixelprince.com/product/${product.slug}`
  );

  return (
    <>
      {/* Product Schema JSON-LD for Rich Search Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <div className="min-h-screen bg-white dark:bg-black">
        <main className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800"
                    >
                      <img
                        src={image}
                        alt={`${product.name} - View ${index + 2}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {product.category}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    product.availability === "InStock"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {product.availability === "InStock"
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
              </div>

              <div className="space-y-2 border-t pt-4 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">SKU:</span> {product.sku}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Category:</span>{" "}
                  {product.category}
                </p>
              </div>

              <button className="w-full rounded-lg bg-black px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                Add to Cart - ${product.price.toFixed(2)}
              </button>

              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ⚡ Instant Digital Download • High Resolution • Print at Home
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Optional: Generate static paths for known products
// export async function generateStaticParams() {
//   // Return array of slugs for static generation
//   return [
//     { slug: 'zelda-map-hyrule' },
//     { slug: 'world-map-vintage' },
//   ];
// }
