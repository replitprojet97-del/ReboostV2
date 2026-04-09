import type { LoanOffer } from '@shared/loan-offers';
import type { Language } from './i18n';
import { translations } from './i18n';

export interface TranslatedLoanOffer extends Omit<LoanOffer, 'title' | 'description' | 'features'> {
  title: string;
  description: string;
  features: string[];
}

export function getTranslatedLoanOffer(offer: LoanOffer, language: Language): TranslatedLoanOffer {
  const loanTypeTranslations = translations[language]?.loanOffers?.types?.[offer.translationKey];
  
  if (!loanTypeTranslations) {
    return {
      ...offer,
      title: offer.title,
      description: offer.description,
      features: offer.features || [],
    };
  }

  return {
    ...offer,
    title: loanTypeTranslations.title,
    description: loanTypeTranslations.description,
    features: loanTypeTranslations.features,
  };
}

export function getTranslatedLoanOffers(offers: LoanOffer[], language: Language): TranslatedLoanOffer[] {
  return offers.map(offer => getTranslatedLoanOffer(offer, language));
}
