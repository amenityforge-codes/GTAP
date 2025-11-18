import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const JoinSection = () => {
  const benefits = [
    "Global recognition and credibility",
    "Access to international academic networks",
    "Continuous quality improvement frameworks",
    "Student and faculty development programs",
    "Research collaboration opportunities",
    "Best practices sharing platform"
  ];

  return (
    <section className="py-24 gradient-premium">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block px-6 py-2 rounded-full border border-gold/30 bg-gold/10">
              <span className="text-gold text-sm font-semibold tracking-wide">JOIN THE MOVEMENT</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Become Part of <span className="text-gradient-gold">GTAP</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join leading universities and educators committed to excellence, innovation, and global collaboration
            </p>
          </div>

          {/* Main Card */}
          <Card className="p-8 md:p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-semibold text-center">
                Benefits of GTAP Accreditation
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <div className="text-center space-y-6">
                <p className="text-lg text-muted-foreground">
                  Ready to elevate your institution's standards and join a global network of excellence?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="gradient-gold text-primary font-semibold px-8 hover:opacity-90 transition-opacity shadow-glow"
                  >
                    Apply for Accreditation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="border-border hover:bg-accent"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Call to Action for Educators */}
          <div className="text-center space-y-4 pt-8">
            <p className="text-muted-foreground">
              Are you an educator or researcher interested in contributing to GTAP's mission?
            </p>
            <Button 
              variant="link" 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-gold hover:text-gold-light"
            >
              Get in touch with our team
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
