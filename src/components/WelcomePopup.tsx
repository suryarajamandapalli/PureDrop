import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

export function WelcomePopup({ open, onClose }: WelcomePopupProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-cream shadow-elevated"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-navy/5 text-navy transition-colors hover:bg-navy/10"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <div className="bg-navy px-8 pt-10 pb-12 text-center">
              <motion.span
                className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/70"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Welcome
              </motion.span>
              <motion.h2
                className="mt-4 font-serif text-3xl leading-tight text-cream md:text-4xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Welcome to Pure Drop <span className="text-cream">Dairy Farms</span>
              </motion.h2>
              <motion.p
                className="mt-3 text-pretty text-sm leading-relaxed text-cream/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Fresh Milk Direct From Farm To Home
              </motion.p>
            </div>

            <div className="flex flex-col gap-3 p-6">
              <button
                onClick={onClose}
                className="h-11 rounded-full bg-yellow px-6 text-sm font-semibold text-navy transition-colors hover:bg-yellow/90"
              >
                Explore Website
              </button>
              <Link
                to="/contact"
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-full border border-navy/15 px-6 text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
