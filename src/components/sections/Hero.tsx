import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";

// YouTube background video ID (admin-editable later via Website Editor).
// Replace VIDEO_ID with a real cinematic dairy farm video.
const YT_VIDEO_ID = "X6-zHaxMpjs"; // new cinematic dairy farm loop

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section ref={ref} className="relative h-[100vh] w-full overflow-hidden bg-navy">
      {/* Video / image layer */}
      <motion.div
        style={{ scale, y }}
        className="absolute inset-0 h-full w-full"
      >
        {/* YouTube iframe — all controls, branding, and UI suppressed */}
        {mounted && (
          <div className="pointer-events-none absolute inset-0">
            <iframe
              className="absolute left-1/2 top-1/2 h-[140vh] w-[250vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70"
              src={`https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1&mute=1&loop=1&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&playlist=${YT_VIDEO_ID}&enablejsapi=0&color=white&origin=${encodeURIComponent("https://puredrop-web.vercel.app")}`}
              title="Pure Drop Farm"
              allow="autoplay; encrypted-media"
              loading="lazy"
              style={{ border: 0 }}
            />
            {/* Transparent overlay — blocks any YouTube UI clicks / hover states */}
            <div className="absolute inset-0 z-10" />
          </div>
        )}
        {/* Fallback image */}
        <img
          src={heroFarm}
          alt="Aerial view of Pure Drop dairy farm at sunrise"
          className="absolute inset-0 h-full w-full object-cover -z-10"
          width={1920}
          height={1080}
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/70 via-transparent to-transparent" />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute size-1 rounded-full bg-yellow/40"
          style={{ left: `${(i * 8.3) % 100}%`, top: `${(i * 17) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative flex h-full items-end pb-24"
      >
        <div className="mx-auto w-full max-w-7xl px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/70"
          >
            Enterprise Dairy · Est. Today
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-[14ch] text-balance font-serif text-5xl leading-[0.95] text-cream md:text-7xl lg:text-8xl"
          >
            Pure Drop <span className="italic text-cream">Dairy Farms</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-6 max-w-[50ch] text-pretty text-lg leading-relaxed text-cream/80 md:text-xl"
          >
            Fresh Milk. Pure Quality. Advancing the standards of agricultural excellence through precision farming and uncompromised purity — straight from our pastures to your home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <a
              href="/contact"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-yellow px-6 text-sm font-semibold text-navy transition-all hover:bg-cream"
            >
              Order Milk
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/contact"
              className="inline-flex h-12 items-center rounded-full border border-cream/20 bg-cream/5 px-6 text-sm font-semibold text-cream backdrop-blur-sm transition-colors hover:bg-cream/15"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-12 w-px bg-gradient-to-b from-yellow to-transparent" />
      </motion.div>
    </section>
  );
}
