import { useEffect, useState, type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Preloader } from "./Preloader";
import { WelcomePopup } from "./WelcomePopup";

export function SiteShell({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  // Force preloader to execute on every fresh page load/mount
  useEffect(() => {
    setLoaded(false);
  }, []);

  const handlePreloadDone = () => {
    setLoaded(true);
    // Show welcome popup only the very first session visit
    if (typeof window !== "undefined") {
      const popupSeen = sessionStorage.getItem("pd_welcomed");
      if (!popupSeen) {
        setTimeout(() => setWelcomeOpen(true), 400);
        sessionStorage.setItem("pd_welcomed", "1");
      }
    }
  };

  return (
    <>
      {!loaded && <Preloader onComplete={handlePreloadDone} />}
      <WelcomePopup open={welcomeOpen} onClose={() => setWelcomeOpen(false)} />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
