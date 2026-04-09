import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Link } from "wouter";
import { useTranslations, useLanguage } from "@/lib/i18n";
import { getStorytellingFeatures } from "@/lib/storytelling-features";
import { getTitleWords, type LanguageCode } from "@/lib/title-translations";

export default function StorytellingSection() {
  const t = useTranslations();
  const { language } = useLanguage();
  
  const features = getStorytellingFeatures(language).map(text => ({
    icon: Check,
    text
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
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
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Premium background with gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50 translate-y-1/2" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Full width content section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-12 space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/30"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">{t.premium.storytelling.badge}</span>
            </motion.div>

            {/* Main title with premium styling */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Decorative quote mark */}
              <div className="inline-block">
                <span className="text-8xl font-bold text-accent/20 leading-none">"</span>
              </div>

              {/* Premium title with split styling - MULTILINGUE */}
              <div className="space-y-2">
                {/* First line: word1 and word2 */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="text-5xl lg:text-7xl font-black text-foreground leading-tight tracking-tight">
                    {getTitleWords(language as LanguageCode)[0].text}
                  </h2>
                  <span className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                    {getTitleWords(language as LanguageCode)[1].text}
                  </span>
                </div>
                {/* Second line: separator + word3 + word4 */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl lg:text-4xl font-light text-muted-foreground">
                    {/* Subtle separator dot */}
                    <span className="inline-block w-2 h-2 rounded-full bg-accent/40 mx-2" />
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-semibold text-foreground/90">
                    {getTitleWords(language as LanguageCode)[2].text}
                  </h2>
                  <span className="text-4xl lg:text-5xl font-bold text-accent">
                    {getTitleWords(language as LanguageCode)[3].text}
                  </span>
                </div>
              </div>

              {/* Animated underline with premium styling */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="origin-left space-y-2"
              >
                <div className="h-1.5 w-32 bg-gradient-to-r from-accent via-accent/60 to-transparent rounded-full shadow-lg shadow-accent/30" />
                <div className="h-0.5 w-20 bg-gradient-to-r from-accent/40 to-transparent rounded-full" />
              </motion.div>

              {/* Premium stat badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="inline-flex items-center gap-2 pt-2"
              >
                <div className="flex -space-x-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div className="w-2 h-2 rounded-full bg-accent/70" />
                  <div className="w-2 h-2 rounded-full bg-accent/40" />
                </div>
                <span className="text-sm font-medium text-accent">Proven Excellence Since 2014</span>
              </motion.div>
            </motion.div>

            {/* Descriptions */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.premium.storytelling.paragraph1}
              </p>
              <p className="text-base text-muted-foreground/80 leading-relaxed">
                {t.premium.storytelling.paragraph2}
              </p>
            </motion.div>

            {/* Features list */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-4 py-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm lg:text-base">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="pt-4"
            >
              <Link href="/about">
                <button 
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:shadow-lg"
                  data-testid="button-discover-more"
                >
                  {t.premium.storytelling.ctaButton}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
