import { notFound } from "next/navigation";
import { freeArtCollection } from "@/config/free-art";
import ArtDetailClient from "./art-detail-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for all art pieces (for static generation)
export function generateStaticParams() {
  return freeArtCollection.map((art) => ({
    id: art.id,
  }));
}

export default async function ArtDetailPage({ params }: PageProps) {
  const { id } = await params;
  const art = freeArtCollection.find((item) => item.id === id);

  // If art not found, show 404
  if (!art) {
    notFound();
  }

  return <ArtDetailClient art={art} />;
}
