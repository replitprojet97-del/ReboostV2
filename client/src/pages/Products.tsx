import HeaderPremium from '@/components/HeaderPremium';
import FooterPremium from '@/components/premium/FooterPremium';
import SEO from '@/components/SEO';
import { useTranslations, useLanguage } from '@/lib/i18n';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { getIndividualLoans, getBusinessLoans } from '@/lib/loan-catalog';
import { loanProductSchema } from '@/lib/seo-data';
import { getProductsSEOByLocale } from '@/lib/seo-keywords';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { getOfficialStats } from '@/lib/constants';

export default function Products() {
  const t = useTranslations();
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const seo = getProductsSEOByLocale(language);
  
  const individualProducts = getIndividualLoans(t);
  const businessProducts = getBusinessLoans(t);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background dark:from-background dark:to-background">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        path="/products"
        structuredData={loanProductSchema(language)}
      />
      <HeaderPremium />
      
      {/* Hero Section */}
      <section className="relative pt-4 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 dark:from-accent/10 dark:via-primary/5 dark:to-accent/10" />
        
        {/* Animated circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-card/80 dark:bg-card/60 backdrop-blur-sm border border-border mb-6">
              <Sparkles className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm font-semibold text-accent">{t.products.premiumFinancingTitle}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              {t.products.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.products.subtitle}
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {getOfficialStats(t).map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${stat.color} mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Individual Loans Section */}
      <section id="individual" className="relative py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-4">
              {t.products.forIndividuals}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-individual-loans">
              {t.individualLoans.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.individualLoans.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {individualProducts.map((product, index) => {
              const Icon = product.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  data-testid={`card-individual-loan-${index}`}
                  onClick={() => setLocation('/how-it-works')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setLocation('/how-it-works');
                    }
                  }}
                >
                  <Card className="relative h-full p-8 bg-card border border-border hover:border-accent/30 hover:shadow-xl dark:hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1 overflow-visible">
                    <div className={`inline-flex p-4 rounded-2xl ${product.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${product.color}`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4 text-foreground">{product.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
                    
                    <div className="space-y-3 mb-8 pb-6 border-t border-border pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t.products.amount}</span>
                        <span className="font-bold text-foreground">{product.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t.products.rate}</span>
                        <span className="font-bold text-accent">{product.rate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t.products.duration}</span>
                        <span className="font-bold text-foreground">{product.duration}</span>
                      </div>
                    </div>
                    
                    <Link href="/loans/new">
                      <Button 
                        className="w-full group/btn" 
                        data-testid={`button-apply-individual-${index}`}
                      >
                        {t.hero.cta1}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Business Loans Section */}
      <section id="business" className="relative py-24 bg-gradient-to-b from-muted/30 to-background scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-4">
              {t.products.forBusinesses}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-business-loans">
              {t.products.businessTitle}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t.products.businessSubtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {businessProducts.map((product, index) => {
              const Icon = product.icon;
              const features = product.featuresKey ? (t.businessLoans as any)[product.featuresKey] : [];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  data-testid={`card-business-loan-${index}`}
                  onClick={() => setLocation('/how-it-works')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setLocation('/how-it-works');
                    }
                  }}
                >
                  <Card className="relative h-full p-10 bg-card border border-border hover:border-accent/30 hover:shadow-xl dark:hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1 overflow-visible">
                    <div className={`inline-flex p-5 rounded-2xl ${product.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-10 h-10 ${product.color}`} />
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-4 text-foreground">{product.title}</h3>
                    <p className="text-muted-foreground mb-8 leading-relaxed text-lg">{product.description}</p>
                    
                    <div className="space-y-3 mb-8 pb-8 border-t border-b border-border pt-8">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t.products.amount}</span>
                        <span className="font-bold text-foreground">{product.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t.products.rate}</span>
                        <span className="font-bold text-accent">{product.rate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t.products.duration}</span>
                        <span className="font-bold text-foreground">{product.duration}</span>
                      </div>
                    </div>
                    
                    {features && features.length > 0 && (
                      <ul className="space-y-3 mb-8">
                        {features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start text-foreground/80">
                            <CheckCircle2 className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <Link href="/loans/new">
                      <Button 
                        className="w-full h-12 text-base group/btn" 
                        data-testid={`button-apply-business-${index}`}
                      >
                        {t.hero.cta1}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold mb-6">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              {t.products.advisors247}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.products.ctaTitle}
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              {t.products.ctaSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/loans/new">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold min-w-[200px]">
                  {t.products.ctaButton1}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold min-w-[200px]">
                  {t.products.ctaButton2}
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.products.ctaBadge1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.products.ctaBadge2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.products.ctaBadge3}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterPremium />
    </div>
  );
}
