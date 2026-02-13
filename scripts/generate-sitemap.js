const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SITE_URL = process.env.SITE_URL || 'https://goodwillmedical.com';
const PAGES_DIR = path.join(process.cwd(), 'pages');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Static routes
const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/shop',
  '/blog',
  '/faq',
  '/shipping',
  '/returns',
  '/warranty',
  '/privacy',
  '/terms',
  '/hipaa',
  '/accessibility',
  '/quote/request',
  '/order/tracking',
];

// Generate sitemap
async function generateSitemap() {
  console.log('🌍 Generating sitemap...');
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  // Add static routes
  staticRoutes.forEach(route => {
    sitemap += `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`;
  });

  // Fetch and add products
  try {
    console.log('📦 Fetching products...');
    const products = await fetch(`${SITE_URL}/api/products?limit=1000`)
      .then(res => res.json())
      .then(data => data.products || []);
    
    products.forEach(product => {
      sitemap += `
  <url>
    <loc>${SITE_URL}/product/${product.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date(product.updatedAt || Date.now()).toISOString()}</lastmod>
  </url>`;
    });
    
    console.log(`✅ Added ${products.length} products`);
  } catch (error) {
    console.error('❌ Failed to fetch products:', error.message);
  }

  // Fetch and add categories
  try {
    console.log('📁 Fetching categories...');
    const categories = await fetch(`${SITE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => data.categories || []);
    
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${SITE_URL}/category/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`;
    });
    
    console.log(`✅ Added ${categories.length} categories`);
  } catch (error) {
    console.error('❌ Failed to fetch categories:', error.message);
  }

  // Fetch and add blog posts
  try {
    console.log('📰 Fetching blog posts...');
    const posts = await fetch(`${SITE_URL}/api/blog?limit=1000`)
      .then(res => res.json())
      .then(data => data.posts || []);
    
    posts.forEach(post => {
      sitemap += `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date(post.updatedAt || post.date || Date.now()).toISOString()}</lastmod>
  </url>`;
    });
    
    console.log(`✅ Added ${posts.length} blog posts`);
  } catch (error) {
    console.error('❌ Failed to fetch blog posts:', error.message);
  }

  sitemap += '\n</urlset>';

  // Write sitemap to file
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Sitemap generated: ${sitemapPath}`);

  // Generate robots.txt
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /account/
Disallow: /checkout/
Disallow: /auth/

Sitemap: ${SITE_URL}/sitemap.xml`;

  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  fs.writeFileSync(robotsPath, robots);
  console.log(`✅ Robots.txt generated: ${robotsPath}`);
}

// Run if executed directly
if (require.main === module) {
  generateSitemap().catch(console.error);
}

module.exports = generateSitemap;
