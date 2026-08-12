import { Card } from "@/components/ui/card";
import { GraduationCap, Users, Award, Brain, Sparkles } from "lucide-react";

type Leader = {
  name: string;
  role: string;
  image?: string;
};

const PanelSection = () => {
  const visionaryLeaders: Leader[] = [
    {
      name: "Vineeth Jain",
      role: "MD of Times Group",
      image: "/Vineet jain.webp",
    },
  ];

  const leaders: Leader[] = [
    {
      name: "Sailaja Rani",
      role: "MD of Amenity Forge",
      image: "/Sailaja rani.jpg",
    },
    {
      name: "Dr. Sanjeev Kumar",
      role: "Strategic Advisor",
      image: "/Sanjeev kumar .jpg",
    },
    {
      name: "Dr. K Ganesh Reddy",
      role: "Strategic Advisor",
      image: "/Ganesh reddy.jpg",
    },
    {
      name: "Dr. Vinod Shastri",
      role: "Research Director",
      image: "/Vinod shastri.jpg",
    },
    {
      name: "Dr. Umesh Gupta",
      role: "Innovation Strategist",
      image: "/Umesh gupta.jpg",
    },
  ];

  const innovationCouncil = [
    {
      name: "Dr. Karnika Dwivedi",
      image: "/Council-1-Karnika Dwivedi.jpg",
      education: "Ph.D. in Artificial Intelligence,Researcher - 15 Publications",
    },
    {
      name: "Dr. Uphar Singh",
      image: "/Council-4-Dr. Uphar Singh.jpg",
      education: "Ph.D, M.Tech Data Science, Reasearcher - 7 Publications",
    },
    {
      name: "Dr. Sidharth Quamara",
      image: "/Council-2-Dr. Sidharth Quamara.jpg",
      education: "Ph.D. in Blockchain(NIT),MHRD fellowship",
    },
    {
      name: "Dr. Amit Soni",
      image: "/Council-3-Dr. Amit Soni.jpg",
      education: "Ph.D. in Artificial Intelligence(IIT),M.Tech,Researcher - 3 Publication",
    },
  ];

  const mentors = [
    {
      name: "Dr. Ankith Kumar Pandey",
      image: "/Mentor-1-Dr. Ankith Kumar Pandey.jpg",
      education: "World's Top 2% Scientists ~Stanford University",
    },
    {
      name: "Dr. Avinash Upadhyay",
      image: "/Mentor-2-Dr. Avinash Upadhyay.jpg",
      education: "Ph.D. in Bennet, M.S at (KU)",
    },
    {
      name: "Dr. Manoj Sharma",
      image: "/Mentor-3-Manoj Sharma.jpg",
      education: "Ph.D. in Computer Science (Professor)",
    },
    {
      name: "Dr. Vivek Kumar",
      image: "/Mentor-4-Vivek kUMAR.jpg",
      education: "Ph.D. in High Performance Computing (APJTU)",
    },
  ];

  const stats = [
    {
      icon: Users,
      number: "100+",
      label: "IITians",
      description: "From India's Premier Technology Institutes",
    },
    {
      icon: Award,
      number: "Top 2%",
      label: "Scientists",
      description: "Recognized by Stanford University",
    },
    {
      icon: Brain,
      number: "Global",
      label: "Think-Tank",
      description: "Shaping academic benchmarks worldwide",
    },
  ];

  const renderLeaderCard = (leader: Leader, index: number) => (
    <div
      key={`${leader.name}-${index}`}
      className="flex w-full max-w-[150px] flex-col items-center gap-3"
    >
      {leader.image ? (
        <div className="aspect-square w-full max-w-[150px] rounded-lg border-2 border-border/50 bg-background/50 overflow-hidden shadow-md">
          <img
            src={leader.image}
            alt={leader.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML =
                '<div class="flex h-full w-full items-center justify-center text-muted-foreground text-xs">Photo</div>';
            }}
          />
        </div>
      ) : (
        <div className="flex aspect-square w-full max-w-[150px] items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-background/50 text-xs uppercase tracking-wider text-muted-foreground">
          Photo
        </div>
      )}
      <div className="text-center space-y-2">
        <p className="text-sm font-semibold text-gold">{leader.name}</p>
        <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold uppercase tracking-wide">
          {leader.role}
        </span>
      </div>
    </div>
  );

  return (
    <section id="panel" className="py-24 gradient-premium">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-block px-6 py-2 rounded-full border border-gold/30 bg-gold/10">
              <span className="text-gold text-sm font-semibold tracking-wide">LEADERSHIP</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              The <span className="text-gradient-gold">Expert Panel</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A distinguished circle of visionaries and academic leaders guiding the future of global education
            </p>
          </div>

          {/* Visionary Leadership */}
          <Card className="p-8 md:p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur">
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles className="w-8 h-8 text-gold" />
                <h3 className="text-2xl font-serif font-semibold">Visionary Leadership</h3>
              </div>
              {visionaryLeaders.map((leader) => (
                <div
                  key={leader.name}
                  className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10"
                >
                  {leader.image ? (
                    <div className="h-44 w-44 shrink-0 overflow-hidden rounded-2xl border-2 border-border/50 bg-background/50 shadow-md sm:h-52 sm:w-52">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.parentElement!.innerHTML =
                            '<div class="flex h-full w-full items-center justify-center text-muted-foreground text-sm">Photo</div>';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-background/50 text-sm uppercase tracking-wider text-muted-foreground sm:h-52 sm:w-52">
                      Photo
                    </div>
                  )}
                  <div className="space-y-4 text-center sm:text-left">
                    <h4 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground">
                      {leader.name}
                    </h4>
                    <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm md:text-base font-semibold text-gold uppercase tracking-wide">
                      {leader.role}
                    </span>
                    <p className="text-lg md:text-xl text-muted-foreground italic max-w-xl">
                      Our inspiration in building GTAP with vision, purpose, and unwavering commitment to educational excellence.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Core Leaders */}
          <Card className="p-8 md:p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur">
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-6">
                <GraduationCap className="w-8 h-8 text-gold" />
                <h3 className="text-2xl font-serif font-semibold">Core Leadership Circle</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {leaders.map(renderLeaderCard)}
              </div>
            </div>
          </Card>

          {/* Innovation Council */}
          <Card className="p-8 md:p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur">
            <h3 className="text-2xl font-serif font-semibold mb-6">Innovation Council</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {innovationCouncil.map((member, index) => (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div className="aspect-square w-full max-w-[150px] rounded-lg border-2 border-border/50 bg-background/50 overflow-hidden shadow-md">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML =
                          '<div class="flex h-full w-full items-center justify-center text-muted-foreground text-xs">Photo</div>';
                      }}
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-gold">{member.name}</p>
                    {member.education && (
                      <p className="text-xs text-muted-foreground">{member.education}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mentors & Advisors */}
          <Card className="p-8 md:p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur">
            <h3 className="text-2xl font-serif font-semibold mb-6">Mentors & Advisors</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {mentors.map((member, index) => (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div className="aspect-square w-full max-w-[150px] rounded-lg border-2 border-border/50 bg-background/50 overflow-hidden shadow-md">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML =
                          '<div class="flex h-full w-full items-center justify-center text-muted-foreground text-xs">Photo</div>';
                      }}
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-gold">{member.name}</p>
                    {member.education && (
                      <p className="text-xs text-muted-foreground">{member.education}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trusted by India's Brightest Minds */}
          <Card className="p-12 md:p-16 shadow-premium border-border/50 bg-card/50 backdrop-blur">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gradient-gold animate-fade-in">
                Trusted by India's Brightest Minds
              </h3>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-8 text-center space-y-4 shadow-premium border-border/50 bg-card/50 backdrop-blur hover:shadow-glow transition-all duration-300 group"
              >
                <div className="w-20 h-20 mx-auto rounded-full gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-serif font-bold text-gradient-gold">{stat.number}</div>
                  <div className="text-xl font-semibold">{stat.label}</div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <Card className="p-12 shadow-premium border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur">
            <p className="text-lg text-center text-foreground/90 leading-relaxed">
              Our panel represents the convergence of academic excellence, research innovation, and
              practical industry expertise. Together, they establish and maintain the highest standards
              for institutional accreditation, ensuring that GTAP remains at the forefront of global
              educational excellence.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PanelSection;
