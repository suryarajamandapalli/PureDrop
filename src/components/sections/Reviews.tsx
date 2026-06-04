import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    quote: "The consistency of Pure Drop milk is unparalleled. It is the only dairy we trust for our five-star pastry program.",
    name: "Chef Elena Rodriguez",
    role: "Culinary Director, Hyatt Group",
    initial: "E",
  },
  {
    quote: "Delivery is always on time, packaging is premium, and the taste reminds me of the milk my grandmother used to get from the village.",
    name: "Anita Sharma",
    role: "Home subscriber, 2 years",
    initial: "A",
  },
  {
    quote: "We switched our entire café chain to Pure Drop. Our customers immediately noticed the difference in our coffee.",
    name: "Marcus Thorne",
    role: "Founder, Skyline Coffee Co.",
    initial: "M",
  },
];

export function Reviews() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 6000);
    return () => clearInterval(t);
  }, []);

  const r = reviews[i];

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center">
          <div className="flex gap-1 text-yellow">
            {[...Array(5)].map((_, k) => (
              <Star key={k} className="size-4 fill-yellow" />
            ))}
          </div>

          <div className="relative mt-8 min-h-[260px] w-full">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="mx-auto max-w-[40ch] text-balance font-serif text-3xl italic leading-tight text-navy md:text-4xl lg:text-5xl">
                  "{r.quote}"
                </p>
                <footer className="mt-10 flex flex-col items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-navy font-serif text-lg text-cream">
                    {r.initial}
                  </div>
                  <cite className="not-italic">
                    <span className="block text-sm font-semibold text-navy">{r.name}</span>
                    <span className="mt-1 block text-[10px] font-semibold uppercase tracking-widest text-navy/50">
                      {r.role}
                    </span>
                  </cite>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <button
              onClick={() => setI((x) => (x - 1 + reviews.length) % reviews.length)}
              className="flex size-10 items-center justify-center rounded-full border border-navy/10 text-navy transition-colors hover:bg-navy hover:text-cream"
              aria-label="Previous review"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  className={`h-1.5 rounded-full transition-all ${
                    k === i ? "w-8 bg-navy" : "w-1.5 bg-navy/20"
                  }`}
                  aria-label={`Go to review ${k + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((x) => (x + 1) % reviews.length)}
              className="flex size-10 items-center justify-center rounded-full border border-navy/10 text-navy transition-colors hover:bg-navy hover:text-cream"
              aria-label="Next review"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
