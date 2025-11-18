import { Card } from "@/components/ui/card";
import { Globe, GraduationCap, Users, Award } from "lucide-react";

const ImpactSection = () => {
  const stats = [
    {
      icon: GraduationCap,
      title: "Trusted by Educators",
      description: "Supported by faculty mentors and school partners"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Interest and trials from schools across borders"
    },
    {
      icon: Users,
      title: "Student Impact",
      description: "Improving outcomes in classroom pilots"
    },
    {
      icon: Award,
      title: "Proven Results",
      description: "Case studies available on request"
    }
  ];

  return (
    <section id="impact" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block px-6 py-2 rounded-full border border-gold/30 bg-gold/10">
              <span className="text-gold text-sm font-semibold tracking-wide">GLOBAL REACH</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Our Global <span className="text-gradient-gold">Impact</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforming educational institutions and empowering students across continents
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="p-8 text-center space-y-4 shadow-premium border-border/50 bg-card/50 backdrop-blur hover:shadow-glow transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto rounded-full gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="text-2xl font-serif font-bold text-gradient-gold">{stat.title}</div>
                  <p className="text-base text-muted-foreground">{stat.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Map Placeholder with Description */}
          <Card className="p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-navy-medium/20"></div>
            </div>
            <div className="relative space-y-8">
              <div className="text-center space-y-4">
                <Globe className="w-16 h-16 mx-auto text-gold animate-rotate-slow" />
                <h3 className="text-3xl font-serif font-bold">Spanning Continents</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  From Asia to Europe, Americas to Africa, GTAP's accreditation standards are 
                  recognized and respected by leading educational institutions worldwide.
                </p>
              </div>

              {/* Key Regions */}
              <div className="grid md:grid-cols-3 gap-6 pt-8">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-serif font-bold text-gold">Asia-Pacific</div>
                  <p className="text-sm text-muted-foreground">Primary innovation hub</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-serif font-bold text-gold">Europe & Americas</div>
                  <p className="text-sm text-muted-foreground">Expanding partnerships</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-2xl font-serif font-bold text-gold">Middle East & Africa</div>
                  <p className="text-sm text-muted-foreground">Emerging markets</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Impact Statement */}
          <Card className="p-12 shadow-premium border-border/50 bg-gradient-to-br from-navy-deep/5 to-gold/5 backdrop-blur">
            <blockquote className="text-center space-y-6">
              <p className="text-2xl font-serif italic text-foreground/90 leading-relaxed">
                "GTAP's accreditation has become synonymous with excellence, integrity, and innovation 
                in global education."
              </p>
              <footer className="text-muted-foreground">
                — Recognized by leading academic institutions worldwide
              </footer>
            </blockquote>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
