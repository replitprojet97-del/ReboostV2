export const seoConfig = {
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5000',
  siteName: 'KreditPass',
  defaultTitle: 'KreditPass - Solutions de Financement | Crédits Professionnels et Particuliers',
  defaultDescription: 'KreditPass propose des solutions de crédit adaptées à vos projets personnels et professionnels. Accédez rapidement à des fonds avec des taux avantageux et un processus de validation transparent.',
  defaultKeywords: 'crédit professionnel, financement entreprise, prêt personnel, emprunt rapide, taux avantageux, financement PME, crédit société, solution de financement, prêt particulier, crédit auto, prêt immobilier, crédit étudiant, crédit consommation, prêt travaux, crédit renouvelable, prêt sans justificatif, financement pro',
  defaultImage: '/og-image.jpg',
  twitterHandle: '@kreditpass',
  themeColor: '#0066cc',
  locale: 'hr_HR',
  alternateLangs: ['hr', 'fr', 'es', 'pt', 'it', 'de'],
  organization: {
    name: 'KreditPass',
    logo: '/logo.png',
    telephone: '+352-27-12-34-56',
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
