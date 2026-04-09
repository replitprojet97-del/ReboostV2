import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { getOfficialStats } from "@/lib/constants";
import { useTranslations } from "@/lib/i18n";

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = false, inView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (startOnView && !inView) return;
    if (hasStarted) return;
    
    setHasStarted(true);
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (end - startValue) * easeOut);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, startOnView, inView, hasStarted]);

  return count;
}

function parseStatValue(value: string): { number: number; suffix: string; prefix: string } {
  const match = value.match(/^([€$£]?)([0-9,.\s]+)([+%MK]*)$/);
  if (!match) return { number: 0, suffix: '', prefix: '' };
  
  const prefix = match[1] || '';
  let numStr = match[2].replace(/[,\s]/g, '');
  const suffix = match[3] || '';
  
  return {
    prefix,
    number: parseFloat(numStr) || 0,
    suffix
  };
}

function AnimatedStatValue({ value, inView }: { value: string; inView: boolean }) {
  const { prefix, number, suffix } = parseStatValue(value);
  const animatedNumber = useCountUp(number, 2000, true, inView);
  
  const formattedNumber = number >= 1000 
    ? animatedNumber.toLocaleString('fr-FR')
    : animatedNumber.toString();

  return (
    <span className="text-foreground">
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const t = useTranslations();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const stats = getOfficialStats(t);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };
  
  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 bg-background">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-accent/2 pointer-events-none" />
      
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
            {t.premium.stats.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t.premium.stats.subtitle}
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="group"
              data-testid={`stat-card-${index}`}
            >
              <div className="relative h-full p-8 lg:p-10 rounded-xl border border-border bg-card hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center justify-center text-center">
                {/* Icon */}
                <motion.div 
                  className="inline-flex p-3 rounded-lg bg-accent/10 mb-6 group-hover:bg-accent/15 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <stat.icon className="h-6 w-6 text-accent" />
                </motion.div>

                {/* Stat value */}
                <div className="text-4xl lg:text-5xl font-bold mb-2 tabular-nums">
                  <AnimatedStatValue value={stat.value} inView={isInView} />
                </div>

                {/* Stat label */}
                <div className="text-sm lg:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
