import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Star, Quote } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

const avatarImages = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=13",
  "https://i.pravatar.cc/150?img=20",
  "https://i.pravatar.cc/150?img=33",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=51"
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05, duration: 0.2 }}
        >
          <Star className="h-4 w-4 fill-accent text-accent star-animated" />
        </motion.div>
      ))}
    </div>
  );
}

export default function TestimonialsSlider() {
  const t = useTranslations();
  
  return (
    <section className="relative py-16 lg:py-20 bg-background overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-3 rounded-full bg-accent/10 mb-4"
          >
            <Quote className="w-6 h-6 text-accent" />
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t.premium.testimonials.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.premium.testimonials.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="pb-14"
          >
            {t.premium.testimonials.items.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full p-6 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 transition-all duration-300 hover:shadow-lg hover:border-accent/40 testimonial-card-premium"
                  data-testid={`testimonial-${index}`}
                >
                  {/* Quote icon */}
                  <div className="flex items-center justify-between mb-4">
                    <StarRating />
                    <Quote className="w-5 h-5 text-accent/30" />
                  </div>

                  <p className="text-foreground mb-6 leading-relaxed text-sm lg:text-base">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-accent/10">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <img
                        src={avatarImages[index]}
                        alt={testimonial.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-accent/30 shadow-sm"
                      />
                    </motion.div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
