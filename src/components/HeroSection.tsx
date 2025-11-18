import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Global Network" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/90 via-navy-deep/70 to-background"></div>
      </div>

      {/* Animated Circles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border-2 border-gold/20 animate-glow-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full border border-gold/10 animate-rotate-slow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-block px-6 py-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-sm">
            <span className="text-gold text-sm font-semibold tracking-wide">Global T.I.M.E.S Accreditation Panel</span>
          
          </div>
          
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground leading-tight">
            Accrediting Excellence.
            <br />
            <span className="text-gradient-gold">Inspiring Innovation.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-platinum/80 max-w-2xl mx-auto font-light">
            A global movement bridging innovation, credibility, and world-class academic standards.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg"
              onClick={scrollToAbout}
              className="gradient-gold text-primary font-semibold px-8 py-6 text-lg hover:opacity-90 transition-opacity shadow-glow"
            >
              Explore GTAP
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="bg-platinum/10 px-8 py-6 text-lg"
            >
              Join the Movement
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;
