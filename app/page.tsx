import Hero from "@/components/ui/Hero/Hero";
import ProductCard from "@/components/product/ProductCard/ProductCard";
import Footer from "@/components/common/Footer/Footer";

// Sample product data - Replace with your actual data source
const sampleProducts = [
  {
    id: "1",
    title: "Motivational Quotes",
    price: 24.99,
    imageUrl: "/categories/quotes.webp",
    category: "Quotes",
    href: "#",
    variant: "sage" as const,
  },
  {
    id: "2",
    title: "Retro Gaming Poster: Pixel Arcade",
    price: 19.99,
    imageUrl: "/categories/videogame.webp",
    category: "Gaming",
    href: "#",
    variant: "clay" as const,
  },
  {
    id: "3",
    title: "Map + Navigation",
    price: 29.99,
    imageUrl: "/categories/maps.webp",
    category: "Maps",
    href: "#",
    variant: "lavender" as const,
  },
  {
    id: "4",
    title: "Funny + Meme",
    price: 22.99,
    imageUrl: "/categories/meme.webp",
    category: "Meme",
    href: "#",
    variant: "sage" as const,
  },
  {
    id: "5",
    title: "Zelda: Breath of the Wild Tribute",
    price: 27.99,
    imageUrl: "https://placehold.co/600x800/d4bfae/2a2a2a/png?text=Zelda+Art",
    category: "Gaming",
    href: "#",
    variant: "clay" as const,
  },
  {
    id: "6",
    title: "Vintage Continental Map",
    price: 32.99,
    imageUrl: "https://placehold.co/600x800/cbbfdd/2a2a2a/png?text=Continental",
    category: "Maps",
    href: "#",
    variant: "lavender" as const,
  },
  {
    id: "7",
    title: "Geometric Mountains Series",
    price: 21.99,
    imageUrl: "https://placehold.co/600x800/b5c9a5/2a2a2a/png?text=Mountains",
    category: "Nature",
    href: "#",
    variant: "cream" as const,
  },
  {
    id: "8",
    title: "Stardew Valley Farm Life",
    price: 18.99,
    imageUrl: "https://placehold.co/600x800/d4bfae/2a2a2a/png?text=Stardew",
    category: "Gaming",
    href: "#",
    variant: "clay" as const,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Product Collection Section */}
      <section id="collection" className="bg-cream py-20">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
              Featured Collection
            </h2>
            <p className="mt-4 text-base text-soft-charcoal sm:text-lg">
              Handpicked Printable digital art to elevate your space
            </p>
          </div>

          {/* Product Grid - Responsive: 1 col mobile, 2 tablet, 4 desktop (showing 4 items) */}
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
            {sampleProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-16 text-center">
            <a
              href="#"
              className="inline-block rounded-2xl border-2 border-charcoal bg-transparent px-8 py-4 font-semibold text-charcoal transition-all hover:bg-charcoal hover:text-cream hover:shadow-lg"
            >
              View All Digital Downloads
            </a>
          </div>
        </div>
      </section>

      {/* Free Downloads Teaser */}
      {/* <section className=" from-sage-100 via-lavender-50 to-clay-100 py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
              Start with a Free Gift
            </h2>
            <p className="text-lg text-soft-charcoal sm:text-xl">
              New to The Pixel Prince? Claim one piece of premium digital art—completely free. No strings attached.
            </p>
            <a
              href="/free-downloads"
              className="inline-block rounded-2xl bg-sage-500 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-xl sm:px-10 sm:py-5 sm:text-lg"
            >
              Claim Your Free Art →
            </a>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}
