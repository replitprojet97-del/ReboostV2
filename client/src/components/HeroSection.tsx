import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import gsap from 'gsap';
import './hero.css';
import { useTranslations } from '@/lib/i18n';

export default function HeroSection() {
  const t = useTranslations();
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const slides = [0, 1, 2, 3, 4, 5];

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ repeat: -1 });
      timelineRef.current = timeline;

      slides.forEach((index) => {
        const isLastSlide = index === slides.length - 1;

        timeline.set(`.slide-${index}`, { visibility: 'visible', opacity: 1 }, `slide-${index}-start`);
        timeline.call(() => setCurrentSlide(index), [], `slide-${index}-start`);

        timeline.fromTo(
          `.slide-${index} .text`,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          `slide-${index}-start`
        );

        timeline.to(`.slide-${index} .text`, { opacity: 1, duration: 2 }, '+=0');

        if (!isLastSlide) {
          timeline.to(`.slide-${index} .text`, { opacity: 0, duration: 0.4 }, '+=0');
          timeline.set(`.slide-${index}`, { visibility: 'hidden', opacity: 0 }, '+=0');
        } else {
          timeline.to(`.slide-${index} .text`, { opacity: 0, duration: 0.4 }, '+=0');
          timeline.set(`.slide-${index}`, { visibility: 'hidden', opacity: 0 }, '+=0');
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // IMPROVEMENT #6: Pause animation on hover
  const handleHover = (hovering: boolean) => {
    setIsHovering(hovering);
    if (timelineRef.current) {
      if (hovering) {
        timelineRef.current.pause();
      } else {
        timelineRef.current.play();
      }
    }
  };

  return (
    <section 
      className="hero" 
      ref={containerRef}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      data-testid="hero-section"
    >
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const slideText = t.hero.slides[index];
        return (
          <div className={`slide slide-${index}`} key={index} data-testid={`slide-hero-${index}`}>
            <div className="text" data-testid={`text-hero-${index}`}>
              <h1 data-testid={`title-${index}`}>{slideText?.title || t.hero.title}</h1>
              <p data-testid={`subtitle-${index}`}>{slideText?.subtitle || t.hero.subtitle}</p>
              <button 
                className="cta-button" 
                data-testid={`cta-${index}`}
                onClick={() => setLocation('/loans/new')}
              >
                {t.hero.cta1}
              </button>
            </div>
          </div>
        );
      })}

      {/* Slide Indicators (Dots) */}
      <div className="slide-indicators" data-testid="slide-indicators">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            data-testid={`dot-${index}`}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
