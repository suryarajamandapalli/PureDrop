import { Phone, Mail, MapPin, Instagram, MessageCircle } from "lucide-react";

const items = [
  { icon: Phone, label: "Inquiries", lines: ["+1 (555) 0123 4567"] },
  { icon: MessageCircle, label: "WhatsApp", lines: ["+1 (555) 0123 4567"] },
  { icon: Mail, label: "Email", lines: ["hq@puredropfarms.com"] },
  { icon: Instagram, label: "Instagram", lines: ["@puredropfarms"] },
  { icon: MapPin, label: "Address", lines: ["1200 Pasture Lane", "Green Valley, CA 90210"] },
];

export function ContactInfo() {
  return (
    <section id="contact" className="bg-muted/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">
              Get in touch
            </span>
            <h2 className="mt-6 font-serif text-4xl font-medium leading-tight text-navy md:text-5xl">
              Connect with <span className="italic">the farm.</span>
            </h2>
            <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
              Whether you're a household, hotel, or retailer — we'd love to set up your daily delivery.
            </p>

            <ul className="mt-12 space-y-7">
              {items.map((it) => {
                const Icon = it.icon;
                return (
                  <li key={it.label} className="flex items-start gap-5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-cream">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-navy/50">
                        {it.label}
                      </h4>
                      {it.lines.map((l) => (
                        <p key={l} className="mt-1 text-sm font-medium text-navy">
                          {l}
                        </p>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="h-[480px] w-full overflow-hidden rounded-xl bg-white shadow-elevated lg:h-auto">
            <iframe
              title="Pure Drop Farm location"
              className="h-full min-h-[420px] w-full grayscale"
              src="https://maps.google.com/maps?q=Green%20Valley%20CA&t=&z=11&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
