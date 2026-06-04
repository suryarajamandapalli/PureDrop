import { motion } from "motion/react";
import works from "@/assets/works-montage.jpg";

export function About() {
  return (
    <section id="about" className="bg-navy py-24 text-cream lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-cream/70">
              The Heritage
            </span>
            <h2 className="mt-8 text-balance font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
              Purity isn't a marketing term — it's our core <span className="italic text-cream">infrastructure.</span>
            </h2>
            <p className="mt-8 max-w-[44ch] text-pretty text-lg leading-relaxed text-cream/70">
              Founded with a single vision: to bridge the gap between industrial efficiency and artisanal quality. Every drop is tracked from pasture to bottle.
            </p>
          </motion.div>

          <div className="lg:col-span-7">
            <div className="grid gap-12 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="border-t border-cream/10 pt-8"
              >
                <h4 className="text-sm font-semibold text-cream">Our Vision</h4>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-cream/70">
                  To define the global benchmark for high-integrity dairy production using autonomous systems and ethical farming.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="border-t border-cream/10 pt-8"
              >
                <h4 className="text-sm font-semibold text-cream">Our Mission</h4>
                <p className="mt-4 text-pretty text-sm leading-relaxed text-cream/70">
                  Providing farm-to-door transparency that empowers families to trust their daily nutrition without compromise.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-16 overflow-hidden rounded-xl"
            >
              <img
                src={works}
                alt="Pure Drop heritage farm architecture at golden hour"
                loading="lazy"
                width={1600}
                height={700}
                className="aspect-[21/9] w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
