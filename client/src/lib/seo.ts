export type Language = 'fr' | 'en' | 'es' | 'pt' | 'it' | 'de' | 'nl' | 'hr';

export const SEO_CONTENT: Record<Language, { title: string; description: string }> = {
  fr: {
    title: 'KreditPass – Solutions de Financement Sécurisées et Prêts Professionnels',
    description: 'KreditPass offre des solutions de financement premium et sécurisées pour vos projets. Gestion de prêts, transferts bancaires et contrats professionnels avec une discrétion absolue.'
  },
  en: {
    title: 'KreditPass – Secure Financing Solutions and Professional Loans',
    description: 'KreditPass offers premium and secure financing solutions for your projects. Loan management, bank transfers and professional contracts with absolute discretion.'
  },
  es: {
    title: 'KreditPass – Financiación online rápida para particulares y empresas',
    description: 'KreditPass ofrece soluciones de financiación 100 % online para particulares y empresas. Solicitud sencilla, respuesta rápida y acceso ágil a los fondos.'
  },
  pt: {
    title: 'KreditPass – Financiamento online rápido para particulares e empresas',
    description: 'A KreditPass disponibiliza soluções de financiamento totalmente online para particulares e empresas, com pedido simplificado, resposta rápida e liberação eficiente dos fundos.'
  },
  it: {
    title: 'KreditPass – Finanziamenti online rapidi per privati e imprese',
    description: 'KreditPass offre soluzioni di finanziamento completamente online per privati e imprese, con richiesta semplificata, risposta rapida e rapida erogazione dei fondi.'
  },
  de: {
    title: 'KreditPass – Schnelle Online-Finanzierung für Privat- und Geschäftskunden',
    description: 'KreditPass bietet vollständig digitale Finanzierungslösungen für Privatpersonen und Unternehmen mit einfacher Antragstellung, schneller Entscheidung und zügiger Auszahlung.'
  },
  nl: {
    title: 'KreditPass – Snelle online financiering voor particulieren en bedrijven',
    description: 'KreditPass biedt volledig online financieringsoplossingen voor particulieren en bedrijven, met een eenvoudig aanvraagproces, snelle beslissing en vlotte uitbetaling.'
  },
  hr: {
    title: 'KreditPass – Sigurna rješenja za financiranje i profesionalni krediti',
    description: 'KreditPass nudi vrhunska i sigurna rješenja financiranja za vaše projekte. Upravljanje kreditima, bankovni transferi i profesionalni ugovori s apsolutnom diskrecijom.'
  }
};

export const LANGUAGE_CODES: Record<Language, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-PT',
  it: 'it-IT',
  de: 'de-DE',
  nl: 'nl-NL',
  hr: 'hr-HR'
};

export const LANGUAGES: Language[] = ['fr', 'en', 'es', 'pt', 'it', 'de', 'nl', 'hr'];

export function getLanguageFromUrl(): Language {
  if (typeof window === 'undefined') return 'en';
  const pathname = window.location.pathname;
  const lang = pathname.split('/')[1];
  return LANGUAGES.includes(lang as Language) ? (lang as Language) : 'en';
}

export function getLanguageFromNavigator(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  return LANGUAGES.includes(browserLang as Language) ? (browserLang as Language) : 'en';
}

export function getLanguageFromIP(): Language {
  const lang = (window as any).__LANGUAGE_FROM_IP || getLanguageFromNavigator();
  return LANGUAGES.includes(lang as Language) ? (lang as Language) : 'en';
}

export function detectLanguage(): Language {
  return getLanguageFromIP();
}

export function getSEOContent(language: Language = 'en') {
  return SEO_CONTENT[language] || SEO_CONTENT.en;
}

export function getHrefLang(language: Language): string {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://kreditpass.org';
  return `${baseUrl}`;
}
