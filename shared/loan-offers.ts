import { Wallet, Home, Car, GraduationCap, Leaf, Hammer, Building2, TrendingUp, Wrench, Factory, CreditCard, Truck, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type LoanOfferType = 'individual' | 'business';

export type LoanOfferTranslationKey = 
  | 'personalLoan'
  | 'mortgageLoan'
  | 'autoLoan'
  | 'studentLoan'
  | 'greenLoan'
  | 'renovationLoan'
  | 'diverseLoan'
  | 'businessLoan'
  | 'cashFlowCredit'
  | 'equipmentFinancing'
  | 'commercialPropertyLoan'
  | 'lineOfCredit'
  | 'vehicleFleetLoan';

export interface LoanOffer {
  id: string;
  translationKey: LoanOfferTranslationKey;
  icon: LucideIcon;
  title: string;
  description: string;
  amount: string;
  rate: string;
  duration: string;
  accountType: LoanOfferType;
  features?: string[];
  color: string;
  bgColor: string;
}

export const loanOfferTranslationMap: Record<string, LoanOfferTranslationKey> = {
  'personal-loan': 'personalLoan',
  'mortgage-loan': 'mortgageLoan',
  'auto-loan': 'autoLoan',
  'student-loan': 'studentLoan',
  'green-loan': 'greenLoan',
  'renovation-loan': 'renovationLoan',
  'diverse-loan': 'diverseLoan',
  'business-loan': 'businessLoan',
  'cash-flow-credit': 'cashFlowCredit',
  'equipment-financing': 'equipmentFinancing',
  'commercial-property-loan': 'commercialPropertyLoan',
  'line-of-credit': 'lineOfCredit',
  'vehicle-fleet-loan': 'vehicleFleetLoan',
};

export const individualLoanOffers: LoanOffer[] = [
  {
    id: 'personal-loan',
    translationKey: 'personalLoan',
    icon: Wallet,
    title: 'Prêt Personnel',
    description: 'Financement flexible pour tous vos projets personnels',
    amount: '1 000€ - 1 000 000€',
    rate: '0,10% - 7%',
    duration: '12 - 84 mois',
    accountType: 'individual',
    features: ['Réponse rapide', 'Sans justificatif d\'utilisation', 'Remboursement flexible'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    id: 'mortgage-loan',
    translationKey: 'mortgageLoan',
    icon: Home,
    title: 'Prêt Immobilier',
    description: 'Financez l\'achat de votre résidence principale ou secondaire',
    amount: '50 000€ - 5 000 000€',
    rate: '2,5% - 4,5%',
    duration: '15 - 30 ans',
    accountType: 'individual',
    features: ['Taux fixe ou variable', 'Jusqu\'à 80% du montant', 'Assurance incluse'],
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    id: 'auto-loan',
    translationKey: 'autoLoan',
    icon: Car,
    title: 'Crédit Auto',
    description: 'Achetez votre véhicule neuf ou d\'occasion',
    amount: '5 000€ - 1 000 000€',
    rate: '1,9% - 5,5%',
    duration: '24 - 84 mois',
    accountType: 'individual',
    features: ['Déblocage rapide', 'Possibilité de remboursement anticipé', 'Assurance optionnelle'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    id: 'student-loan',
    translationKey: 'studentLoan',
    icon: GraduationCap,
    title: 'Prêt Étudiant',
    description: 'Financez vos études avec des conditions avantageuses',
    amount: '1 000€ - 1 000 000€',
    rate: '0,9% - 3,5%',
    duration: '24 - 120 mois',
    accountType: 'individual',
    features: ['Différé de remboursement', 'Taux préférentiels', 'Sans caution parentale possible'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
  {
    id: 'green-loan',
    translationKey: 'greenLoan',
    icon: Leaf,
    title: 'Prêt Vert',
    description: 'Financez vos projets de rénovation énergétique',
    amount: '3 000€ - 1 000 000€',
    rate: '0,5% - 4,0%',
    duration: '12 - 180 mois',
    accountType: 'individual',
    features: ['Taux réduit', 'Éligible aux aides d\'État', 'Financement éco-responsable'],
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
  {
    id: 'renovation-loan',
    translationKey: 'renovationLoan',
    icon: Hammer,
    title: 'Prêt Travaux',
    description: 'Rénovez et améliorez votre logement',
    amount: '3 000€ - 1 000 000€',
    rate: '1,5% - 6,0%',
    duration: '12 - 120 mois',
    accountType: 'individual',
    features: ['Sans hypothèque jusqu\'à 75k€', 'Déblocage progressif possible', 'Déduction fiscale possible'],
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
  },
  {
    id: 'diverse-loan',
    translationKey: 'diverseLoan',
    icon: Sparkles,
    title: 'Crédits Divers',
    description: 'Financez tous vos projets personnels : événements, équipements, loisirs, santé, bien-être',
    amount: '500€ - 1 000 000€',
    rate: '2,9% - 8,9%',
    duration: '6 - 96 mois',
    accountType: 'individual',
    features: ['Procédure simplifiée', 'Réponse rapide en 24h', 'Déblocage des fonds en 3 à 5 jours'],
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
  },
];

export const businessLoanOffers: LoanOffer[] = [
  {
    id: 'business-loan',
    translationKey: 'businessLoan',
    icon: Building2,
    title: 'Prêt Professionnel',
    description: 'Financement pour vos projets d\'entreprise, développement et trésorerie',
    amount: '10 000€ - 10 000 000€',
    rate: '3,5% - 8,5%',
    duration: '12 - 84 mois',
    accountType: 'business',
    features: ['Réponse sous 48h', 'Taux fixe', 'Remboursement flexible'],
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    id: 'cash-flow-credit',
    translationKey: 'cashFlowCredit',
    icon: TrendingUp,
    title: 'Crédit de Trésorerie',
    description: 'Solution rapide pour gérer vos besoins en fonds de roulement',
    amount: '5 000€ - 10 000 000€',
    rate: '4,0% - 9,0%',
    duration: '3 - 36 mois',
    accountType: 'business',
    features: ['Déblocage rapide', 'Sans garantie jusqu\'à 50k€', 'Flexible'],
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
  },
  {
    id: 'equipment-financing',
    translationKey: 'equipmentFinancing',
    icon: Wrench,
    title: 'Financement Équipement',
    description: 'Achetez vos équipements professionnels et matériels',
    amount: '20 000€ - 10 000 000€',
    rate: '3,9% - 7,5%',
    duration: '24 - 60 mois',
    accountType: 'business',
    features: ['Jusqu\'à 100% du montant', 'Option leasing', 'Déduction fiscale'],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
  {
    id: 'commercial-property-loan',
    translationKey: 'commercialPropertyLoan',
    icon: Factory,
    title: 'Prêt Immobilier Pro',
    description: 'Acquérez vos locaux, bureaux ou entrepôts professionnels',
    amount: '50 000€ - 50 000 000€',
    rate: '2,9% - 5,5%',
    duration: '5 - 25 ans',
    accountType: 'business',
    features: ['Durée longue', 'Apport à partir de 20%', 'Taux compétitif'],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    id: 'line-of-credit',
    translationKey: 'lineOfCredit',
    icon: CreditCard,
    title: 'Ligne de Crédit',
    description: 'Crédit renouvelable pour vos besoins ponctuels',
    amount: '5 000€ - 10 000 000€',
    rate: '5,0% - 9,5%',
    duration: 'Renouvelable',
    accountType: 'business',
    features: ['Disponible 24/7', 'Remboursement libre', 'Renouvellement auto'],
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/20',
  },
  {
    id: 'vehicle-fleet-loan',
    translationKey: 'vehicleFleetLoan',
    icon: Truck,
    title: 'Crédit Véhicule Pro',
    description: 'Financez votre flotte automobile ou véhicules utilitaires',
    amount: '10 000€ - 5 000 000€',
    rate: '3,2% - 6,5%',
    duration: '24 - 72 mois',
    accountType: 'business',
    features: ['LOA ou crédit classique', 'Option rachat', 'Assurance incluse'],
    color: 'text-rose-600',
    bgColor: 'bg-rose-50 dark:bg-rose-950/20',
  },
];

export const allLoanOffers: LoanOffer[] = [...individualLoanOffers, ...businessLoanOffers];

export function getLoanOffersByAccountType(accountType: LoanOfferType): LoanOffer[] {
  return accountType === 'individual' ? individualLoanOffers : businessLoanOffers;
}

export function getLoanOfferById(id: string): LoanOffer | undefined {
  return allLoanOffers.find(offer => offer.id === id);
}
