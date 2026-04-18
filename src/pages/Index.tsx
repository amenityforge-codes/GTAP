import { SeoHead } from "@/components/SeoHead";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VisionSection from "@/components/VisionSection";
import PanelSection from "@/components/PanelSection";
import ImpactSection from "@/components/ImpactSection";
import ResourcesSection from "@/components/ResourcesSection";
import JoinSection from "@/components/JoinSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    const targetId = state?.scrollTo || (location.hash ? location.hash.replace("#", "") : undefined);

    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <SeoHead
        title="Global T.I.M.E.S Accreditation Panel (GTAP) | Education & School Accreditation"
        description="Global T.I.M.E.S Accreditation Panel (GTAP): education accreditation for schools and colleges, India rankings, certificate verification, and international curriculum — not economics or trade models."
        path="/"
      />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <VisionSection />
        <PanelSection />
        <ImpactSection />
        <ResourcesSection />
        <JoinSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
