import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Instagram, MessageCircle, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy py-20 text-cream/80">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-1">
            <span className="font-serif text-2xl font-medium text-cream">Pure Drop</span>
            <p className="max-w-[30ch] text-xs leading-relaxed">
              Precision agriculture for the next generation of nutrition. Certified Organic. Carbon Neutral.
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex size-9 items-center justify-center rounded-full bg-cream/5 transition-colors hover:bg-yellow hover:text-navy">
                <Instagram className="size-4" />
              </a>
              <a href="https://wa.me/919123456789?text=Hi%20Pure%20Drop" target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-full bg-cream/5 transition-colors hover:bg-yellow hover:text-navy">
                <MessageCircle className="size-4" />
              </a>
              <a href="tel:+919123456789" className="flex size-9 items-center justify-center rounded-full bg-cream/5 transition-colors hover:bg-yellow hover:text-navy">
                <Phone className="size-4" />
              </a>
              <a href="mailto:hq@puredropfarms.com" className="flex size-9 items-center justify-center rounded-full bg-cream/5 transition-colors hover:bg-yellow hover:text-navy">
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-cream">Quick Links</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-yellow">Home</Link></li>
              <li><Link to="/portfolio" className="hover:text-yellow">Portfolio</Link></li>
              <li><Link to="/contact" className="hover:text-yellow">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-cream">Location</h5>
            <ul className="space-y-2 text-xs leading-relaxed">
              <li>1200 Pasture Lane</li>
              <li>Green Valley, CA 90210</li>
              <li className="pt-2 text-cream/60">+91 91234 56789</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-cream">System Access</h5>
            <Link to="/admin" className="group flex items-center justify-between border border-cream/10 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-cream/5">
              Admin Login
              <ArrowUpRight className="size-4 text-yellow transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link to="/agent" className="group flex items-center justify-between border border-cream/10 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-cream/5">
              Delivery Agent Login
              <ArrowUpRight className="size-4 text-yellow transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-cream/5 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[10px] font-medium tracking-widest opacity-40">
            © {new Date().getFullYear()} PURE DROP DAIRY FARMS INC. ALL RIGHTS RESERVED.
          </p>
          <p className="text-[10px] font-medium tracking-widest opacity-40">
            ENTERPRISE OS · v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
