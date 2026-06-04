import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-navy/5 bg-cream/85 backdrop-blur-md shadow-sm"
          : "bg-gradient-to-b from-navy/50 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className={`font-serif text-2xl font-medium tracking-tight transition-colors duration-300 ${scrolled ? "text-navy" : "text-cream"}`}>
            Pure Drop
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative text-sm font-medium transition-colors duration-300 ${
                  active 
                    ? (scrolled ? "text-navy" : "text-cream") 
                    : (scrolled ? "text-navy/60 hover:text-navy" : "text-cream/70 hover:text-cream")
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${scrolled ? "bg-navy" : "bg-cream"}`}
                  />
                )}
              </Link>
            );
          })}
          <Link
            to="/contact"
            className={`h-9 rounded-full px-5 text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-95 inline-flex items-center ${
              scrolled ? "bg-navy text-cream" : "bg-cream text-navy hover:bg-cream/90"
            }`}
          >
            Order Milk
          </Link>
        </div>

        <button
          className={`flex size-10 items-center justify-center rounded-full transition-colors duration-300 md:hidden ${
            scrolled ? "bg-navy/5 text-navy" : "bg-cream/10 text-cream"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-navy/5 bg-cream md:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-navy hover:bg-navy/5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex h-11 items-center justify-center rounded-full bg-navy text-sm font-semibold text-cream"
            >
              Order Milk
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
