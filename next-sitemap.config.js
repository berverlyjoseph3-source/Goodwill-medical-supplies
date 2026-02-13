/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://goodwillmedical.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/admin/*', '/account/*', '/checkout/*'],
      },
    ],
    additionalSitemaps: [
      'https://goodwillmedical.com/sitemap.xml',
    ],
  },
  exclude: [
    '/api/*',
    '/admin/*',
    '/account/*',
    '/checkout/*',
    '/auth/*',
    '/404',
    '/500',
  ],
  transform: async (config, path) => {
    // Custom transformation for different content types
    if (path.startsWith('/product/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      };
    }
    
    if (path.startsWith('/category/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      };
    }
    
    // Default
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    };
  },
};
