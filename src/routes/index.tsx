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
      { title: "Pure Drop Dairy Farms — Fresh Milk. Pure Quality." },
      { name: "description", content: "Enterprise dairy farm delivering fresh, pure milk from farm to home. Precision farming, ethical practices, premium quality." },
      { property: "og:title", content: "Pure Drop Dairy Farms — Fresh Milk. Pure Quality." },
      { property: "og:description", content: "Fresh Milk Direct From Farm To Home." },
      { property: "og:url", content: "https://puredrop.vercel.app/" },
      { property: "og:image", content: "https://puredrop.vercel.app/og-image.jpg" },
      { name: "twitter:title", content: "Pure Drop Dairy Farms — Fresh Milk. Pure Quality." },
      { name: "twitter:description", content: "Enterprise dairy farm delivering fresh, pure milk from farm to home." },
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
