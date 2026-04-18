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
        title="GTAP | Global T.I.M.E.S Accreditation Panel — Official Site"
        description="GTAP — the Global T.I.M.E.S Accreditation Panel. Official GTAP site for accreditation, school and college rankings, certificate verification, and international curriculum. India rankings, CBSE ICSE IB IGCSE, STEM and AI standards."
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
