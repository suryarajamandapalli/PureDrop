const partners = [
  "Grand Hyatt",
  "Whole Foods",
  "Blue Bottle",
  "Ritz Carlton",
  "Compass Group",
  "Marriott",
  "Four Seasons",
];

export function Collaborations() {
  return (
    <section className="border-y border-navy/5 bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-navy/40">
          Trusted by Enterprise Partners · Hotels · Restaurants · Retailers
        </p>
        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee gap-16">
            {[...partners, ...partners].map((p, i) => (
              <span
                key={i}
                className="shrink-0 font-serif text-2xl text-navy/30 transition-colors hover:text-navy"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
