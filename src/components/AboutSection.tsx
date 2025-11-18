import { Card } from "@/components/ui/card";
import { BookOpen, Globe, Award } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Media & Education Excellence",
      description: "Built on a legacy of innovation in learning and communication"
    },
    {
      icon: Globe,
      title: "Global Movement",
      description: "Bridging innovation, credibility, and world-class academic standards"
    },
    {
      icon: Award,
      title: "Visionary Leadership",
      description: "Guided by academic leaders and supported by 35+ IITians and Top 2% Scientists"
    }
  ];

  return (
    <section id="about" className="py-24 gradient-premium">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block px-6 py-2 rounded-full border border-gold/30 bg-gold/10">
              <span className="text-gold text-sm font-semibold tracking-wide">ABOUT GTAP</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Empowering Global <span className="text-gradient-gold">Academic Excellence</span>
            </h2>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <Card className="p-8 md:p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90">
                GTAP (Global T.I.M.E.S Accreditation Panel) is built on a media and education excellence ecosystem 
                inspired by a <span className="font-semibold text-foreground">legacy</span> of innovation in learning and communication. 
                It represents a global movement that bridges innovation, credibility, and world-class academic standards.
              </p>
              <p className="text-base md:text-lg mt-4 text-foreground/70 italic">
                T.I.M.E.S stands for Training, Innovation, Mentorship, Education & Standards.
              </p>
            </Card>

            <Card className="p-8 md:p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90">
                GTAP is guided by a circle of visionaries and academic leaders including{" "}
                <span className="font-semibold text-foreground">Sanjeev Kumar, Shiva Balaji, Vinod Shastri, Umesh Gupta, and Rajesh </span>{" "}
                — supported by 35+ IITians and Top 2% Scientists in the world <span className="text-gold">(recognized by Stanford University)</span>. 
                Together, they form the core think-tank shaping global benchmarks in education, research, and institutional excellence.
              </p>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 pt-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-8 text-center space-y-4 shadow-premium border-border/50 bg-card/50 backdrop-blur hover:shadow-glow transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto rounded-full gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
