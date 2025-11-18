import { Card } from "@/components/ui/card";
import { ClipboardList, Award, ShieldCheck } from "lucide-react";

const processSteps = [
  "Accreditation Process, Expression of Interest (EOI)",
  "Preliminary Review",
  "Self-Evaluation & Documentation Submission",
  "Virtual & On-Site Assessment",
  "Scoring, Feedback & Recommendations",
  "Accreditation Decision & Level Award",
  "Certification & Public Recognition",
  "Continuous Quality Monitoring & Re-Accreditation",
];

const accreditationLevels = [
  { label: "🏆 Diamond", range: "475–500" },
  { label: "🥇 Platinum", range: "450–474" },
  { label: "🥈 Gold", range: "400–449" },
  { label: "🥉 Silver", range: "350–399" },
  { label: "🌱 Emerging Institution", range: "Below 350" },
];

const standardsGuidelines = [
  "Curriculum Excellence – Schools implement structured, inquiry-based, outcome-oriented learning aligned with NEP 2020 and global best practices.",
  "Teaching & Learning Quality – Educators leverage innovative, inclusive, and technology-enabled pedagogies.",
  "Student Development – Holistic focus on academics, skills, values, and wellbeing for every learner.",
  "Innovation & Technology Integration – Regular adoption of AI, digital tools, and experiential learning methodologies.",
  "Infrastructure & Safety – Safe, accessible, child-friendly environments that nurture learning.",
  "Leadership & Governance – Ethical, transparent, and visionary institutional management.",
  "Community & Global Engagement – Active collaboration with parents, local communities, and international partners.",
  "Continuous Improvement – Commitment to ongoing self-evaluation, benchmarking, and progress tracking.",
];

const ResourcesSection = () => {
  return (
    <section id="resources" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-gold text-xs font-semibold tracking-wide uppercase">
              <ShieldCheck className="h-4 w-4" />
              Accreditation Resources
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">
              Every Step of the <span className="text-gradient-gold">GTAP Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Navigate the complete accreditation lifecycle, understand performance benchmarks, and align with our rigorous standards to deliver transformative learning experiences.
            </p>
          </div>

          <div className="grid gap-8">
            <Card id="resources-process" className="p-8 md:p-10 shadow-premium border-border/50 bg-card/60 backdrop-blur space-y-6">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-6 w-6 text-gold" />
                <h3 className="text-2xl font-serif font-semibold">Accreditation Process Roadmap</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                From intent to long-term excellence, our structured pathway ensures clarity, transparency, and continuous support for every partner institution.
              </p>
              <ol className="grid gap-4 md:grid-cols-2 text-sm text-foreground/90">
                {processSteps.map((step, index) => (
                  <li key={step} className="rounded-lg border border-border/40 bg-background/60 p-4">
                    <span className="text-xs font-semibold text-gold tracking-wide">STEP {index + 1}</span>
                    <p className="mt-2 font-medium">{step}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <Card id="resources-levels" className="p-8 md:p-10 shadow-premium border-border/50 bg-card/60 backdrop-blur space-y-6">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-gold" />
                <h3 className="text-2xl font-serif font-semibold">Accreditation Levels</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Performance bands recognize institutional maturity and excellence, enabling schools to celebrate progress while identifying future priorities.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {accreditationLevels.map((level) => (
                  <div key={level.label} className="rounded-xl border border-border/40 bg-background/70 p-5 text-center">
                    <p className="text-lg font-semibold text-gradient-gold">{level.label}</p>
                    <p className="text-sm text-muted-foreground mt-2">Score Range: {level.range}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card id="resources-standards" className="p-8 md:p-10 shadow-premium border-border/50 bg-card/60 backdrop-blur space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-gold" />
                <h3 className="text-2xl font-serif font-semibold">Standards & Guidelines</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Institutions are evaluated on eight dimensions that holistically capture governance, pedagogy, learner outcomes, and future readiness.
              </p>
              <ul className="grid gap-3 md:grid-cols-2 text-sm text-foreground/90">
                {standardsGuidelines.map((standard) => (
                  <li key={standard} className="flex items-start gap-3 rounded-lg border border-border/40 bg-background/60 p-4">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold/70"></span>
                    <span>{standard}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;

