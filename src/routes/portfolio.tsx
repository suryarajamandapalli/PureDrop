import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, PlayCircle, Building2, X, Coffee, Hotel, ShoppingBag, Briefcase, Trees, Building, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import u1 from "@/assets/update-1.jpg";
import u2 from "@/assets/update-2.jpg";
import u3 from "@/assets/update-3.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Pure Drop Dairy Farms" },
      { name: "description", content: "Gallery, films, collaborations, achievements and certifications from Pure Drop Dairy Farms." },
      { property: "og:title", content: "Portfolio — Pure Drop Dairy Farms" },
      { property: "og:description", content: "A visual journey through our farm, partners, and certifications." },
      { property: "og:url", content: "https://puredrop.vercel.app/portfolio" },
      { property: "og:image", content: "https://puredrop.vercel.app/og-image.jpg" },
      { name: "twitter:title", content: "Portfolio — Pure Drop Dairy Farms" },
      { name: "twitter:description", content: "Gallery, films, collaborations, achievements and certifications from Pure Drop Dairy Farms." },
    ],
  }),
  component: PortfolioPage,
});

const gallery = [g1, g2, g3, g4, u1, u2, u3, g1];
const collaborations = [
  { name: "Grand Hyatt", icon: Hotel },
  { name: "Whole Foods", icon: ShoppingBag },
  { name: "Blue Bottle", icon: Coffee },
  { name: "Ritz Carlton", icon: Award },
  { name: "Compass Group", icon: Briefcase },
  { name: "Four Seasons", icon: Trees },
  { name: "Marriott", icon: Building },
  { name: "Hilton Hotels", icon: Sparkles },
];
const achievements = [
  { year: "2025", title: "Best Sustainable Dairy — National Agri Awards" },
  { year: "2024", title: "Carbon Neutral Certification renewed" },
  { year: "2023", title: "500,000 home deliveries milestone" },
  { year: "2022", title: "Enterprise Quality Excellence Award" },
];
const certificates = ["ISO 22000:2018", "FSSAI Certified", "USDA Organic", "Rainforest Alliance", "B-Corp Certified"];

const videoIds = ["ScMzIvxBSi4", "ScMzIvxBSi4", "ScMzIvxBSi4"]; // high-quality placeholder farm loops

function PortfolioPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <SiteShell>
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">Portfolio</span>
            <h1 className="mt-4 max-w-[18ch] text-balance font-serif text-5xl leading-[0.95] text-navy md:text-7xl">
              A visual <span className="italic">archive</span> of our work.
            </h1>
            <p className="mt-6 max-w-[55ch] text-pretty text-lg text-muted-foreground">
              From sunrise milking to enterprise partnerships — the moments, milestones and credentials that define Pure Drop.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle eyebrow="Gallery" title="Moments from the farm" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {gallery.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
                className={`overflow-hidden rounded-lg ${i % 5 === 0 ? "md:row-span-2 md:aspect-[1/2]" : "aspect-square"}`}
              >
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="bg-navy py-24 text-cream">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle eyebrow="Films" title="Watch the farm in motion" dark />
          <div className="grid gap-6 md:grid-cols-3">
            {[g1, g3, g4].map((src, i) => (
              <div
                key={i}
                onClick={() => setActiveVideo(videoIds[i])}
                className="group relative aspect-video overflow-hidden rounded-xl cursor-pointer"
              >
                <img src={src} alt="Video" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all group-hover:scale-105 group-hover:opacity-85" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                  <PlayCircle className="size-14 text-yellow drop-shadow-lg transition-transform group-hover:scale-110" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveVideo(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="Cinematic Dairy Farm Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collaborations */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle eyebrow="Collaborations" title="Partners we serve" />
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-navy/10 sm:grid-cols-3 lg:grid-cols-4">
            {collaborations.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.name} className="flex h-32 items-center justify-center bg-cream px-4 transition-all hover:bg-white">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Icon className="size-6 text-yellow" />
                    <span className="font-serif text-lg text-navy font-semibold">{c.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-muted/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle eyebrow="Achievements" title="Milestones along the way" />
          <ol className="relative border-l-2 border-yellow/30 pl-8">
            {achievements.map((a, i) => (
              <motion.li
                key={a.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative mb-10 last:mb-0"
              >
                <span className="absolute -left-[42px] flex size-5 items-center justify-center rounded-full border-2 border-navy/30 bg-cream" />
                <span className="font-mono text-xs font-bold text-navy/70">{a.year}</span>
                <h4 className="mt-1 font-serif text-2xl text-navy">{a.title}</h4>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle eyebrow="Certifications" title="Verified by global standards" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((c) => (
              <div key={c} className="flex items-center gap-4 rounded-xl border border-navy/10 bg-white p-6 transition-shadow hover:shadow-elevated">
                <Award className="size-8 shrink-0 text-navy/80" />
                <div>
                  <h4 className="font-serif text-lg text-navy">{c}</h4>
                  <p className="text-xs text-muted-foreground">Active certification</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function SectionTitle({ eyebrow, title, dark }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div className="mb-12">
      <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-cream/70" : "text-navy/60"}`}>{eyebrow}</span>
      <h2 className={`mt-4 font-serif text-4xl font-medium md:text-5xl ${dark ? "text-cream" : "text-navy"}`}>{title}</h2>
    </div>
  );
}
