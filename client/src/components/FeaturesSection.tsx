import { Shield, Clock, TrendingDown, Award } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export default function FeaturesSection() {
  const t = useTranslations();

  const features = [
    {
      icon: Shield,
      title: t.features.security,
      description: t.features.securityDesc,
    },
    {
      icon: Clock,
      title: t.features.fast,
      description: t.features.fastDesc,
    },
    {
      icon: TrendingDown,
      title: t.features.competitive,
      description: t.features.competitiveDesc,
    },
    {
      icon: Award,
      title: t.features.flexible,
      description: t.features.flexibleDesc,
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {t.features.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
