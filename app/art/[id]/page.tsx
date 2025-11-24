import { notFound } from "next/navigation";
import { freeArtCollection } from "@/config/free-art";
import ArtDetailClient from "./art-detail-client";

interface PageProps {
  params: {
    id: string;
  };
}

// Generate static params for all art pieces (for static generation)
export function generateStaticParams() {
  return freeArtCollection.map((art) => ({
    id: art.id,
  }));
}

export default function ArtDetailPage({ params }: PageProps) {
  const art = freeArtCollection.find((item) => item.id === params.id);

  // If art not found, show 404
  if (!art) {
    notFound();
  }

  return <ArtDetailClient art={art} />;
}
