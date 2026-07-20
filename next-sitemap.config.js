/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.thepixelprince.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  // Exclude any paths you don't want indexed
  exclude: ['/api/*', '/admin/*'],
  // Additional paths to include
  additionalPaths: async (config) => {
    // Keep in sync with config/collections.ts COLLECTIONS slugs.
    const collectionSlugs = [
      'game-room-wall-art',
      'retro-gaming-prints',
      'map-prints',
      'printable-wall-art',
      'basketball-wall-art',
    ]
    const collectionPaths = await Promise.all(
      collectionSlugs.map((slug) => config.transform(config, `/collections/${slug}`))
    )

    // Key static routes next-sitemap does not discover on its own.
    const staticSlugs = ['/prints']
    const staticPaths = await Promise.all(
      staticSlugs.map((path) => config.transform(config, path))
    )

    // Collections + statics must ship even without Sanity env vars; only the
    // blog fetch is conditional on them.
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
      return [...collectionPaths, ...staticPaths]
    }

    const { createClient } = await import('next-sanity')
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-11-27',
      useCdn: true,
    })

    const slugs = await client.fetch(
      `*[_type == "post" && publishedAt < now()].slug.current`
    )

    const blogPaths = await Promise.all(
      slugs.map((slug) => config.transform(config, `/blog/${slug}`))
    )

    return [...collectionPaths, ...staticPaths, ...blogPaths]
  },
}
