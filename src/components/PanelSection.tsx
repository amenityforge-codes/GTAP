import { Card } from "@/components/ui/card";
import { GraduationCap, Users, Award, Brain } from "lucide-react";

const PanelSection = () => {
  const formatEducation = (education: string) => {
    const lines = education.split('\n');
    return lines.map((line, index) => {
      // Check if line is a degree (contains parentheses with years or degree abbreviations)
      // Handle year ranges with spaces like "2015 - 2021" or "Jan 2017 - Jul 2021"
      const hasYears = /\(\d{4}(\s*-\s*\d{4})?\)/.test(line) || /\(\w+\s+\d{4}\s*-\s*\w+\s+\d{4}\)/.test(line);
      const isDegreeAbbrev = /^(Ph\.D\.|Ph\.D|PhD|M\.A|M\.S|B\.A|B\.S|B\.E\.|B\.E|M\.D|D\.Phil|Postdoctoral|Doctor of Philosophy|Master of|Bachelor of|M\.Tech|M\.Eng|B\.Tech|B\.Com|MBA|HSC)/i.test(line.trim());
      
      // If line has years in parentheses OR starts with degree abbreviation (with or without parentheses), it's a degree
      if (hasYears || (isDegreeAbbrev && (line.includes('(') || /\b(in|of)\b/i.test(line)))) {
        return (
          <span key={index} className="font-bold text-black block">
            {line}
          </span>
        );
      }
      
      // Check if line is a rank/achievement (like "JEE All India rank 337")
      if (/^(JEE|All India|rank|Rank)/i.test(line.trim()) || /\b(All India rank|rank \d+)\b/i.test(line)) {
        return (
          <span key={index} className="font-bold text-black block">
            {line}
          </span>
        );
      }
      
      // Check if line is a department line (starts with "Department")
      if (/^Department/i.test(line.trim())) {
        // Extract university name (usually after the last comma)
        const parts = line.split(',');
        if (parts.length > 1) {
          const department = parts.slice(0, -1).join(',');
          const university = parts[parts.length - 1].trim();
          return (
            <span key={index} className="block text-muted-foreground/80">
              {department}, <span className="text-gold">{university}</span>
            </span>
          );
        }
      }
      
      // University lines with city/state - extract just the university name
      const parts = line.split(',');
      if (parts.length > 1) {
        const university = parts[0].trim();
        const location = parts.slice(1).join(',').trim();
        return (
          <span key={index} className="block text-muted-foreground/80">
            <span className="text-gold">{university}</span>, {location}
          </span>
        );
      }
      
      // Check if line starts with years/experience (like "12+ years")
      if (/^\d+\+?\s*(years|year)/i.test(line.trim())) {
        return (
          <span key={index} className="font-bold text-black block">
            {line}
          </span>
        );
      }
      
      // Check if line starts with "Academic Advisor" - make it yellow
      if (/^Academic Advisor/i.test(line.trim())) {
        return (
          <span key={index} className="block text-gold">
            {line}
          </span>
        );
      }
      
      // Single line without commas - check if it's a university or other text
      // If it contains words like "University", "College", "Institute", "IIT", it's likely a university
      const isUniversity = /\b(University|College|Institute|School|IIT)\b/i.test(line);
      
      if (isUniversity) {
        return (
          <span key={index} className="block text-gold">
            {line}
          </span>
        );
      }
      
      // Otherwise, it's other text (like specializations) - make it muted
      return (
        <span key={index} className="block text-muted-foreground/80">
          {line}
        </span>
      );
    });
  };

  const leaders = [
    { 
      name: "Dr. Sanjeev Kumar", 
      role: "Strategic Advisor",
      image: "/Sanjeev kumar .jpg",
      education: "Postdoctoral Fellow (2012-2014)\nDepartment of Health Policy and Management, Yale University\nPh.D. (2010)\nSouthern Methodist University, Dallas, Texas\nM.A (2002)\nPennsylvania State University, State College"
    },
    { 
      name: "Dr. Vinod Shastri", 
      role: "Research Director",
      image: "/Vinod shastri.jpg",
      education: "Doctor of Philosophy (Ph.D.), Entrepreneurship/Intrapreneurship (2012 - 2015)\nSymbiosis International University\nMaster of Commerce, Advanced Accounting & Auditing (1985 - 1987)\nSavitribai Phule Pune University\nMaster of Business Administration (MBA), Finance, General (1983 - 1985)\nJ.D.C.Bytco Institute of Management Studies & Research, University of Pune"
    },
    { 
      name: "Dr. Umesh Gupta", 
      role: "Innovation Strategist",
      image: "/Umesh gupta.jpg",
      education: "Doctor of Philosophy (PhD), Machine Learning (Jan 2017 - Jul 2021)\nNational Institute of Technology Arunachal Pradesh\nMaster of Engineering (MEng), Computer Science (Jul 2011 - Sep 2013)\nNational Institute of Technical Teachers Training & Research, Chandigarh\nBachelor of Technology (BTech), Computer Science (2004 - 2008)\nAJAY KUMAR GARG ENGINEERING COLLEGE, GHAZIABAD"
    }
  ];

  const innovationCouncil = [
    {
      name: "Dr. Karnika Dwivedi",
      image: "/Council-1-Karnika Dwivedi.jpg",
      education: "Ph.D. in Artificial Intelligence,Researcher - 15 Publications"
    },
    {
      name: "Dr. Uphar Singh",
      image: "/Council-4-Dr. Uphar Singh.jpg",
      education: "Ph.D, M.Tech Data Science, Reasearcher - 7 Publications"
    },
    {
      name: "Dr. Sidharth Quamara",
      image: "/Council-2-Dr. Sidharth Quamara.jpg",
      education: "Ph.D. in Blockchain(NIT),MHRD fellowship"
    },
    {
      name: "Dr. Amit Soni",
      image: "/Council-3-Dr. Amit Soni.jpg",
      education: "Ph.D. in Artificial Intelligence(IIT),M.Tech,Researcher - 3 Publication"
    }
    
  ];

  const mentors = [
    {
      name: "Dr. Ankith Kumar Pandey",
      image: "/Mentor-1-Dr. Ankith Kumar Pandey.jpg",
      education: "World's Top 2% Scientists ~Stanford University"
    },
    {
      name: "Dr. Avinash Upadhyay",
      image: "/Mentor-2-Dr. Avinash Upadhyay.jpg",
      education: "Ph.D. in Bennet, M.S at (KU)"
    },
    {
      name: "Dr. Manoj Sharma",
      image: "/Mentor-3-Manoj Sharma.jpg",
      education: "Ph.D. in Computer Science (Professor)"
    },
    {
      name: "Dr. Vivek Kumar",
      image: "/Mentor-4-Vivek kUMAR.jpg",
      education: "Ph.D. in High Performance Computing (APJTU)"
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "35+",
      label: "IITians",
      description: "From India's Premier Technology Institutes"
    },
    {
      icon: Award,
      number: "Top 2%",
      label: "Scientists",
      description: "Recognized by Stanford University"
    },
    {
      icon: Brain,
      number: "Global",
      label: "Think-Tank",
      description: "Shaping academic benchmarks worldwide"
    }
  ];

  return (
    <section id="panel" className="py-24 gradient-premium">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
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

          {/* Core Leaders */}
          <Card className="p-8 md:p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur">
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-6">
                <GraduationCap className="w-8 h-8 text-gold" />
                <h3 className="text-2xl font-serif font-semibold">Core Leadership Circle</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leaders.map((leader, index) => (
                  <div 
                    key={index}
                    className="group relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-background/90 via-background/60 to-background/30 p-6 shadow-sm transition-all duration-300 hover:border-gold/40 hover:shadow-xl"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/10"></div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 blur-3xl"></div>
                    </div>

                    <div className="relative flex flex-col gap-5">
                      <div className="flex items-start gap-4">
                        {leader.image ? (
                          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border/40 bg-background/60 shadow-md">
                            <img 
                              src={leader.image} 
                              alt={leader.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = '<div class="flex h-full w-full items-center justify-center text-xs uppercase tracking-wider text-muted-foreground">Photo</div>';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-border/40 bg-background/60 text-xs uppercase tracking-wider text-muted-foreground">
                            Photo
                          </div>
                        )}
                        <div className="space-y-2">
                          <h4 className="text-xl font-semibold text-foreground group-hover:text-gradient-gold">
                            {leader.name}
                          </h4>
                          <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold uppercase tracking-wide">
                            {leader.role}
                          </span>
                        </div>
                      </div>

                      {leader.education && (
                        <div className="relative space-y-2 rounded-lg border border-border/30 bg-background/70 p-4 text-xs leading-relaxed">
                          <div className="absolute -left-2 top-4 h-10 w-10 rounded-full bg-gradient-to-br from-gold/20 to-transparent blur-2xl"></div>
                          <div className="space-y-1 text-left text-muted-foreground">
                            {formatEducation(leader.education)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Innovation Council */}
          <Card className="p-8 md:p-12 shadow-premium border-border/50 bg-card/50 backdrop-blur">
            <h3 className="text-2xl font-serif font-semibold mb-6">Innovation Council</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {innovationCouncil.map((member, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="aspect-square w-full max-w-[150px] rounded-lg border-2 border-border/50 bg-background/50 overflow-hidden shadow-md">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="flex h-full w-full items-center justify-center text-muted-foreground text-xs">Photo</div>';
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
                <div 
                  key={index}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="aspect-square w-full max-w-[150px] rounded-lg border-2 border-border/50 bg-background/50 overflow-hidden shadow-md">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="flex h-full w-full items-center justify-center text-muted-foreground text-xs">Photo</div>';
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
