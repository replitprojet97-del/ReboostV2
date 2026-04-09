import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export default function ScrollingTestimonials() {
  const t = useTranslations();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollContent = scroller.querySelector('.scroll-content') as HTMLElement;
    if (!scrollContent) return;

    // Clean up any existing clones
    const existingClones = scroller.querySelectorAll('.scroll-content:not(:first-child)');
    existingClones.forEach(clone => clone.remove());

    // Create new clone with updated content
    const clone = scrollContent.cloneNode(true) as HTMLElement;
    scroller.appendChild(clone);

    let scrollPosition = 0;
    const scrollSpeed = 0.5;
    let animationFrame: number;

    const animate = () => {
      scrollPosition += scrollSpeed;
      const maxScroll = scrollContent.scrollWidth;

      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }

      scroller.scrollLeft = scrollPosition;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      // Clean up clones when component unmounts or dependencies change
      const clones = scroller.querySelectorAll('.scroll-content:not(:first-child)');
      clones.forEach(clone => clone.remove());
    };
  }, [t.testimonials.reviews]);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-12 md:mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent tracking-tight">
            {t.testimonials.title}
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground font-light">
            {t.testimonials.subtitle}
          </p>
        </div>
      </div>

      <div 
        ref={scrollerRef}
        className="relative overflow-hidden hide-scrollbar"
        style={{ whiteSpace: 'nowrap' }}
      >
        <div className="scroll-content inline-flex gap-5 sm:gap-7 pr-5 sm:pr-7">
          {t.testimonials.reviews.map((review, index) => (
            <Card 
              key={index} 
              className="inline-block w-[320px] sm:w-[360px] md:w-[400px] p-6 sm:p-8 align-top bg-gradient-to-br from-card to-card/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover-elevate border-2"
              style={{ whiteSpace: 'normal' }}
              data-testid={`card-review-${index}`}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center font-bold text-white text-xl shadow-lg flex-shrink-0">
                  {review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground text-lg">{review.name}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{review.role}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{review.company}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-accent text-accent drop-shadow-sm" />
                ))}
              </div>

              <p className="text-base text-foreground leading-relaxed font-normal">
                {review.text}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
