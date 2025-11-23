import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Text Content */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="inline-block">
              <span className="rounded-full bg-sage-100 px-4 py-2 text-sm font-medium text-sage-500">
                Curated Digital Art
              </span>
            </div>

            {/* Headline - Massive Serif */}
            <h1 className="text-balance font-serif text-5xl font-bold leading-tight tracking-tight text-charcoal lg:text-7xl">
              Art that defines your space.
            </h1>

            {/* Subheadline */}
            <p className="text-balance text-xl leading-relaxed text-soft-charcoal lg:text-2xl">
              Discover curated digital art for modern living. Premium posters,
              video game decor, and world maps—ready for instant download.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-2xl bg-sage-500 px-8 py-6 text-lg font-semibold text-white transition-all hover:bg-sage-400 hover:shadow-lg"
              >
                <Link href="#collection">Explore Collection</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-2xl border-2 border-charcoal bg-transparent px-8 py-6 text-lg font-semibold text-charcoal transition-all hover:bg-charcoal hover:text-cream"
              >
                <Link href="/free-downloads">Free Downloads</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-cream bg-gradient-to-br from-sage-300 to-lavender-300"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-charcoal">2,500+</span>{" "}
                customers have transformed their spaces
              </p>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            {/* Floating Card Animation */}
            <div className="relative">
              {/* Background Gradient Blob */}
              <div className="absolute -left-10 -top-10 h-96 w-96 rounded-full bg-gradient-to-br from-sage-200/40 via-lavender-200/40 to-clay-200/40 blur-3xl" />

              {/* Main Art Mockup */}
              <div className="relative z-10 transform transition-transform duration-700 hover:scale-105">
                <div className="anthropic-card overflow-hidden shadow-2xl">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src="https://placehold.co/600x800/b5c9a5/2a2a2a/png?text=Curated+Art"
                      alt="Featured Art Piece"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                  <div className="bg-card p-6">
                    <h3 className="font-serif text-xl font-semibold text-charcoal">
                      Ethereal Landscapes
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Digital Download • 3000×4000px
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -right-4 top-8 z-20 animate-bounce-slow rounded-2xl bg-lavender-100 px-6 py-4 shadow-lg">
                <p className="text-sm font-semibold text-lavender-500">
                  ✨ Instant Download
                </p>
              </div>

              {/* Bottom Accent Card */}
              <div className="absolute -bottom-6 -left-6 z-0 h-64 w-48 rounded-2xl bg-clay-100 opacity-60 shadow-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Bounce Slow Keyframe */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
