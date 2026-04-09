import HeroSection from '@/components/HeroSection';
import HeaderPremium from '@/components/HeaderPremium';
import StatsSection from '@/components/premium/StatsSection';
import StorytellingSection from '@/components/premium/StorytellingSection';
import SectorsInterventionCards from '@/components/premium/SectorsInterventionCards';
import BankingSecurity from '@/components/premium/BankingSecurity';
import TestimonialsSlider from '@/components/premium/TestimonialsSlider';
import FinalCTASection from '@/components/premium/FinalCTASection';
import FooterPremium from '@/components/premium/FooterPremium';
import SEO from '@/components/SEO';
import { organizationSchema, websiteSchema } from '@/lib/seo-data';
import { getKeywordsByPage } from '@/lib/seo-keywords';
import { useTranslations } from '@/lib/i18n';

export default function Home() {
  const t = useTranslations();
  
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t.seo.home.title}
        description={t.seo.home.description}
        keywords={getKeywordsByPage('home')}
        path="/"
        structuredData={[organizationSchema, websiteSchema]}
      />
      
      <HeaderPremium />
      
      <HeroSection />
      
      <SectorsInterventionCards />
      <StorytellingSection />
      <StatsSection />
      <BankingSecurity />
      <TestimonialsSlider />
      <FinalCTASection />
      
      <FooterPremium />
    </div>
  );
}
