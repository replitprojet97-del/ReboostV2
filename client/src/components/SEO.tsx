import { Helmet } from 'react-helmet-async';
import { seoConfig } from '@/lib/seo-config';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  path?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tag?: string;
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: object | object[];
}

export default function SEO({
  title = seoConfig.defaultTitle,
  description = seoConfig.defaultDescription,
  keywords = seoConfig.defaultKeywords,
  image = seoConfig.defaultImage,
  path = '/',
  type = 'website',
  author = seoConfig.siteName,
  publishedTime,
  modifiedTime,
  section,
  tag,
  noindex = false,
  nofollow = false,
  structuredData,
}: SEOProps) {
  const fullUrl = `${seoConfig.siteUrl}${path}`;
  const fullImage = image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`;

  const robotsContent = `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;

  const structuredDataArray = Array.isArray(structuredData) ? structuredData : (structuredData ? [structuredData] : []);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={seoConfig.siteName} />
      <meta property="og:locale" content={seoConfig.locale} />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tag && <meta property="article:tag" content={tag} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />

      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={seoConfig.siteName} />

      <meta name="theme-color" content={seoConfig.themeColor} />
      <meta name="msapplication-TileColor" content={seoConfig.themeColor} />

      {structuredDataArray.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": structuredDataArray
          })}
        </script>
      )}
    </Helmet>
  );
}
