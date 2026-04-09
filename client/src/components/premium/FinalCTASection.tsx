import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default function FinalCTASection() {
  const t = useTranslations();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };
  
  return (
    <section className="relative py-16 lg:py-24 bg-foreground overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Icon */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center p-3 rounded-full bg-background/10"
          >
            <Sparkles className="w-6 h-6 text-background" />
          </motion.div>
        </motion.div>

        <motion.h2 
          variants={itemVariants}
          className="text-3xl lg:text-4xl xl:text-5xl font-bold text-background mb-6 leading-tight"
        >
          {t.premium.finalCTA.title}
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-lg lg:text-xl text-background/70 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t.premium.finalCTA.subtitle}
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link href="/loans/new">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg"
                className="group px-8 py-6 text-base font-semibold rounded-full bg-accent text-accent-foreground border border-accent-border btn-shimmer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(124,58,237,0.4)] hover:-translate-y-1 no-default-hover-elevate no-default-active-elevate"
                data-testid="button-start-dossier"
              >
                {t.premium.finalCTA.primaryButton}
                <ArrowRight className="h-4 w-4 ml-2 icon-arrow-right" />
              </Button>
            </motion.div>
          </Link>

          <Link href="/contact">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-6 text-base font-semibold rounded-full border-background/30 text-background transition-all duration-300 hover:bg-background/10 hover:border-background/50 hover:-translate-y-1 no-default-hover-elevate no-default-active-elevate"
                data-testid="button-talk-adviser"
              >
                {t.premium.finalCTA.secondaryButton}
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-6 lg:gap-8 text-sm text-background/60"
        >
          {[
            t.premium.finalCTA.trustBadges.noCommitment,
            t.premium.finalCTA.trustBadges.response24h,
            t.premium.finalCTA.trustBadges.secure100
          ].map((badge, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="p-1 rounded-full bg-accent/20">
                <Check className="h-3 w-3 text-accent" />
              </div>
              <span>{badge}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
