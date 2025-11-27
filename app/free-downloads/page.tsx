import { getAllProducts } from "@/sanity/lib/client";
import FreeDownloadsClient from "./free-downloads-client";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function FreeDownloadsPage() {
  // Fetch products from Sanity
  const products = await getAllProducts();

  return <FreeDownloadsClient products={products} />;
}
