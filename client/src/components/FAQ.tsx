import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { HelpCircle } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export default function FAQ() {
  const t = useTranslations();

  return (
    <section className="py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t.professionalFAQ.title}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              {t.professionalFAQ.subtitle}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {t.professionalFAQ.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} data-testid={`accordion-faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 sm:mt-12 text-center bg-muted/30 rounded-lg p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              {t.professionalFAQ.notFoundTitle}
            </h3>
            <p className="text-base text-muted-foreground mb-5 sm:mb-6">
              {t.professionalFAQ.notFoundDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-contact-us">
                  {t.professionalFAQ.contactUs}
                </Button>
              </Link>
              <Link href="/resources" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-resources">
                  {t.professionalFAQ.helpCenter}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
