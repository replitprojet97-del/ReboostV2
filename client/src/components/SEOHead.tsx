import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { detectLanguage, getSEOContent, LANGUAGE_CODES, LANGUAGES, type Language } from '@/lib/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  language?: Language;
  ogImage?: string;
}

export function SEOHead({
  title,
  description,
  language: providedLanguage,
  ogImage = '/og_image.png'
}: SEOHeadProps) {
  const [language, setLanguage] = useState<Language>(providedLanguage || 'en');

  useEffect(() => {
    if (!providedLanguage) {
      const detected = detectLanguage();
      setLanguage(detected);
    }
  }, [providedLanguage]);

  const seoContent = getSEOContent(language);
  const finalTitle = title || seoContent.title;
  const finalDescription = description || seoContent.description;
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://kreditpass.org';
  const langCode = LANGUAGE_CODES[language];

  return (
    <Helmet>
      <html lang={langCode} />
      
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="KreditPass" />
      <meta property="og:locale" content={langCode} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={siteUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional SEO */}
      <meta name="keywords" content="financement, financement en ligne, prêt, emprunt, particuliers, entreprises, rapide, sécurisé" />
      <meta name="author" content="KreditPass" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={language.toUpperCase()} />
      
      {/* Canonical */}
      <link rel="canonical" href={siteUrl} />
      
      {/* Alternate Language Links */}
      {LANGUAGES.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={LANGUAGE_CODES[lang]}
          href={siteUrl}
        />
      ))}
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href="/favicon.png?v=3" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=3" />
      <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png?v=3" />
      <link rel="apple-touch-icon" href="/favicon.png?v=3" />
      <link rel="shortcut icon" href="/favicon.png?v=3" />
      
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialService",
          "name": "KreditPass",
          "url": siteUrl,
          "logo": `${siteUrl}/favicon.png`,
          "description": finalDescription,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "14 Rue du Marché-aux-Herbes",
            "addressLocality": "Luxembourg",
            "postalCode": "L-1728",
            "addressCountry": "LU"
          },
          "areaServed": "Worldwide",
          "serviceType": ["Secured Financing", "Loan Management", "Professional Financing"],
          "offers": {
            "@type": "Offer",
            "description": "Premium financing solutions"
          },
          "potentialAction": {
            "@type": "Action",
            "name": "Request Funding",
            "target": `${siteUrl}/auth`
          }
        })}
      </script>

      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#005DFF" />
    </Helmet>
  );
}
