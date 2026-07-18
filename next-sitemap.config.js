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
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
      return []
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

    return slugs.map((slug) => config.transform(config, `/blog/${slug}`))
  },
}
