import type { LoanOffer } from './loan-offers';
import { individualLoanOffers, businessLoanOffers } from './loan-offers';

export interface RequiredDocument {
  id: string;
  required: boolean;
}

export function getRequiredDocuments(accountType: 'individual' | 'business'): RequiredDocument[] {
  if (accountType === 'individual') {
    return [
      { id: 'id_card', required: true },
      { id: 'proof_of_address', required: true },
    ];
  } else {
    return [
      { id: 'kbis', required: true },
      { id: 'director_id', required: true },
      { id: 'company_statutes', required: true },
      { id: 'financial_statements', required: true },
      { id: 'tax_package', required: true },
      { id: 'bank_statements_pro', required: true },
      { id: 'business_plan', required: false },
      { id: 'financial_forecast', required: false },
      { id: 'quotes', required: false },
    ];
  }
}

export function calculateInterestRate(
  loanType: string,
  amount: number,
  duration: number,
  accountType: 'individual' | 'business'
): number {
  const offers = accountType === 'individual' ? individualLoanOffers : businessLoanOffers;
  const offer = offers.find(o => o.id === loanType);
  
  if (!offer) return 5.0;
  
  const rateRange = offer.rate.match(/(\d+(?:,\d+)?)/g);
  if (!rateRange || rateRange.length < 2) return 5.0;
  
  const minRate = parseFloat(rateRange[0].replace(',', '.'));
  const maxRate = parseFloat(rateRange[1].replace(',', '.'));
  
  const amountRange = offer.amount.match(/(\d+\s?\d*)/g);
  if (!amountRange || amountRange.length < 2) return minRate;
  
  const minAmount = parseInt(amountRange[0].replace(/\s/g, ''));
  const maxAmount = parseInt(amountRange[1].replace(/\s/g, ''));
  
  const amountRatio = (amount - minAmount) / (maxAmount - minAmount);
  const calculatedRate = minRate + (amountRatio * (maxRate - minRate));
  
  return Math.min(Math.max(calculatedRate, minRate), maxRate);
}

export function getLoanOfferLimits(loanType: string, accountType: 'individual' | 'business'): {
  minAmount: number;
  maxAmount: number;
  minDuration: number;
  maxDuration: number;
} {
  const offers = accountType === 'individual' ? individualLoanOffers : businessLoanOffers;
  const offer = offers.find(o => o.id === loanType);
  
  if (!offer) {
    return { minAmount: 1000, maxAmount: 75000, minDuration: 12, maxDuration: 84 };
  }
  
  const amountRange = offer.amount.match(/\d{1,3}(?:\s\d{3})*/g);
  const minAmount = amountRange ? parseInt(amountRange[0].replace(/\s/g, '')) : 1000;
  const maxAmount = amountRange ? parseInt(amountRange[1].replace(/\s/g, '')) : 75000;
  
  const durationRange = offer.duration.match(/(\d+)/g);
  let minDuration = durationRange ? parseInt(durationRange[0]) : 12;
  let maxDuration = durationRange ? parseInt(durationRange[1]) : 84;
  
  // Vérifier si la durée est en années (couvre tous les mots pour "année" dans différentes langues)
  // FR: ans, année(s) | EN: year(s) | ES/PT: año(s), anos | IT: anno, anni | DE: Jahre, Jahr | NL: jaar
  const isInYears = /\b(ans?|années?|years?|años?|anos?|ann[oi]|Jahre?|jaar)\b/i.test(offer.duration);
  
  // Convertir en mois si nécessaire (car en interne tout est stocké en mois)
  if (isInYears) {
    minDuration = minDuration * 12;
    maxDuration = maxDuration * 12;
  }
  
  return { minAmount, maxAmount, minDuration, maxDuration };
}
