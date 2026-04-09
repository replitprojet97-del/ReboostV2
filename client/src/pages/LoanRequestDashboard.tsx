import { useLocation } from 'wouter';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type LoanOffer } from '@shared/loan-offers';
import { useUser, getAccountTypeLabel } from '@/hooks/use-user';
import { Info } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import LoanOffersCatalog from '@/components/LoanOffersCatalog';
import { SectionTitle, GlassPanel } from '@/components/fintech';

export default function LoanRequestDashboard() {
  const t = useTranslations();
  const { data: user } = useUser();
  const [, setLocation] = useLocation();

  const handleRequestLoan = (offer: LoanOffer) => {
    console.log('Loan requested:', offer);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto space-y-6">
        <SectionTitle
          title={t.loanOffers.pageTitle}
          subtitle={t.loanOffers.pageSubtitle}
        />

        {user && (
          <GlassPanel intensity="medium" className="p-6">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-primary/10 h-fit">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Informations de votre compte</h3>
                <p className="text-sm text-muted-foreground">
                  {t.loanOffers.accountInfo.replace('{accountType}', getAccountTypeLabel(user.accountType))}
                </p>
              </div>
            </div>
          </GlassPanel>
        )}
      </div>

      <LoanOffersCatalog onRequestLoan={handleRequestLoan} />
    </div>
  );
}
