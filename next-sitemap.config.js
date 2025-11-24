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
    return [];
  },
}
