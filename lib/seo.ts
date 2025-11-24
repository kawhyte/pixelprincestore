import type { Metadata } from 'next';
import seoConfig from '@/config/seo.json';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Generate metadata for a page with global defaults from config/seo.json
 */
export function generateMetadata({
  title,
  description,
  keywords,
  image,
  noIndex = false,
  canonical,
}: SEOProps = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${seoConfig.applicationName}`
    : seoConfig.title.default;

  const pageDescription = description || seoConfig.description;
  const pageKeywords = keywords || seoConfig.keywords;
  const pageImage = image || seoConfig.openGraph.images[0].url;

  const baseUrl = seoConfig.metadataBase;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors: seoConfig.authors,
    creator: seoConfig.creator,
    publisher: seoConfig.publisher,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: canonical || baseUrl,
    },
    openGraph: {
      type: seoConfig.openGraph.type as 'website',
      locale: seoConfig.openGraph.locale,
      siteName: seoConfig.openGraph.siteName,
      title: title || seoConfig.openGraph.title,
      description: pageDescription,
      images: [
        {
          url: pageImage,
          width: seoConfig.openGraph.images[0].width,
          height: seoConfig.openGraph.images[0].height,
          alt: seoConfig.openGraph.images[0].alt,
        },
      ],
      url: canonical || baseUrl,
    },
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
      title: title || seoConfig.twitter.title,
      description: pageDescription,
      images: [pageImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

interface Product {
  name: string;
  description: string;
  price: number;
  currency?: string;
  images: string[];
  category?: string;
  sku?: string;
  brand?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  url?: string;
}

/**
 * Generate Product Schema JSON-LD for rich search results
 */
export function generateProductSchema(product: Product, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'The Pixel Prince',
    },
    offers: {
      '@type': 'Offer',
      url: url,
      priceCurrency: product.currency || 'USD',
      price: product.price.toFixed(2),
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split('T')[0],
    },
    ...(product.sku && { sku: product.sku }),
    ...(product.category && { category: product.category }),
  };
}

/**
 * Generate Organization Schema JSON-LD for the website
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Pixel Prince',
    url: seoConfig.metadataBase,
    logo: `${seoConfig.metadataBase}/logo.png`,
    sameAs: [
      // Add your social media URLs here
      'https://twitter.com/thepixelprince',
      'https://instagram.com/thepixelprince',
      'https://facebook.com/thepixelprince',
    ],
  };
}

/**
 * Generate WebSite Schema JSON-LD with search action
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Pixel Prince',
    url: seoConfig.metadataBase,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.metadataBase}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
