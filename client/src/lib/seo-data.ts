import { seoConfig } from './seo-config';

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": seoConfig.siteName,
  "description": "Solutions de crédit sur mesure pour les particuliers et les entreprises avec des conditions avantageuses et un processus clair",
  "url": seoConfig.siteUrl,
  "logo": {
    "@type": "ImageObject",
    "url": `${seoConfig.siteUrl}/logo.png`,
    "width": 512,
    "height": 512
  },
  "image": `${seoConfig.siteUrl}/og-image.jpg`,
  "telephone": seoConfig.organization.telephone,
  "address": {
    "@type": "PostalAddress",
    ...seoConfig.organization.address
  },
  "geo": {
    "@type": "GeoCoordinates",
    ...seoConfig.organization.geo
  },
  "sameAs": seoConfig.organization.sameAs,
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "15000"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": seoConfig.organization.telephone,
    "contactType": "Customer Service",
    "availableLanguage": ["Croatian", "French", "English", "Spanish", "Portuguese", "Italian", "German"]
  }
};

export const websiteSchema = {
  "@type": "WebSite",
  "name": seoConfig.siteName,
  "url": seoConfig.siteUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${seoConfig.siteUrl}/search?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

export const breadcrumbSchema = (items: Array<{name: string, path: string}>) => ({
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${seoConfig.siteUrl}${item.path}`
  }))
});

export const loanProductSchema = (locale: string = 'hr') => {
  const loanNames = {
    hr: "KreditPass Poslovni Kredit",
    fr: "Financement Entreprise KreditPass",
    en: "KreditPass Professional Loan",
    es: "Préstamo Profesional KreditPass",
    pt: "Empréstimo Profissional KreditPass",
    it: "Prestito Professionale KreditPass",
    de: "KreditPass Geschäftskredit"
  };

  const loanDescriptions = {
    hr: "Prilagodljivo rješenje financiranja za profesionalce s povoljnim stopama",
    fr: "Solution de financement adaptable pour professionnels avec des tarifs attractifs",
    en: "Flexible professional loan with competitive rates",
    es: "Préstamo profesional flexible con tasas competitivas",
    pt: "Empréstimo profissional flexível com taxas competitivas",
    it: "Prestito professionale flessibile con tassi competitivi",
    de: "Flexibler Geschäftskredit mit wettbewerbsfähigen Zinssätzen"
  };

  return {
    "@type": "LoanOrCredit",
    "name": loanNames[locale as keyof typeof loanNames] || loanNames.hr,
    "description": loanDescriptions[locale as keyof typeof loanDescriptions] || loanDescriptions.hr,
    "provider": {
      "@type": "FinancialService",
      "name": seoConfig.siteName
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };
};

export const faqSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const contactPageSchema = {
  "@type": "ContactPage",
  "name": "Contact KreditPass",
  "description": "Contact us for all your questions about our financing solutions",
  "url": `${seoConfig.siteUrl}/contact`
};
