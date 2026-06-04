import { motion } from "motion/react";
import u1 from "@/assets/update-1.jpg";
import u2 from "@/assets/update-2.jpg";
import u3 from "@/assets/update-3.jpg";

const updates = [
  {
    img: u1,
    date: "Oct 12, 2025",
    tag: "Technology",
    title: "Next-gen filtration systems deployed across Phase 4 facility",
  },
  {
    img: u2,
    date: "Sep 28, 2025",
    tag: "Sustainability",
    title: "Carbon-neutral roadmap: reaching 2026 goals ahead of schedule",
  },
  {
    img: u3,
    date: "Sep 02, 2025",
    tag: "Product",
    title: "Limited-edition heritage glass milk bottle collection launches",
  },
];

export function Updates() {
  return (
    <section id="updates" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <span className="inline-block h-px w-12 bg-yellow" />
              <h2 className="mt-6 font-serif text-4xl font-medium leading-tight text-navy md:text-5xl">
                Intelligence <span className="italic">&amp; Updates</span>
              </h2>
              <p className="mt-4 max-w-[32ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                Reporting on our latest technological integrations, seasonal yields, and farm milestones.
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-12 sm:grid-cols-2">
              {updates.map((u, i) => (
                <motion.article
                  key={u.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square w-full overflow-hidden bg-muted">
                    <img
                      src={u.img}
                      alt={u.title}
                      loading="lazy"
                      width={800}
                      height={800}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-navy/40">
                    <span>{u.date}</span>
                    <span className="text-navy/30">•</span>
                    <span>{u.tag}</span>
                  </div>
                  <h3 className="mt-3 text-balance text-lg font-medium leading-snug text-navy transition-colors group-hover:text-navy/70">
                    {u.title}
                  </h3>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
