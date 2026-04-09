import { motion } from "framer-motion";
import { Building2, User, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const expertiseIcons = [Building2, User, RefreshCw, Sparkles];

export default function ExpertisesModern() {
  const t = useTranslations();
  const [, setLocation] = useLocation();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-background">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/3 to-background pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t.premium.expertises.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.premium.expertises.subtitle}
          </p>
        </motion.div>

        {/* Expertise cards grid */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {t.premium.expertises.items.map((expertise, index) => {
            const Icon = expertiseIcons[index];
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
                data-testid={`expertise-card-${index}`}
              >
                <div className="h-full p-8 lg:p-10 rounded-xl border border-border bg-card hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Icon container */}
                  <div className="inline-flex p-3 rounded-lg bg-accent/10 mb-6 group-hover:bg-accent/15 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {expertise.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                    {expertise.description}
                  </p>

                  {/* Features tags */}
                  <div className="flex flex-wrap gap-2">
                    {expertise.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 text-xs font-medium rounded-md bg-accent/8 text-foreground/80 border border-accent/15"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Button
            size="lg"
            className="px-8 rounded-lg"
            onClick={() => setLocation('/products')}
            data-testid="button-learn-more-all-expertises"
          >
            {t.hero.learnMore}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
