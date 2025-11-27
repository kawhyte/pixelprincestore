import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/sanity/lib/client";
import ArtDetailClient from "./art-detail-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

// Generate static params for all art pieces (for static generation)
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((art) => ({
    id: art.id,
  }));
}

export default async function ArtDetailPage({ params }: PageProps) {
  const { id } = await params;
  const art = await getProductBySlug(id);

  // If art not found, show 404
  if (!art) {
    notFound();
  }

  return <ArtDetailClient art={art} />;
}
