import { useTranslations } from '@/lib/i18n';
import { TrendingUp, Award, Users, Building2 } from 'lucide-react';
const hsbcLogo = '/bank_logos/hsbc.svg';
const santanderLogo = '/bank_logos/santander.svg';

export default function PartnersSection() {
  const t = useTranslations();

  const partnerLogos = [
    { name: 'HSBC', logo: hsbcLogo },
    { name: 'Santander', logo: santanderLogo },
  ];

  const trustIndicators = [
    {
      icon: Building2,
      value: '50+',
      label: t.partners.banksNetwork,
    },
    {
      icon: TrendingUp,
      value: '€2.5B+',
      label: t.partners.loansFunded,
    },
    {
      icon: Award,
      value: '25+',
      label: t.partners.yearsExperience,
    },
    {
      icon: Users,
      value: '98%',
      label: t.partners.satisfactionRate,
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" data-testid="text-partners-title">
            {t.partners.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-partners-subtitle">
            {t.partners.subtitle}
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {trustIndicators.map((indicator, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-md"
              data-testid={`card-indicator-${index}`}
            >
              <indicator.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold mb-1" data-testid={`text-indicator-value-${index}`}>
                {indicator.value}
              </div>
              <div className="text-sm text-muted-foreground" data-testid={`text-indicator-label-${index}`}>
                {indicator.label}
              </div>
            </div>
          ))}
        </div>

        {/* Partner Logos Grid */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center mb-8" data-testid="text-partners-network">
            {t.partners.networkTitle}
          </h3>
          <div className="flex justify-center gap-6 flex-wrap">
            {partnerLogos.map((partner, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-6 bg-white dark:bg-card rounded-md hover-elevate active-elevate-2 transition-all border border-border w-[200px]"
                data-testid={`card-partner-${index}`}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-full h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  data-testid={`img-partner-logo-${index}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-6">
          {t.partners.benefits.map((benefit: string, index: number) => (
            <div
              key={index}
              className="p-6 bg-card rounded-md text-center"
              data-testid={`card-benefit-${index}`}
            >
              <p className="text-sm" data-testid={`text-benefit-${index}`}>
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
