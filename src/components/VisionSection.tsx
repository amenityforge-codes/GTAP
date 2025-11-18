import { Card } from "@/components/ui/card";
import { Target, Lightbulb, Users } from "lucide-react";

const VisionSection = () => {
  return (
    <section id="vision" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block px-6 py-2 rounded-full border border-gold/30 bg-gold/10">
              <span className="text-gold text-sm font-semibold tracking-wide">OUR PURPOSE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Vision & <span className="text-gradient-gold">Mission</span>
            </h2>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-6 shadow-premium border-border/50 bg-card/50 backdrop-blur halo-ring hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif font-semibold">Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To establish a globally recognized framework for academic accreditation that champions 
                  excellence, integrity, and innovation across educational institutions worldwide.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6 shadow-premium border-border/50 bg-card/50 backdrop-blur halo-ring hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif font-semibold">Innovation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Foster cutting-edge research, pedagogical advancement, and transformative learning 
                  experiences that prepare students for tomorrow's challenges.
                </p>
              </div>
            </Card>

            <Card className="p-8 space-y-6 shadow-premium border-border/50 bg-card/50 backdrop-blur halo-ring hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-serif font-semibold">Collaboration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Build a global network of educators, researchers, and institutions committed to 
                  shared standards of excellence and continuous improvement.
                </p>
              </div>
            </Card>
          </div>

          {/* Mission Statement */}
          <Card className="p-12 shadow-premium border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur">
            <div className="space-y-6 text-center">
              <h3 className="text-3xl font-serif font-bold">Our Mission</h3>
              <p className="text-xl text-foreground/90 leading-relaxed max-w-4xl mx-auto">
                To promote <span className="font-semibold text-gradient-gold">academic integrity</span>, 
                drive <span className="font-semibold text-gradient-gold">innovation in education</span>, and 
                facilitate <span className="font-semibold text-gradient-gold">global collaboration</span> among 
                institutions committed to excellence. We aim to set the gold standard for accreditation 
                that recognizes and celebrates outstanding educational achievements worldwide.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
