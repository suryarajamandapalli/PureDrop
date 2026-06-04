import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { SiteShell } from "@/components/SiteShell";
import { ContactInfo } from "@/components/sections/ContactInfo";

import { submitContactForm } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Pure Drop Dairy Farms" },
      { name: "description", content: "Get in touch with Pure Drop Dairy Farms. Order fresh milk, partner with us, or visit the farm." },
      { property: "og:title", content: "Contact Pure Drop Dairy Farms" },
      { property: "og:description", content: "Talk to us about deliveries, partnerships, and farm visits." },
      { property: "og:url", content: "https://puredrop-web.vercel.app/contact" },
      { property: "og:image", content: "https://puredrop-web.vercel.app/og-image.jpg" },
      { property: "og:image:alt", content: "Contact Pure Drop Dairy Farms" },
      { name: "twitter:title", content: "Contact — Pure Drop Dairy Farms" },
      { name: "twitter:description", content: "Get in touch with Pure Drop Dairy Farms." },
      { name: "twitter:image", content: "https://puredrop-web.vercel.app/og-image.jpg" },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      message: String(fd.get("message") || ""),
    };
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }
    setErrors({});
    
    try {
      const res = await submitContactForm({ data });
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrors({ submit: res.error || "Submission failed. Please try again." });
      }
    } catch (err) {
      setErrors({ submit: "A network error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">Contact</span>
            <h1 className="mt-4 max-w-[18ch] text-balance font-serif text-5xl leading-[0.95] text-navy md:text-7xl">
              Let's start your <span className="italic">daily delivery.</span>
            </h1>
            <p className="mt-6 max-w-[55ch] text-pretty text-lg text-muted-foreground">
              Drop us a message, WhatsApp us, or stop by the farm. We'll respond within one business day.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-navy/10 bg-white p-8 shadow-elevated"
          >
            {submitted ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="size-16 text-yellow" />
                <h3 className="mt-4 font-serif text-3xl text-navy">Message received</h3>
                <p className="mt-2 max-w-[30ch] text-sm text-muted-foreground">
                  Thank you. Our team will reach out within one business day.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl text-navy">Send a message</h3>
                <div className="mt-6 grid gap-4">
                  <Field label="Full name" name="name" error={errors.name} />
                  <Field label="Email" name="email" type="email" error={errors.email} />
                  <Field label="Phone (optional)" name="phone" type="tel" error={errors.phone} />
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      className="mt-2 w-full rounded-lg border border-navy/15 bg-cream px-4 py-3 text-sm text-navy outline-none transition-colors focus:border-navy"
                    />
                    {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-navy text-sm font-semibold text-cream transition-all hover:bg-navy/90 disabled:opacity-50 inline-flex items-center justify-center"
                    >
                      {loading ? "Sending..." : "Send"} <Send className="size-4 animate-pulse" />
                    </button>
                    <a
                      href="https://wa.me/919123456789?text=Hi%20Pure%20Drop"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-navy/15 text-sm font-semibold text-navy transition-colors hover:bg-navy/5"
                    >
                      <MessageCircle className="size-4" /> WhatsApp
                    </a>
                  </div>
                  {errors.submit && <p className="mt-2 text-xs text-destructive text-center font-medium">{errors.submit}</p>}
                </div>
              </>
            )}
          </motion.form>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl bg-navy p-8 text-cream shadow-elevated">
              <h3 className="font-serif text-2xl">Visit the farm</h3>
              <p className="mt-2 text-sm text-cream/70">Open Mon–Sat · 7:00 AM – 6:00 PM</p>
              <div className="mt-6 space-y-3 text-sm">
                <p><span className="font-mono text-[10px] uppercase tracking-widest text-cream/70">Phone </span> +1 (555) 0123 4567</p>
                <p><span className="font-mono text-[10px] uppercase tracking-widest text-cream/70">Email </span> hq@puredropfarms.com</p>
                <p><span className="font-mono text-[10px] uppercase tracking-widest text-cream/70">Address </span> 1200 Pasture Lane, Green Valley, CA 90210</p>
              </div>
            </div>

            <div className="aspect-video overflow-hidden rounded-2xl bg-muted shadow-elevated">
              <iframe
                title="Farm map"
                src="https://maps.google.com/maps?q=Green%20Valley%20CA&t=&z=11&ie=UTF8&iwloc=&output=embed"
                className="h-full w-full grayscale"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <ContactInfo />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/15550123456"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp us"
        className="fixed bottom-6 right-6 z-30 flex size-14 items-center justify-center rounded-full bg-yellow text-navy shadow-elevated transition-transform hover:scale-110"
      >
        <MessageCircle className="size-6" />
      </a>
    </SiteShell>
  );
}

function Field({ label, name, type = "text", error }: { label: string; name: string; type?: string; error?: string }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-widest text-navy/50">{label}</label>
      <input
        type={type}
        name={name}
        className="mt-2 h-11 w-full rounded-lg border border-navy/15 bg-cream px-4 text-sm text-navy outline-none transition-colors focus:border-navy"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
