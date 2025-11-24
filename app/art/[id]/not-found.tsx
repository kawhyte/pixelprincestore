import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArtNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 font-serif text-6xl font-bold text-charcoal">
          404
        </h1>
        <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal">
          Art Not Found
        </h2>
        <p className="mb-8 text-soft-charcoal">
          The art piece you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/free-downloads">
          <Button className="rounded-2xl bg-sage-500 hover:bg-sage-400">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Button>
        </Link>
      </div>
    </div>
  );
}
