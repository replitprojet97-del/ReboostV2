import HeaderPremium from '@/components/HeaderPremium';
import FooterPremium from '@/components/premium/FooterPremium';
import SEO from '@/components/SEO';
import { useTranslations, useLanguage } from '@/lib/i18n';
import { Card } from '@/components/ui/card';
import { getTermsSEOByLocale } from '@/lib/seo-keywords';
import { Shield } from 'lucide-react';

export default function Terms() {
  const t = useTranslations();
  const { language } = useLanguage();
  const seo = getTermsSEOByLocale(language);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        path="/terms"
        noindex={false}
      />
      <HeaderPremium />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {t.legal.termsTitle}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t.legal.lastUpdatedNovember2025}
              </p>
            </div>
            
            <Card className="p-8 sm:p-10 md:p-12 prose prose-slate dark:prose-invert max-w-none bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">{t.legal.terms.section1Title}</h2>
              <p className="text-gray-700 leading-relaxed">{t.legal.terms.section1Content}</p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4 mt-8">{t.legal.terms.section2Title}</h2>
              <p className="text-gray-700 leading-relaxed">{t.legal.terms.section2Content}</p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4 mt-8">{t.legal.terms.section3Title}</h2>
              <p className="text-gray-700 leading-relaxed">{t.legal.terms.section3Content}</p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4 mt-8">{t.legal.terms.section4Title}</h2>
              <p className="text-gray-700 leading-relaxed">{t.legal.terms.section4Content}</p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4 mt-8">{t.legal.terms.section5Title}</h2>
              <p className="text-gray-700 leading-relaxed">{t.legal.terms.section5Content}</p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4 mt-8">{t.legal.terms.section6Title}</h2>
              <p className="text-gray-700 leading-relaxed">{t.legal.terms.section6Content}</p>

              <div className="mt-12 pt-6 border-t border-gray-200">
                <p className="text-sm text-muted-foreground">
                  {t.legal.lastUpdated}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <FooterPremium />
    </div>
  );
}
