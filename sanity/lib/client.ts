import { createClient } from 'next-sanity'
import { urlFor } from './image'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

/**
 * TypeScript interfaces matching the Sanity schema
 */
export interface HighResAsset {
  assetType: 'cloudinary' | 'external'
  cloudinaryUrl?: string
  externalUrl?: string
  filename: string
  uploadedAt?: string
}

export interface ArtSize {
  id: string
  label?: string // Legacy field, use displayLabel instead
  displayLabel: string // Primary label in cm
  alternateLabel?: string // Secondary label in inches
  dimensions: string
  fileName: string
  fileSize: string
  recommendedFor?: string
  availability: 'available' | 'coming-soon'
  comingSoonMessage?: string
  highResAsset?: HighResAsset
}

export interface SanityProduct {
  _id: string
  _createdAt: string
  title: string
  slug: {
    current: string
  }
  artist: string
  description: string
  longDescription?: string
  previewImage: any
  detailImage?: any
  sizes: ArtSize[]
  allSizesZip: string // Deprecated: use zipUrl
  zipUrl?: string // Cloudinary or Google Drive URL for ZIP
  tags?: string[]
  category?: string
}

export interface FreeArt {
  id: string
  title: string
  artist: string
  description: string
  longDescription?: string
  previewImage: string
  detailImage?: string
  sizes: ArtSize[]
  allSizesZip: string // Deprecated: use zipUrl
  zipUrl?: string // Cloudinary or Google Drive URL for ZIP
  tags: string[]
  category?: string
}

/**
 * Fetch all free art products from Sanity
 * Returns data in the format expected by the frontend
 */
export async function getAllProducts(): Promise<FreeArt[]> {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    _createdAt,
    title,
    slug,
    artist,
    description,
    longDescription,
    previewImage,
    detailImage,
    sizes[]{
      id,
      label,
      displayLabel,
      alternateLabel,
      dimensions,
      fileName,
      fileSize,
      recommendedFor,
      availability,
      comingSoonMessage,
      highResAsset
    },
    allSizesZip,
    zipUrl,
    tags,
    category
  }`

  const products = await client.fetch<SanityProduct[]>(query)

  // Transform Sanity products to match the FreeArt interface
  return products.map((product) => ({
    id: product.slug.current,
    title: product.title,
    artist: product.artist,
    description: product.description,
    longDescription: product.longDescription,
    previewImage: product.previewImage
      ? urlFor(product.previewImage).width(600).height(800).url()
      : '',
    detailImage: product.detailImage
      ? urlFor(product.detailImage).width(1200).height(1600).url()
      : undefined,
    sizes: product.sizes || [],
    allSizesZip: product.allSizesZip,
    zipUrl: product.zipUrl,
    tags: product.tags || [],
    category: product.category,
  }))
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<FreeArt | null> {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    artist,
    description,
    longDescription,
    previewImage,
    detailImage,
    sizes[]{
      id,
      label,
      displayLabel,
      alternateLabel,
      dimensions,
      fileName,
      fileSize,
      recommendedFor,
      availability,
      comingSoonMessage,
      highResAsset
    },
    allSizesZip,
    zipUrl,
    tags,
    category
  }`

  const product = await client.fetch<SanityProduct | null>(query, { slug })

  if (!product) return null

  return {
    id: product.slug.current,
    title: product.title,
    artist: product.artist,
    description: product.description,
    longDescription: product.longDescription,
    previewImage: product.previewImage
      ? urlFor(product.previewImage).width(600).height(800).url()
      : '',
    detailImage: product.detailImage
      ? urlFor(product.detailImage).width(1200).height(1600).url()
      : undefined,
    sizes: product.sizes || [],
    allSizesZip: product.allSizesZip,
    zipUrl: product.zipUrl,
    tags: product.tags || [],
    category: product.category,
  }
}
