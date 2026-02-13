import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
}

export const SEO = ({
  title = 'Goodwill Medical Supplies - Quality Medical Equipment You Can Trust',
  description = 'FDA-approved medical equipment for hospitals, clinics, and home care. Fast shipping, certified products, and professional support since 2003.',
  canonical,
  ogImage = 'https://goodwillmedical.com/images/og-image.jpg',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author = 'Goodwill Medical Supplies',
  noindex = false,
}: SEOProps) => {
  const router = useRouter();
  const currentUrl = canonical || `https://goodwillmedical.com${router.asPath}`;
  const siteName = 'Goodwill Medical Supplies';

  // Structured data for organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Goodwill Medical Supplies',
    url: 'https://goodwillmedical.com',
    logo: 'https://goodwillmedical.com/images/logo.png',
    sameAs: [
      'https://facebook.com/goodwillmedical',
      'https://twitter.com/goodwillmedical',
      'https://linkedin.com/company/goodwillmedical',
      'https://instagram.com/goodwillmedical',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-123-4567',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: ['English', 'Spanish'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Medical Drive, Suite 100',
      addressLocality: 'Chicago',
      addressRegion: 'IL',
      postalCode: '60601',
      addressCountry: 'US',
    },
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#0070f3" />
      <meta name="color-scheme" content="light" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@goodwillmedical" />
      <meta name="twitter:creator" content="@goodwillmedical" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Article Specific */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Product Specific */}
      {ogType === 'product' && (
        <meta property="product:availability" content="instock" />
      )}
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
};
