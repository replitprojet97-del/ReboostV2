import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { getLoanOfferById } from '@shared/loan-offers';
import { useTranslations, useLanguage } from '@/lib/i18n';
import { getTranslatedLoanOffers } from '@/lib/loan-offer-i18n';
import { SectionTitle, GlassPanel } from '@/components/fintech';

interface LoanOfferDetailProps {
  params?: {
    offerId: string;
  };
}

export default function LoanOfferDetail({ params }: LoanOfferDetailProps) {
  const t = useTranslations();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();

  // Extract offerId from current URL path
  const pathParts = window.location.pathname.split('/');
  const offerId = params?.offerId || pathParts[pathParts.length - 1];

  const baseOffer = getLoanOfferById(offerId);
  if (!baseOffer) {
    return (
      <div className="p-6 md:p-8 space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Offer not found</h1>
          <Button onClick={() => setLocation('/loan-request')}>Back to offers</Button>
        </div>
      </div>
    );
  }

  const [offer] = getTranslatedLoanOffers([baseOffer], language);
  const IconComponent = offer.icon;

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation('/loan-request')}
          className="gap-2"
          data-testid="button-back-offer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to offers
        </Button>

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start gap-6">
            <div className={`p-4 rounded-lg ${offer.bgColor}`}>
              <IconComponent className={`h-10 w-10 ${offer.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{offer.title}</h1>
                <Badge>{offer.accountType === 'individual' ? 'Individual' : 'Business'}</Badge>
              </div>
              <p className="text-lg text-muted-foreground">{offer.description}</p>
            </div>
          </div>
        </div>

        {/* Key Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassPanel intensity="medium" className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground uppercase font-semibold">{t.loanOffers.amountLabel}</p>
              <p className="text-2xl font-bold text-primary">{offer.amount}</p>
            </div>
          </GlassPanel>
          <GlassPanel intensity="medium" className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground uppercase font-semibold">{t.loanOffers.rateLabel}</p>
              <p className="text-2xl font-bold text-primary">{offer.rate}</p>
            </div>
          </GlassPanel>
          <GlassPanel intensity="medium" className="p-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground uppercase font-semibold">{t.loanOffers.durationLabel}</p>
              <p className="text-2xl font-bold text-primary">{offer.duration}</p>
            </div>
          </GlassPanel>
        </div>

        {/* Features */}
        {offer.features && offer.features.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t.loanOffers.advantagesLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offer.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <GlassPanel intensity="medium" className="p-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold">Ready to apply?</h2>
            <p className="text-muted-foreground">Start your application process now and get a decision within 24 hours.</p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => setLocation(`/loan-request?offerId=${offerId}`)}
              data-testid="button-apply-offer"
            >
              Apply Now
            </Button>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
