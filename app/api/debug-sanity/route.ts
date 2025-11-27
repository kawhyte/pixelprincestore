import { NextResponse } from 'next/server'
import { getAllProducts } from '@/sanity/lib/client'

/**
 * Debug endpoint to test Sanity connection
 * Visit: http://localhost:3000/api/debug-sanity
 */
export async function GET() {
  try {
    const products = await getAllProducts()

    return NextResponse.json({
      success: true,
      productCount: products.length,
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        artist: p.artist,
        hasPreviewImage: !!p.previewImage,
        sizesCount: p.sizes.length,
        tags: p.tags,
      })),
      environment: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      },
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}
