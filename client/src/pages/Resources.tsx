import HeaderPremium from '@/components/HeaderPremium';
import FooterPremium from '@/components/premium/FooterPremium';
import SEO from '@/components/SEO';
import { useTranslations, useLanguage } from '@/lib/i18n';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqSchema } from '@/lib/seo-data';
import { getResourcesSEOByLocale } from '@/lib/seo-keywords';

export default function Resources() {
  const t = useTranslations();
  const { language } = useLanguage();
  const seo = getResourcesSEOByLocale(language);
  
  const faqData = t.resources.faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));

  return (
    <div className="min-h-screen">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        path="/resources"
        structuredData={faqSchema(faqData)}
      />
      <HeaderPremium />
      <main className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {t.resources.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">{t.resources.subtitle}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-10 md:p-12 bg-white shadow-xl hover:shadow-2xl hover:-translate-y-1 border-none transition-all duration-300">
              <div className="mb-10 pb-8 border-b">
                <h2 className="text-3xl font-bold text-gray-900">{t.resources.faqTitle}</h2>
                <p className="text-gray-600 mt-2">{t.resources.faqDescription}</p>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {t.resources.faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-gray-200 rounded-xl px-6 hover:shadow-md transition-all duration-300 hover:border-[#005DFF]/30"
                  >
                    <AccordionTrigger className="text-left py-5 hover:no-underline">
                      <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </div>
      </main>
      <FooterPremium />
    </div>
  );
}
