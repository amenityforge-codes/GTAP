import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Bot, FlaskConical, Compass, Briefcase, HeartPulse, Languages } from "lucide-react";

const curriculumTracks = [
  {
    title: "Foundational Years Curriculum (Nursery – Grade 6)",
    icon: Compass,
    programs: [
      "Play-Based Foundational Learning for Pre-KG & Kindergarten",
      "Early Literacy, Phonics & Language Enrichment",
      "Numeracy Foundations with Manipulatives & Real-Life Math",
      "Discovery Science & Environmental Exploration Modules",
      "Creative Arts, Music, Movement & Expression Labs",
      "Social-Emotional Development & Values-Based Learning Circles",
      "Inquiry Projects Connecting Home, School & Community",
    ],
  },
  {
    title: "AI, Technology & Digital Literacy",
    icon: Bot,
    programs: [
      "Artificial Intelligence & Computational Thinking (Grades 3–12)",
      "Coding & Robotics for Schools (Block → Python Pathway)",
      "Data Science for Students (Applied Analytics Basics)",
      "Digital Literacy & Computer Skills Curriculum",
      "Cyber Safety, Digital Citizenship & Online Ethics",
      "App & Game Development for Young Creators",
      "Emerging Technologies: AI, IoT & Automation for Teens",
    ],
  },
  {
    title: "STEM, Science & Innovation",
    icon: FlaskConical,
    programs: [
      "STEM & Maker Education Program (Hands-On Learning)",
      "Design Thinking & Innovation Labs for Schools",
      "Space Science & Astronomy Explorers Program",
      "Applied Mathematics in Real-Life Curriculum",
      "Science through Experiments & Inquiry-Based Learning",
    ],
  },
  {
    title: "Core School Skills (Academic Foundation)",
    icon: BrainCircuit,
    programs: [
      "Mathematics Mastery & Logical Reasoning Program",
      "English Language Proficiency & Communication Skills",
      "Environmental Studies & Sustainable Living",
      "Science Concepts Simplified (Physics, Chemistry, Biology)",
      "Social Studies, Civics & Global Awareness",
      "Reading, Writing & Comprehension Skills for Early Grades",
    ],
  },
  {
    title: "Life Skills, Financial & Career Readiness",
    icon: Briefcase,
    programs: [
      "Financial Literacy & Money Management for Teens",
      "Entrepreneurship & Startup Mindset Curriculum",
      "Career Skills & Future Readiness (NSQF-Aligned)",
      "Leadership, Communication & Teamwork Skills",
      "Critical Thinking & Problem-Solving for Everyday Life",
    ],
  },
  {
    title: "Wellbeing, SEL & Human Values",
    icon: HeartPulse,
    programs: [
      "Social Emotional Learning (SEL) & Mindfulness Program",
      "Health, Hygiene & Personal Wellness Curriculum",
      "Ethics, Values & Character Education",
      "Global Citizenship & Human Rights Education",
    ],
  },
  {
    title: "Language, Arts & Cultural Learning",
    icon: Languages,
    programs: [
      "Multilingual Communication (English + Regional + Global Languages)",
      "Creative Writing, Storytelling & Public Speaking",
      "Visual Arts, Performing Arts & Digital Creativity",
      "Cultural Heritage & Indian Knowledge Systems (IKS)",
    ],
  },
];

const CurriculumFramework = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-16">
            <header className="text-center space-y-4">
              <Badge className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.3em] bg-gold/10 text-gold border border-gold/40">
                International Curriculum Framework
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold">
                Comprehensive School Curriculum Framework <span className="text-gradient-gold">(India + Global)</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore integrated learning pathways tailored for modern schools—covering technology, STEM, foundational academics, life skills, wellbeing, and cultural literacy.
              </p>
              <p className="text-base text-muted-foreground max-w-3xl mx-auto">
                Our International Curriculum Framework (Pre-KG to Grade 8) aligns with NEP 2020 and global education benchmarks, empowering schools to deliver 21st-century learning within national guidelines while offering a globally relevant experience.
              </p>
            </header>

            <div className="grid gap-8">
              {curriculumTracks.map((track) => (
                <Card
                  key={track.title}
                  className="p-8 lg:p-10 border-border/40 bg-card/70 backdrop-blur-md shadow-premium hover:shadow-glow transition-all duration-300"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/80 to-gold/30 text-primary shadow-lg shadow-gold/20">
                      <track.icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-2xl font-serif font-semibold text-foreground">
                        {track.title}
                      </h2>
                      <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                        {track.programs.map((program) => (
                          <li key={program} className="flex items-start gap-3">
                            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold/70"></span>
                            <span>{program}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CurriculumFramework;

