import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1400;
    const tick = (t: number) => {
      const p = Math.min(100, ((t - start) / duration) * 100);
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else {
        setDone(true);
        setTimeout(onComplete, 400);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy"
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Morphing Milk Drop SVG */}
          <div className="relative h-44 w-44 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="size-32 overflow-visible drop-shadow-[0_0_25px_rgba(250,250,250,0.2)]">
              {/* Ripple Wave (triggers exactly at impact) */}
              <motion.ellipse
                cx={50}
                cy={80}
                stroke="#FAFAFA"
                strokeWidth="1.5"
                fill="none"
                animate={{
                  rx: [0, 0, 32, 42],
                  ry: [0, 0, 8, 11],
                  opacity: [0, 0, 0.7, 0]
                }}
                transition={{
                  duration: 1.4,
                  times: [0, 0.5, 0.58, 0.85],
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />

              {/* Micro Splat Droplets shooting out */}
              {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const targetX = Math.cos(angle) * 35;
                const targetY = Math.sin(angle) * 10 - 15; // arc upward slightly

                return (
                  <motion.circle
                    key={i}
                    cx={50}
                    cy={80}
                    r={2}
                    fill="#FAFAFA"
                    animate={{
                      cx: [50, 50, 50 + targetX, 50 + targetX],
                      cy: [80, 80, 80 + targetY, 80 + targetY],
                      opacity: [0, 0, 1, 0],
                      r: [2, 2, 2.5, 0.5]
                    }}
                    transition={{
                      duration: 1.4,
                      times: [0, 0.5, 0.52, 0.75],
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                );
              })}

              {/* The Liquid Morphing Drop */}
              <motion.path
                fill="#FAFAFA"
                animate={{
                  d: [
                    // Circle at top (0s to 0.2s)
                    "M50,10 C55.5,10 60,14.5 60,20 C60,25.5 55.5,30 50,30 C44.5,30 40,25.5 40,20 C40,14.5 44.5,10 50,10 Z",
                    // Circle at top (start falling)
                    "M50,10 C55.5,10 60,14.5 60,20 C60,25.5 55.5,30 50,30 C44.5,30 40,25.5 40,20 C40,14.5 44.5,10 50,10 Z",
                    // Stretched teardrop in flight (0.45s)
                    "M50,25 C50,25 60,45 60,55 C60,60.5 55.5,65 50,65 C44.5,65 40,60.5 40,55 C40,45 50,25 50,25 Z",
                    // Splat at bottom (0.52s)
                    "M50,76 C63.8,76 75,77.8 75,80 C75,82.2 63.8,84 50,84 C36.2,84 25,82.2 25,80 C25,77.8 36.2,76 50,76 Z",
                    // Splat fading (0.6s)
                    "M50,76 C63.8,76 75,77.8 75,80 C75,82.2 63.8,84 50,84 C36.2,84 25,82.2 25,80 C25,77.8 36.2,76 50,76 Z",
                    // Back to Circle at top (resetting, invisible)
                    "M50,10 C55.5,10 60,14.5 60,20 C60,25.5 55.5,30 50,30 C44.5,30 40,25.5 40,20 C40,14.5 44.5,10 50,10 Z"
                  ],
                  opacity: [0, 1, 1, 1, 0, 0]
                }}
                transition={{
                  duration: 1.4,
                  times: [0, 0.2, 0.45, 0.52, 0.6, 1],
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </svg>
          </div>

          {/* Logo Reveal */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-4xl text-cream tracking-tight">
              Pure Drop <span className="text-cream">Dairy Farms</span>
            </h1>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/50">
              Fresh Milk · Pure Quality
            </p>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
