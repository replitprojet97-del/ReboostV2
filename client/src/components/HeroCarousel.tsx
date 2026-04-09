import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useTranslations } from "@/lib/i18n";

const slideImages = ["/hero-1.png", "/hero-2.png", "/hero-3.png"];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, setLocation] = useLocation();
  const t = useTranslations();

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setPrevIndex(index);
      setIndex((prev) => (prev + 1) % Math.min(t.hero.slides.length, slideImages.length));
      setTimeout(() => setIsTransitioning(false), 1200);
    }, 6000);
    return () => clearInterval(timer);
  }, [index, t.hero.slides.length]);

  const handleSlideChange = (newIndex: number) => {
    if (newIndex !== index) {
      setIsTransitioning(true);
      setPrevIndex(index);
      setIndex(newIndex);
      setTimeout(() => setIsTransitioning(false), 1200);
    }
  };

  const currentSlides = t.hero.slides.slice(0, slideImages.length);

  return (
    <div className="relative h-[500px] md:h-[550px] w-full overflow-hidden mt-[165px]">
      {/* Slides with smooth crossfade transition */}
      {currentSlides.map((_, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity ease-in-out duration-[1200ms]
            ${i === index ? "opacity-100 z-[2]" : "opacity-0 z-[1]"}
          `}
        >
          <img
            src={slideImages[i]}
            alt={`Hero ${i + 1}`}
            className={`h-full w-full object-cover transition-transform duration-[8000ms] ease-out
              ${i === index ? "scale-105" : "scale-100"}
            `}
          />

          {/* Premium gradient overlay - Slate blue finance aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-blue-900/50"></div>
          
          {/* Subtle mesh overlay for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        </div>
      ))}

      {/* CONTENT */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-24 text-white max-w-5xl z-10">
        <h1 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] animate-fade-in"
          data-testid="text-hero-title"
        >
          {t.hero.slides[index]?.title}
        </h1>

        <p 
          className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-gray-100 max-w-2xl animate-fade-in delay-300 leading-relaxed"
          data-testid="text-hero-subtitle"
        >
          {t.hero.slides[index]?.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in delay-500">
          <button
            onClick={() => setLocation("/login")}
            className="px-6 sm:px-7 py-3 rounded-xl bg-primary font-semibold text-base shadow-lg
              hover:shadow-[0_0_20px_rgba(0,93,255,0.4)]
              transition-all duration-300 transform hover:scale-105"
            data-testid="button-apply-loan"
          >
            {t.hero.cta1}
          </button>

          <button
            onClick={() => setLocation("/how-it-works")}
            className="px-6 sm:px-7 py-3 rounded-lg border-2 border-white/40 font-semibold text-base backdrop-blur-sm
              hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            data-testid="button-learn-more"
          >
            {t.hero.learnMore}
          </button>
        </div>
      </div>

      {/* Slide indicators - Modern finance style */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {currentSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleSlideChange(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ease-out
              ${i === index 
                ? "w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                : "w-1.5 bg-white/30 hover:bg-white/50"
              }
            `}
            aria-label={`Go to slide ${i + 1}`}
            data-testid={`indicator-slide-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
