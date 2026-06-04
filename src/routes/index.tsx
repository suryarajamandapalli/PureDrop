import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";
import { Hero } from "@/components/sections/Hero";
import { Updates } from "@/components/sections/Updates";
import { About } from "@/components/sections/About";
import { Collaborations } from "@/components/sections/Collaborations";
import { Reviews } from "@/components/sections/Reviews";
import { ContactInfo } from "@/components/sections/ContactInfo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pure Drop Dairy Farms | Fresh Organic Milk Delivered" },
      { name: "description", content: "Pure Drop Dairy Farms delivers fresh, certified organic milk straight from our pastures to your home. Precision farming, carbon-neutral, uncompromised purity. Order your daily delivery today." },
      { property: "og:title", content: "Pure Drop Dairy Farms | Fresh Organic Milk Delivered" },
      { property: "og:description", content: "Pure Drop Dairy Farms delivers fresh, certified organic milk straight from our pastures to your home. Precision farming, carbon-neutral, uncompromised purity. Order your daily delivery today." },
      { property: "og:url", content: "https://puredrop-web.vercel.app/" },
      { property: "og:image", content: "https://puredrop-web.vercel.app/og-image.jpg" },
      { property: "og:image:alt", content: "Pure Drop Dairy Farms — Fresh organic milk delivered from farm to home. Order your daily delivery today." },
      { name: "twitter:title", content: "Pure Drop Dairy Farms | Fresh Organic Milk Delivered" },
      { name: "twitter:description", content: "Pure Drop Dairy Farms delivers fresh, certified organic milk straight from our pastures to your home. Order your daily delivery today." },
      { name: "twitter:image", content: "https://puredrop-web.vercel.app/og-image.jpg" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteShell>
      <Hero />
      <Collaborations />
      <Updates />
      <About />
      <Reviews />
      <ContactInfo />
    </SiteShell>
  );
}
