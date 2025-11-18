import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BadgeCheck, School } from "lucide-react";
import { useState } from "react";

type CertificateResult = {
  boardName: string;
  academicYear: string;
  code: string;
  issuedTo: string;
  issuedOn: string;
};

const indianBoards = [
  "CBSE (Central Board of Secondary Education)",
  "ICSE (Indian Certificate of Secondary Education)",
  "IB (International Baccalaureate)",
  "IGCSE (International General Certificate of Secondary Education)",
  "NIOS (National Institute of Open Schooling)",
  "Andhra Pradesh Board of Secondary Education",
  "Assam Board of Secondary Education",
  "Bihar School Examination Board",
  "Chhattisgarh Board of Secondary Education",
  "Goa Board of Secondary and Higher Secondary Education",
  "Gujarat Secondary and Higher Secondary Education Board",
  "Haryana Board of School Education",
  "Himachal Pradesh Board of School Education",
  "Jammu and Kashmir State Board of School Education",
  "Jharkhand Academic Council",
  "Karnataka Secondary Education Examination Board",
  "Kerala Board of Public Examinations",
  "Madhya Pradesh Board of Secondary Education",
  "Maharashtra State Board of Secondary and Higher Secondary Education",
  "Manipur Board of Secondary Education",
  "Meghalaya Board of School Education",
  "Mizoram Board of School Education",
  "Nagaland Board of School Education",
  "Odisha Board of Secondary Education",
  "Punjab School Education Board",
  "Rajasthan Board of Secondary Education",
  "Sikkim Board of School Education",
  "Tamil Nadu Board of Secondary Education",
  "Telangana Board of Intermediate Education",
  "Tripura Board of Secondary Education",
  "Uttar Pradesh Board of High School and Intermediate Education",
  "Uttarakhand Board of School Education",
  "West Bengal Board of Secondary Education",
];

const academicYears = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
];

const Certificates = () => {
  const [institutionType, setInstitutionType] = useState<string>("");
  const [board, setBoard] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [result, setResult] = useState<CertificateResult | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!institutionType || !board || !academicYear || !code.trim()) {
      setError("Please complete every field before searching for a certificate.");
      return;
    }

    setError("");
    setIsSearching(true);

    setTimeout(() => {
      setResult({
        boardName: board,
        academicYear,
        code: code.trim().toUpperCase(),
        issuedTo: "Student Name Placeholder",
        issuedOn: new Date().toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
      setIsSearching(false);
    }, 750);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-16">
            <header className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-gold text-xs font-semibold tracking-wide uppercase">
                <BadgeCheck className="h-4 w-4" />
                Certificate Verification
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold">
                Access Your <span className="text-gradient-gold">Certificates</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Confirm accreditation results by selecting the institution, academic year, and entering the verification code provided to you.
              </p>
            </header>

            <Card className="p-8 shadow-premium border-border/50 bg-card/70 backdrop-blur">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institutionType">Institution Type</Label>
                    <Select
                      value={institutionType}
                      onValueChange={(value) => {
                        setInstitutionType(value);
                        setBoard("");
                        setResult(null);
                      }}
                    >
                      <SelectTrigger id="institutionType" aria-label="Select institution type">
                        <SelectValue placeholder="Choose type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="institution">Institution</SelectItem>
                        <SelectItem value="school">School</SelectItem>
                        <SelectItem value="college">College</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="board">Board</Label>
                    <Select
                      value={board}
                      onValueChange={(value) => {
                        setBoard(value);
                        setResult(null);
                      }}
                      disabled={!institutionType}
                    >
                      <SelectTrigger id="board" aria-label="Select board">
                        <SelectValue placeholder={institutionType ? "Select board" : "Choose type first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {indianBoards.map((boardName) => (
                          <SelectItem key={boardName} value={boardName}>
                            {boardName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year</Label>
                    <Select
                      value={academicYear}
                      onValueChange={(value) => {
                        setAcademicYear(value);
                        setResult(null);
                      }}
                    >
                      <SelectTrigger id="academicYear" aria-label="Select academic year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      value={code}
                      onChange={(event) => {
                        setCode(event.target.value);
                        setResult(null);
                      }}
                      placeholder="Enter unique certificate code"
                      className="uppercase tracking-widest"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <School className="h-4 w-4" />
                    Secure verification for GTAP-accredited partners worldwide.
                  </div>
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="gradient-gold text-primary hover:opacity-90 transition-opacity"
                  >
                    {isSearching ? "Retrieving Certificate..." : "View Certificate"}
                  </Button>
                </div>
              </form>
            </Card>

            {result && (
              <Card className="p-10 shadow-premium border-gold/40 bg-card/80 backdrop-blur space-y-6">
                <div className="text-center space-y-3">
                  <BadgeCheck className="mx-auto h-10 w-10 text-gold" />
                  <h2 className="text-3xl font-serif font-bold text-gradient-gold">Certificate of Accreditation</h2>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Verification Code: {result.code}</p>
                </div>

                <div className="space-y-4 text-center">
                  <p className="text-lg text-muted-foreground">
                    This is to certify that
                  </p>
                  <p className="text-2xl font-semibold text-foreground">{result.issuedTo}</p>
                  <p className="text-muted-foreground">
                    has successfully met the accreditation standards set forth by GTAP for
                  </p>
                  <p className="text-xl font-medium text-gradient-gold">{result.boardName}</p>
                  <p className="text-sm text-muted-foreground">
                    Academic Year: <span className="font-semibold">{result.academicYear}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Issued On</p>
                    <p className="text-base font-semibold text-foreground">{result.issuedOn}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Authorized By</p>
                    <p className="text-base font-semibold text-foreground">GTAP Accreditation Board</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Certificates;

