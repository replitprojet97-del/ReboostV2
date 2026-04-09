import { useLocation } from 'wouter';
import { useTranslations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroPremium() {
  const [, setLocation] = useLocation();
  const t = useTranslations();

  const trustBadges = [
    { icon: Shield, label: t.hero.trustBadges.swissSecurity },
    { icon: Clock, label: t.hero.trustBadges.response24h },
    { icon: CheckCircle, label: t.hero.trustBadges.fastApproval },
  ];

  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden bg-hero-gradient">
      {/* Animated glow effects */}
      <div className="hero-glow animate-float-glow" style={{ top: '20%', left: '15%' }} />
      <div className="hero-glow animate-float-glow" style={{ top: '60%', right: '10%', animationDelay: '3s' }} />
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--accent)/0.15)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline with staggered animation */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
          >
            <span className="block">{t.hero.title.split(' ').slice(0, 3).join(' ')}</span>
            <span className="block mt-2 bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
              {t.hero.title.split(' ').slice(3).join(' ')}
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTA Buttons with enhanced animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12"
          >
            <Button
              size="lg"
              className="px-8 py-6 text-base font-semibold rounded-full group btn-premium-primary btn-shimmer no-default-hover-elevate no-default-active-elevate bg-accent text-accent-foreground border border-accent-border"
              onClick={() => setLocation('/products')}
              data-testid="button-hero-cta-primary"
            >
              {t.hero.cta1}
              <ArrowRight className="w-4 h-4 ml-2 icon-arrow-right" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base font-semibold rounded-full btn-premium-outline no-default-hover-elevate no-default-active-elevate"
              onClick={() => setLocation('/login')}
              data-testid="button-hero-cta-secondary"
            >
              {t.hero.cta2}
            </Button>
          </motion.div>

          {/* Trust Badges with staggered entrance */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 lg:gap-10"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-2 text-muted-foreground group"
                data-testid={`trust-badge-${index}`}
              >
                <div className="p-1.5 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-200">
                  <badge.icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
