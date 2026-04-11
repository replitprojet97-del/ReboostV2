export const seoConfig = {
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://kreditpass.org',
  siteName: 'KreditPass',
  defaultTitle: 'KreditPass – Secure Financing Solutions | Personal & Business Loans',
  defaultDescription: 'KreditPass offers premium and secure financing solutions for individuals and businesses. Loan management, bank transfers and professional contracts with absolute discretion.',
  defaultKeywords: 'loan, business financing, personal loan, professional credit, fast loan, competitive rates, SME financing, KreditPass, Luxembourg',
  defaultImage: '/og_image.png',
  twitterHandle: '@kreditpass',
  themeColor: '#001f3d',
  locale: 'hr_HR',
  alternateLangs: ['hr', 'fr', 'en', 'es', 'pt', 'it', 'de', 'nl'],
  organization: {
    name: 'KreditPass',
    logo: '/logo.png',
    telephone: '+352-431-5918',
    address: {
      streetAddress: '14 Rue du Marché-aux-Herbes',
      addressLocality: 'Luxembourg',
      postalCode: 'L-1728',
      addressCountry: 'LU'
    },
    geo: {
      latitude: 49.6117,
      longitude: 6.1319
    },
    sameAs: [
      'https://www.facebook.com/kreditpass',
      'https://www.linkedin.com/company/kreditpass',
      'https://twitter.com/kreditpass'
    ]
  }
} as const;
