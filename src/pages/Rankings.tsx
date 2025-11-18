import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, MapPin, ArrowRight, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type InstitutionType = "School" | "College" | "University" | "Coaching Institute" | "EdTech Platform";
type SchoolBoard = "CBSE" | "ICSE" | "IB" | "IGCSE" | "State Board";
type CollegeType = "Engineering" | "Medical" | "MBA";
type CoachingType = "JEE" | "NEET" | "UPSC";

type InstitutionRanking = {
  name: string;
  city: string;
  country: string;
  ranking: number;
  institutionType: InstitutionType;
  subType?: SchoolBoard | CollegeType | CoachingType;
  accreditationLevel: "Diamond" | "Platinum" | "Gold" | "Silver" | "Emerging";
  focusAreas: string[];
  nationalRanking?: number; // Added for tier classification
  score?: number; // Added for sorting
};

// Helper function to extract board type from school description
const getBoardType = (description: string): SchoolBoard | undefined => {
  if (description.includes("IB")) return "IB";
  if (description.includes("IGCSE")) return "IGCSE";
  if (description.includes("ICSE") || description.includes("ISC")) return "ICSE";
  if (description.includes("CBSE")) return "CBSE";
  return undefined;
};

// Helper function to get accreditation level based on NATIONAL ranking distribution
// Tier Classification System:
// - Diamond: Top 25 schools (ranks 1-25)
// - Platinum: Next 15% of schools (approximately ranks 26-75)
// - Gold: Next 25% of schools (approximately ranks 76-158)
// - Silver: Next 30% of schools (approximately ranks 159-258)
// - Emerging: All remaining schools (approximately ranks 259+)
const getAccreditationLevelByNationalRank = (nationalRank: number, totalSchools: number): "Diamond" | "Platinum" | "Gold" | "Silver" | "Emerging" => {
  // Diamond: Top 25 schools (as specified)
  if (nationalRank <= 25) return "Diamond";
  
  // Calculate tier boundaries based on percentages
  const platinumStart = 26;
  const platinumCount = Math.floor(totalSchools * 0.15); // Next 15%
  const platinumEnd = platinumStart + platinumCount - 1;
  
  const goldStart = platinumEnd + 1;
  const goldCount = Math.floor(totalSchools * 0.25); // Next 25%
  const goldEnd = goldStart + goldCount - 1;
  
  const silverStart = goldEnd + 1;
  const silverCount = Math.floor(totalSchools * 0.30); // Next 30%
  const silverEnd = silverStart + silverCount - 1;
  
  // Platinum: Next 15% after Diamond
  if (nationalRank >= platinumStart && nationalRank <= platinumEnd) return "Platinum";
  
  // Gold: Next 25%
  if (nationalRank >= goldStart && nationalRank <= goldEnd) return "Gold";
  
  // Silver: Next 30%
  if (nationalRank >= silverStart && nationalRank <= silverEnd) return "Silver";
  
  // Emerging: All remaining schools
  return "Emerging";
};

// Legacy function for city-based ranking (kept for initial score calculation)
const getAccreditationLevel = (rank: number): "Diamond" | "Platinum" | "Gold" | "Silver" | "Emerging" => {
  if (rank <= 10) return "Diamond";
  if (rank <= 20) return "Platinum";
  if (rank <= 30) return "Gold";
  if (rank <= 40) return "Silver";
  return "Emerging";
};

// Helper function to get realistic score based on ranking and accreditation level
const getRealisticScore = (rank: number, level: "Diamond" | "Platinum" | "Gold" | "Silver" | "Emerging"): number => {
  // Based on research: Top schools score 450-500, with rank 1 schools around 480-500
  if (level === "Diamond") {
    if (rank === 1) return 490;
    if (rank <= 3) return 480 - (rank - 1) * 5;
    if (rank <= 5) return 465 - (rank - 3) * 3;
    return 455 - (rank - 5) * 2;
  }
  if (level === "Platinum") {
    if (rank <= 12) return 445 - (rank - 11) * 3;
    if (rank <= 15) return 430 - (rank - 12) * 2;
    return 420 - (rank - 15) * 2;
  }
  if (level === "Gold") {
    if (rank <= 22) return 400 - (rank - 21) * 2;
    if (rank <= 25) return 390 - (rank - 22) * 2;
    return 380 - (rank - 25) * 2;
  }
  if (level === "Silver") {
    if (rank <= 32) return 360 - (rank - 31) * 2;
    if (rank <= 35) return 350 - (rank - 32) * 2;
    return 340 - (rank - 35) * 2;
  }
  // Emerging
  if (rank <= 42) return 320 - (rank - 41) * 2;
  if (rank <= 45) return 310 - (rank - 42) * 2;
  return 300 - (rank - 45) * 2;
};

// Helper function to get realistic focus areas based on school name and type
const getRealisticFocusAreas = (schoolName: string, rank: number, board?: SchoolBoard): string[] => {
  const name = schoolName.toLowerCase();
  
  // Top-tier international schools (ranks 1-10)
  if (rank <= 10) {
    if (name.includes("international") || name.includes("ambani") || name.includes("oakridge") || name.includes("tisb") || name.includes("inventure")) {
      return ["Holistic Development", "Global Citizenship", "International Curriculum", "Technology Integration", "Community Service"];
    }
    if (name.includes("cathedral") || name.includes("connon")) {
      return ["Academic Excellence", "Experiential Learning", "Critical Thinking", "Cultural Activities", "Mental Health Support"];
    }
    if (name.includes("public school") || name.includes("dps") || name.includes("hps")) {
      return ["Academic Rigor", "Sports Excellence", "Co-curricular Activities", "Leadership Development", "Character Building"];
    }
    return ["Academic Excellence", "Holistic Development", "Co-curricular Activities", "Sports", "Community Engagement"];
  }
  
  // Premium schools (ranks 11-20)
  if (rank <= 20) {
    if (name.includes("international") || board === "IB" || board === "IGCSE") {
      return ["International Curriculum", "Global Perspective", "Technology Integration", "Sports Excellence", "Arts & Culture"];
    }
    if (name.includes("public school") || name.includes("dps")) {
      return ["Academic Excellence", "Sports", "Co-curricular Activities", "Leadership", "Values Education"];
    }
    return ["Academic Rigor", "Holistic Development", "Sports", "Arts", "Community Service"];
  }
  
  // Established schools (ranks 21-30)
  if (rank <= 30) {
    if (name.includes("international")) {
      return ["Modern Curriculum", "Technology", "Sports", "Arts", "Global Awareness"];
    }
    return ["Academic Excellence", "Sports Education", "Co-curricular Activities", "Character Development", "Community Outreach"];
  }
  
  // Growing schools (ranks 31-40)
  if (rank <= 40) {
    return ["Academic Development", "Sports", "Arts & Culture", "Technology", "Life Skills"];
  }
  
  // Emerging schools (ranks 41-50)
  return ["Academic Foundation", "Sports Activities", "Basic Co-curricular", "Character Building", "Community Engagement"];
};

// Initial ranking data with city-based rankings
const initialRankingData: InstitutionRanking[] = [
  // Mumbai Schools (1-50)
  { name: "Dhirubhai Ambani International School, BKC", city: "Mumbai", country: "India", ranking: 1, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Dhirubhai Ambani International School", 1, getBoardType("IB/IGCSE")) },
  { name: "Cathedral & John Connon School, Fort", city: "Mumbai", country: "India", ranking: 2, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Cathedral & John Connon School, Fort", 2, getBoardType("ICSE")) },
  { name: "Jamnabai Narsee School, Juhu", city: "Mumbai", country: "India", ranking: 3, institutionType: "School", subType: getBoardType("ICSE/IB"), accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Jamnabai Narsee School, Juhu", 3, getBoardType("ICSE/IB")) },
  { name: "Campion School, Fort", city: "Mumbai", country: "India", ranking: 4, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Campion School, Fort", 4, getBoardType("ICSE")) },
  { name: "Bombay Scottish School, Mahim", city: "Mumbai", country: "India", ranking: 5, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Bombay Scottish School, Mahim", 5, getBoardType("ICSE")) },
  { name: "Bombay Scottish School, Powai", city: "Mumbai", country: "India", ranking: 6, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Bombay Scottish School, Powai", 6, getBoardType("ICSE")) },
  { name: "St. Mary's School, Mazgaon", city: "Mumbai", country: "India", ranking: 7, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("St. Mary's School, Mazgaon", 7, getBoardType("ICSE")) },
  { name: "Oberoi International School, Goregaon", city: "Mumbai", country: "India", ranking: 8, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("Oberoi International School, Goregaon", 8, getBoardType("IB")) },
  { name: "Aditya Birla World Academy, Tardeo", city: "Mumbai", country: "India", ranking: 9, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Aditya Birla World Academy, Tardeo", 9, getBoardType("IB/IGCSE")) },
  { name: "Podar International School, Santacruz", city: "Mumbai", country: "India", ranking: 10, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Podar International School, Santacruz", 10, getBoardType("IB/IGCSE")) },
  { name: "Don Bosco High School, Matunga", city: "Mumbai", country: "India", ranking: 11, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Don Bosco High School, Matunga", 11, getBoardType("ICSE")) },
  { name: "SIES High School, Matunga", city: "Mumbai", country: "India", ranking: 12, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("SIES High School, Matunga", 12, undefined) },
  { name: "RN Podar School, Santacruz", city: "Mumbai", country: "India", ranking: 13, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("RN Podar School, Santacruz", 13, getBoardType("CBSE")) },
  { name: "Apeejay School, Nerul", city: "Mumbai", country: "India", ranking: 14, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Apeejay School, Nerul", 14, getBoardType("CBSE")) },
  { name: "Lilavatibai Podar School, Santacruz", city: "Mumbai", country: "India", ranking: 15, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Lilavatibai Podar School, Santacruz", 15, getBoardType("ICSE")) },
  { name: "St. Xavier's High School, Fort", city: "Mumbai", country: "India", ranking: 16, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(16), score: getRealisticScore(16, getAccreditationLevel(16)), focusAreas: getRealisticFocusAreas("St. Xavier's High School, Fort", 16, undefined) },
  { name: "Hiranandani Foundation School, Powai", city: "Mumbai", country: "India", ranking: 17, institutionType: "School", subType: getBoardType("ICSE/CBSE"), accreditationLevel: getAccreditationLevel(17), score: getRealisticScore(17, getAccreditationLevel(17)), focusAreas: getRealisticFocusAreas("Hiranandani Foundation School, Powai", 17, getBoardType("ICSE/CBSE")) },
  { name: "Billabong High International School, Andheri/Malad", city: "Mumbai", country: "India", ranking: 18, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(18), score: getRealisticScore(18, getAccreditationLevel(18)), focusAreas: getRealisticFocusAreas("Billabong High International School, Andheri/Malad", 18, undefined) },
  { name: "Greenlawns High School, Warden Road", city: "Mumbai", country: "India", ranking: 19, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(19), score: getRealisticScore(19, getAccreditationLevel(19)), focusAreas: getRealisticFocusAreas("Greenlawns High School, Warden Road", 19, undefined) },
  { name: "Singapore International School, Dahisar", city: "Mumbai", country: "India", ranking: 20, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(20), score: getRealisticScore(20, getAccreditationLevel(20)), focusAreas: getRealisticFocusAreas("Singapore International School, Dahisar", 20, getBoardType("IB")) },
  { name: "JBCN International School", city: "Mumbai", country: "India", ranking: 21, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(21), score: getRealisticScore(21, getAccreditationLevel(21)), focusAreas: getRealisticFocusAreas("JBCN International School", 21, undefined) },
  { name: "École Mondiale World School, Juhu", city: "Mumbai", country: "India", ranking: 22, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(22), score: getRealisticScore(22, getAccreditationLevel(22)), focusAreas: getRealisticFocusAreas("École Mondiale World School, Juhu", 22, getBoardType("IB")) },
  { name: "The Somaiya School, Ghatkopar", city: "Mumbai", country: "India", ranking: 23, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(23), score: getRealisticScore(23, getAccreditationLevel(23)), focusAreas: getRealisticFocusAreas("The Somaiya School, Ghatkopar", 23, getBoardType("CBSE")) },
  { name: "Parle Tilak Vidyalaya, Vile Parle", city: "Mumbai", country: "India", ranking: 24, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(24), score: getRealisticScore(24, getAccreditationLevel(24)), focusAreas: getRealisticFocusAreas("Parle Tilak Vidyalaya, Vile Parle", 24, undefined) },
  { name: "HVB Global Academy, Marine Lines", city: "Mumbai", country: "India", ranking: 25, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(25), score: getRealisticScore(25, getAccreditationLevel(25)), focusAreas: getRealisticFocusAreas("HVB Global Academy, Marine Lines", 25, undefined) },
  { name: "Shishuvan School, Matunga", city: "Mumbai", country: "India", ranking: 26, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(26), score: getRealisticScore(26, getAccreditationLevel(26)), focusAreas: getRealisticFocusAreas("Shishuvan School, Matunga", 26, undefined) },
  { name: "MET Rishikul Vidyalaya, Bandra", city: "Mumbai", country: "India", ranking: 27, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(27), score: getRealisticScore(27, getAccreditationLevel(27)), focusAreas: getRealisticFocusAreas("MET Rishikul Vidyalaya, Bandra", 27, undefined) },
  { name: "SVKM JV Parekh International School, Vile Parle", city: "Mumbai", country: "India", ranking: 28, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(28), score: getRealisticScore(28, getAccreditationLevel(28)), focusAreas: getRealisticFocusAreas("SVKM JV Parekh International School, Vile Parle", 28, undefined) },
  { name: "NES International School, Mulund", city: "Mumbai", country: "India", ranking: 29, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(29), score: getRealisticScore(29, getAccreditationLevel(29)), focusAreas: getRealisticFocusAreas("NES International School, Mulund", 29, getBoardType("IB/IGCSE")) },
  { name: "Orchids The International School", city: "Mumbai", country: "India", ranking: 30, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(30), score: getRealisticScore(30, getAccreditationLevel(30)), focusAreas: getRealisticFocusAreas("Orchids The International School", 30, undefined) },
  { name: "EuroSchool", city: "Mumbai", country: "India", ranking: 31, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(31), score: getRealisticScore(31, getAccreditationLevel(31)), focusAreas: getRealisticFocusAreas("EuroSchool", 31, undefined) },
  { name: "Ryan International School", city: "Mumbai", country: "India", ranking: 32, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(32), score: getRealisticScore(32, getAccreditationLevel(32)), focusAreas: getRealisticFocusAreas("Ryan International School", 32, undefined) },
  { name: "VIBGYOR High", city: "Mumbai", country: "India", ranking: 33, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(33), score: getRealisticScore(33, getAccreditationLevel(33)), focusAreas: getRealisticFocusAreas("VIBGYOR High", 33, undefined) },
  { name: "Avalon Heights International School, Vashi", city: "Mumbai", country: "India", ranking: 34, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(34), score: getRealisticScore(34, getAccreditationLevel(34)), focusAreas: getRealisticFocusAreas("Avalon Heights International School, Vashi", 34, undefined) },
  { name: "Rustomjee Cambridge International School, Dahisar", city: "Mumbai", country: "India", ranking: 35, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(35), score: getRealisticScore(35, getAccreditationLevel(35)), focusAreas: getRealisticFocusAreas("Rustomjee Cambridge International School, Dahisar", 35, undefined) },
  { name: "New Horizon Public School, Airoli", city: "Mumbai", country: "India", ranking: 36, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(36), score: getRealisticScore(36, getAccreditationLevel(36)), focusAreas: getRealisticFocusAreas("New Horizon Public School, Airoli", 36, undefined) },
  { name: "St. Gregorios High School, Chembur", city: "Mumbai", country: "India", ranking: 37, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(37), score: getRealisticScore(37, getAccreditationLevel(37)), focusAreas: getRealisticFocusAreas("St. Gregorios High School, Chembur", 37, undefined) },
  { name: "Christ Church School, Byculla", city: "Mumbai", country: "India", ranking: 38, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(38), score: getRealisticScore(38, getAccreditationLevel(38)), focusAreas: getRealisticFocusAreas("Christ Church School, Byculla", 38, undefined) },
  { name: "Children's Academy", city: "Mumbai", country: "India", ranking: 39, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(39), score: getRealisticScore(39, getAccreditationLevel(39)), focusAreas: getRealisticFocusAreas("Children's Academy", 39, undefined) },
  { name: "Bombay International School, Marine Drive", city: "Mumbai", country: "India", ranking: 40, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(40), score: getRealisticScore(40, getAccreditationLevel(40)), focusAreas: getRealisticFocusAreas("Bombay International School, Marine Drive", 40, getBoardType("IB")) },
  { name: "St. Joseph's High School, Wadala", city: "Mumbai", country: "India", ranking: 41, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(41), score: getRealisticScore(41, getAccreditationLevel(41)), focusAreas: getRealisticFocusAreas("St. Joseph's High School, Wadala", 41, undefined) },
  { name: "Holy Family High School, Andheri", city: "Mumbai", country: "India", ranking: 42, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(42), score: getRealisticScore(42, getAccreditationLevel(42)), focusAreas: getRealisticFocusAreas("Holy Family High School, Andheri", 42, undefined) },
  { name: "Hansraj Morarji Public School, Andheri", city: "Mumbai", country: "India", ranking: 43, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(43), score: getRealisticScore(43, getAccreditationLevel(43)), focusAreas: getRealisticFocusAreas("Hansraj Morarji Public School, Andheri", 43, undefined) },
  { name: "Gopi Birla Memorial School, Walkeshwar", city: "Mumbai", country: "India", ranking: 44, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(44), score: getRealisticScore(44, getAccreditationLevel(44)), focusAreas: getRealisticFocusAreas("Gopi Birla Memorial School, Walkeshwar", 44, undefined) },
  { name: "IIT Campus School, Powai", city: "Mumbai", country: "India", ranking: 45, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(45), score: getRealisticScore(45, getAccreditationLevel(45)), focusAreas: getRealisticFocusAreas("IIT Campus School, Powai", 45, undefined) },
  { name: "Rose Manor International School, Santacruz", city: "Mumbai", country: "India", ranking: 46, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(46), score: getRealisticScore(46, getAccreditationLevel(46)), focusAreas: getRealisticFocusAreas("Rose Manor International School, Santacruz", 46, undefined) },
  { name: "St. Stanislaus High School, Bandra", city: "Mumbai", country: "India", ranking: 47, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(47), score: getRealisticScore(47, getAccreditationLevel(47)), focusAreas: getRealisticFocusAreas("St. Stanislaus High School, Bandra", 47, undefined) },
  { name: "Our Lady of Perpetual Succour (OLPS), Chembur", city: "Mumbai", country: "India", ranking: 48, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(48), score: getRealisticScore(48, getAccreditationLevel(48)), focusAreas: getRealisticFocusAreas("Our Lady of Perpetual Succour (OLPS), Chembur", 48, undefined) },
  { name: "St. Joseph's Convent High School, Bandra", city: "Mumbai", country: "India", ranking: 49, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(49), score: getRealisticScore(49, getAccreditationLevel(49)), focusAreas: getRealisticFocusAreas("St. Joseph's Convent High School, Bandra", 49, undefined) },
  { name: "Vissanji Academy, Andheri", city: "Mumbai", country: "India", ranking: 50, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(50), score: getRealisticScore(50, getAccreditationLevel(50)), focusAreas: getRealisticFocusAreas("Vissanji Academy, Andheri", 50, undefined) },
  
  // Hyderabad Schools (51-100)
  { name: "Oakridge International School, Gachibowli", city: "Hyderabad", country: "India", ranking: 51, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Oakridge International School, Gachibowli", 51, getBoardType("IB/IGCSE")) },
  { name: "Chirec International School, Kondapur", city: "Hyderabad", country: "India", ranking: 52, institutionType: "School", subType: getBoardType("CBSE/IB/IGCSE"), accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Chirec International School, Kondapur", 52, getBoardType("CBSE/IB/IGCSE")) },
  { name: "International School of Hyderabad – ISH", city: "Hyderabad", country: "India", ranking: 53, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("International School of Hyderabad – ISH", 53, getBoardType("IB")) },
  { name: "Delhi Public School – DPS Hyderabad, Khajaguda", city: "Hyderabad", country: "India", ranking: 54, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Delhi Public School – DPS Hyderabad, Khajaguda", 54, getBoardType("CBSE")) },
  { name: "Delhi Public School – DPS Secunderabad", city: "Hyderabad", country: "India", ranking: 55, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Delhi Public School – DPS Secunderabad", 55, getBoardType("CBSE")) },
  { name: "The Hyderabad Public School – HPS Begumpet", city: "Hyderabad", country: "India", ranking: 56, institutionType: "School", subType: getBoardType("ICSE/ISC"), accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("The Hyderabad Public School – HPS Begumpet", 56, getBoardType("ICSE/ISC")) },
  { name: "The Hyderabad Public School – HPS Ramanthapur", city: "Hyderabad", country: "India", ranking: 57, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("The Hyderabad Public School – HPS Ramanthapur", 57, undefined) },
  { name: "Glendale International School", city: "Hyderabad", country: "India", ranking: 58, institutionType: "School", subType: getBoardType("CBSE/IGCSE"), accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("Glendale International School", 58, getBoardType("CBSE/IGCSE")) },
  { name: "Jubilee Hills Public School, Jubilee Hills", city: "Hyderabad", country: "India", ranking: 59, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Jubilee Hills Public School, Jubilee Hills", 59, getBoardType("CBSE")) },
  { name: "Silver Oaks International School", city: "Hyderabad", country: "India", ranking: 60, institutionType: "School", subType: getBoardType("IB/CBSE"), accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Silver Oaks International School", 60, getBoardType("IB/CBSE")) },
  { name: "Gitanjali Senior School, Begumpet", city: "Hyderabad", country: "India", ranking: 61, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Gitanjali Senior School, Begumpet", 61, getBoardType("ICSE")) },
  { name: "Meridian School, Banjara Hills", city: "Hyderabad", country: "India", ranking: 62, institutionType: "School", subType: getBoardType("CBSE/IGCSE"), accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Meridian School, Banjara Hills", 62, getBoardType("CBSE/IGCSE")) },
  { name: "Meridian School, Madhapur", city: "Hyderabad", country: "India", ranking: 63, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Meridian School, Madhapur", 63, undefined) },
  { name: "Obul Reddy Public School, Jubilee Hills", city: "Hyderabad", country: "India", ranking: 64, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Obul Reddy Public School, Jubilee Hills", 64, getBoardType("CBSE")) },
  { name: "Sreenidhi International School", city: "Hyderabad", country: "India", ranking: 65, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Sreenidhi International School", 65, getBoardType("IB")) },
  { name: "Kennedy High Global School, Bachupally", city: "Hyderabad", country: "India", ranking: 66, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(16), score: getRealisticScore(16, getAccreditationLevel(16)), focusAreas: getRealisticFocusAreas("Kennedy High Global School, Bachupally", 66, undefined) },
  { name: "DAV Public School, Safilguda", city: "Hyderabad", country: "India", ranking: 67, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(17), score: getRealisticScore(17, getAccreditationLevel(17)), focusAreas: getRealisticFocusAreas("DAV Public School, Safilguda", 67, getBoardType("CBSE")) },
  { name: "Delhi Public School – DPS Nacharam", city: "Hyderabad", country: "India", ranking: 68, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(18), score: getRealisticScore(18, getAccreditationLevel(18)), focusAreas: getRealisticFocusAreas("Delhi Public School – DPS Nacharam", 68, getBoardType("CBSE")) },
  { name: "Phoenix Greens International School, Gachibowli", city: "Hyderabad", country: "India", ranking: 69, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(19), score: getRealisticScore(19, getAccreditationLevel(19)), focusAreas: getRealisticFocusAreas("Phoenix Greens International School, Gachibowli", 69, undefined) },
  { name: "Vidyaranya High School, Saifabad", city: "Hyderabad", country: "India", ranking: 70, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(20), score: getRealisticScore(20, getAccreditationLevel(20)), focusAreas: getRealisticFocusAreas("Vidyaranya High School, Saifabad", 70, undefined) },
  { name: "Sentia Global School, Miyapur", city: "Hyderabad", country: "India", ranking: 71, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(21), score: getRealisticScore(21, getAccreditationLevel(21)), focusAreas: getRealisticFocusAreas("Sentia Global School, Miyapur", 71, undefined) },
  { name: "Rockwell International School, Kokapet", city: "Hyderabad", country: "India", ranking: 72, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(22), score: getRealisticScore(22, getAccreditationLevel(22)), focusAreas: getRealisticFocusAreas("Rockwell International School, Kokapet", 72, undefined) },
  { name: "Vikas The Concept School, Bachupally", city: "Hyderabad", country: "India", ranking: 73, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(23), score: getRealisticScore(23, getAccreditationLevel(23)), focusAreas: getRealisticFocusAreas("Vikas The Concept School, Bachupally", 73, undefined) },
  { name: "DPS Miyapur", city: "Hyderabad", country: "India", ranking: 74, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(24), score: getRealisticScore(24, getAccreditationLevel(24)), focusAreas: getRealisticFocusAreas("DPS Miyapur", 74, getBoardType("CBSE")) },
  { name: "Vignan Bo Tree School, Nizampet", city: "Hyderabad", country: "India", ranking: 75, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(25), score: getRealisticScore(25, getAccreditationLevel(25)), focusAreas: getRealisticFocusAreas("Vignan Bo Tree School, Nizampet", 75, undefined) },
  { name: "Manthan International School, Tellapur", city: "Hyderabad", country: "India", ranking: 76, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(26), score: getRealisticScore(26, getAccreditationLevel(26)), focusAreas: getRealisticFocusAreas("Manthan International School, Tellapur", 76, undefined) },
  { name: "Delhi School of Excellence (DSE), Banjara Hills", city: "Hyderabad", country: "India", ranking: 77, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(27), score: getRealisticScore(27, getAccreditationLevel(27)), focusAreas: getRealisticFocusAreas("Delhi School of Excellence (DSE), Banjara Hills", 77, undefined) },
  { name: "Delhi School of Excellence, Manikonda", city: "Hyderabad", country: "India", ranking: 78, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(28), score: getRealisticScore(28, getAccreditationLevel(28)), focusAreas: getRealisticFocusAreas("Delhi School of Excellence, Manikonda", 78, undefined) },
  { name: "Sanskriti School, Kondapur", city: "Hyderabad", country: "India", ranking: 79, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(29), score: getRealisticScore(29, getAccreditationLevel(29)), focusAreas: getRealisticFocusAreas("Sanskriti School, Kondapur", 79, undefined) },
  { name: "Hari Sri Vidya Nidhi School", city: "Hyderabad", country: "India", ranking: 80, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(30), score: getRealisticScore(30, getAccreditationLevel(30)), focusAreas: getRealisticFocusAreas("Hari Sri Vidya Nidhi School", 80, getBoardType("ICSE")) },
  { name: "Birla Open Minds International School", city: "Hyderabad", country: "India", ranking: 81, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(31), score: getRealisticScore(31, getAccreditationLevel(31)), focusAreas: getRealisticFocusAreas("Birla Open Minds International School", 81, undefined) },
  { name: "VIBGYOR High School, Nizampet", city: "Hyderabad", country: "India", ranking: 82, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(32), score: getRealisticScore(32, getAccreditationLevel(32)), focusAreas: getRealisticFocusAreas("VIBGYOR High School, Nizampet", 82, undefined) },
  { name: "VIBGYOR High, Madhapur", city: "Hyderabad", country: "India", ranking: 83, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(33), score: getRealisticScore(33, getAccreditationLevel(33)), focusAreas: getRealisticFocusAreas("VIBGYOR High, Madhapur", 83, undefined) },
  { name: "Unicent School, Miyapur", city: "Hyderabad", country: "India", ranking: 84, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(34), score: getRealisticScore(34, getAccreditationLevel(34)), focusAreas: getRealisticFocusAreas("Unicent School, Miyapur", 84, undefined) },
  { name: "Mount Litera Zee School", city: "Hyderabad", country: "India", ranking: 85, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(35), score: getRealisticScore(35, getAccreditationLevel(35)), focusAreas: getRealisticFocusAreas("Mount Litera Zee School", 85, undefined) },
  { name: "Green Gables International School", city: "Hyderabad", country: "India", ranking: 86, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(36), score: getRealisticScore(36, getAccreditationLevel(36)), focusAreas: getRealisticFocusAreas("Green Gables International School", 86, undefined) },
  { name: "The Gaudium School, Kollur", city: "Hyderabad", country: "India", ranking: 87, institutionType: "School", subType: getBoardType("IB/CBSE"), accreditationLevel: getAccreditationLevel(37), score: getRealisticScore(37, getAccreditationLevel(37)), focusAreas: getRealisticFocusAreas("The Gaudium School, Kollur", 87, getBoardType("IB/CBSE")) },
  { name: "Vishwashanti Gurukul, Hyderabad", city: "Hyderabad", country: "India", ranking: 88, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(38), score: getRealisticScore(38, getAccreditationLevel(38)), focusAreas: getRealisticFocusAreas("Vishwashanti Gurukul, Hyderabad", 88, undefined) },
  { name: "Gaudium International School", city: "Hyderabad", country: "India", ranking: 89, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(39), score: getRealisticScore(39, getAccreditationLevel(39)), focusAreas: getRealisticFocusAreas("Gaudium International School", 89, undefined) },
  { name: "Sloka - The Hyderabad Waldorf School", city: "Hyderabad", country: "India", ranking: 90, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(40), score: getRealisticScore(40, getAccreditationLevel(40)), focusAreas: getRealisticFocusAreas("Sloka - The Hyderabad Waldorf School", 90, undefined) },
  { name: "Johnson Grammar School, Habsiguda", city: "Hyderabad", country: "India", ranking: 91, institutionType: "School", subType: getBoardType("ICSE/CBSE"), accreditationLevel: getAccreditationLevel(41), score: getRealisticScore(41, getAccreditationLevel(41)), focusAreas: getRealisticFocusAreas("Johnson Grammar School, Habsiguda", 91, getBoardType("ICSE/CBSE")) },
  { name: "Johnson Grammar School, Mallapur", city: "Hyderabad", country: "India", ranking: 92, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(42), score: getRealisticScore(42, getAccreditationLevel(42)), focusAreas: getRealisticFocusAreas("Johnson Grammar School, Mallapur", 92, undefined) },
  { name: "Little Flower High School, Abids", city: "Hyderabad", country: "India", ranking: 93, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(43), score: getRealisticScore(43, getAccreditationLevel(43)), focusAreas: getRealisticFocusAreas("Little Flower High School, Abids", 93, undefined) },
  { name: "St. Joseph's Public School, King Koti", city: "Hyderabad", country: "India", ranking: 94, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(44), score: getRealisticScore(44, getAccreditationLevel(44)), focusAreas: getRealisticFocusAreas("St. Joseph's Public School, King Koti", 94, undefined) },
  { name: "St. Ann's High School, Secunderabad", city: "Hyderabad", country: "India", ranking: 95, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(45), score: getRealisticScore(45, getAccreditationLevel(45)), focusAreas: getRealisticFocusAreas("St. Ann's High School, Secunderabad", 95, undefined) },
  { name: "All Saints High School, Abids", city: "Hyderabad", country: "India", ranking: 96, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(46), score: getRealisticScore(46, getAccreditationLevel(46)), focusAreas: getRealisticFocusAreas("All Saints High School, Abids", 96, undefined) },
  { name: "Pallavi Model School", city: "Hyderabad", country: "India", ranking: 97, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(47), score: getRealisticScore(47, getAccreditationLevel(47)), focusAreas: getRealisticFocusAreas("Pallavi Model School", 97, undefined) },
  { name: "Sri Chaitanya Techno School", city: "Hyderabad", country: "India", ranking: 98, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(48), score: getRealisticScore(48, getAccreditationLevel(48)), focusAreas: getRealisticFocusAreas("Sri Chaitanya Techno School", 98, undefined) },
  { name: "Narayana Olympiad School", city: "Hyderabad", country: "India", ranking: 99, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(49), score: getRealisticScore(49, getAccreditationLevel(49)), focusAreas: getRealisticFocusAreas("Narayana Olympiad School", 99, undefined) },
  { name: "Mount Carmel High School, Ramanthapur", city: "Hyderabad", country: "India", ranking: 100, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(50), score: getRealisticScore(50, getAccreditationLevel(50)), focusAreas: getRealisticFocusAreas("Mount Carmel High School, Ramanthapur", 100, undefined) },
  
  // Bangalore Schools (101-140)
  { name: "The International School Bangalore (TISB), Whitefield", city: "Bengaluru", country: "India", ranking: 101, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("The International School Bangalore (TISB), Whitefield", 101, getBoardType("IB/IGCSE")) },
  { name: "Inventure Academy, Whitefield", city: "Bengaluru", country: "India", ranking: 102, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Inventure Academy, Whitefield", 102, getBoardType("IB/IGCSE")) },
  { name: "Greenwood High International School, Sarjapur", city: "Bengaluru", country: "India", ranking: 103, institutionType: "School", subType: getBoardType("IB/ICSE"), accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Greenwood High International School, Sarjapur", 103, getBoardType("IB/ICSE")) },
  { name: "Indus International School, Sarjapur", city: "Bengaluru", country: "India", ranking: 104, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Indus International School, Sarjapur", 104, getBoardType("IB")) },
  { name: "Stonehill International School, Yelahanka", city: "Bengaluru", country: "India", ranking: 105, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Stonehill International School, Yelahanka", 105, getBoardType("IB")) },
  { name: "Mallya Aditi International School, Yelahanka", city: "Bengaluru", country: "India", ranking: 106, institutionType: "School", subType: getBoardType("ICSE/ISC"), accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Mallya Aditi International School, Yelahanka", 106, getBoardType("ICSE/ISC")) },
  { name: "Canadian International School, Yelahanka", city: "Bengaluru", country: "India", ranking: 107, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("Canadian International School, Yelahanka", 107, getBoardType("IB/IGCSE")) },
  { name: "Bishop Cotton Boys' School, Residency Road", city: "Bengaluru", country: "India", ranking: 108, institutionType: "School", subType: getBoardType("ICSE/ISC"), accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("Bishop Cotton Boys' School, Residency Road", 108, getBoardType("ICSE/ISC")) },
  { name: "Bishop Cotton Girls' School, Residency Road", city: "Bengaluru", country: "India", ranking: 109, institutionType: "School", subType: getBoardType("ICSE/ISC"), accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Bishop Cotton Girls' School, Residency Road", 109, getBoardType("ICSE/ISC")) },
  { name: "National Public School (NPS), Indiranagar", city: "Bengaluru", country: "India", ranking: 110, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("National Public School (NPS), Indiranagar", 110, getBoardType("CBSE")) },
  { name: "National Public School (NPS), Koramangala", city: "Bengaluru", country: "India", ranking: 111, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("National Public School (NPS), Koramangala", 111, getBoardType("CBSE")) },
  { name: "National Public School (NPS), Rajajinagar", city: "Bengaluru", country: "India", ranking: 112, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("National Public School (NPS), Rajajinagar", 112, getBoardType("CBSE")) },
  { name: "Delhi Public School (DPS), South", city: "Bengaluru", country: "India", ranking: 113, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS), South", 113, getBoardType("CBSE")) },
  { name: "Delhi Public School (DPS), North", city: "Bengaluru", country: "India", ranking: 114, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS), North", 114, getBoardType("CBSE")) },
  { name: "Delhi Public School (DPS), East", city: "Bengaluru", country: "India", ranking: 115, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS), East", 115, getBoardType("CBSE")) },
  { name: "Vidya Niketan School, Hebbal", city: "Bengaluru", country: "India", ranking: 116, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(16), score: getRealisticScore(16, getAccreditationLevel(16)), focusAreas: getRealisticFocusAreas("Vidya Niketan School, Hebbal", 116, undefined) },
  { name: "New Horizon Public School, Indiranagar", city: "Bengaluru", country: "India", ranking: 117, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(17), score: getRealisticScore(17, getAccreditationLevel(17)), focusAreas: getRealisticFocusAreas("New Horizon Public School, Indiranagar", 117, undefined) },
  { name: "Army Public School, Kamaraj Road", city: "Bengaluru", country: "India", ranking: 118, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(18), score: getRealisticScore(18, getAccreditationLevel(18)), focusAreas: getRealisticFocusAreas("Army Public School, Kamaraj Road", 118, undefined) },
  { name: "Sri Kumaran Children's Home, Kumaraswamy Layout", city: "Bengaluru", country: "India", ranking: 119, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(19), score: getRealisticScore(19, getAccreditationLevel(19)), focusAreas: getRealisticFocusAreas("Sri Kumaran Children's Home, Kumaraswamy Layout", 119, undefined) },
  { name: "Jain International Residential School (JIRS), Kanakapura", city: "Bengaluru", country: "India", ranking: 120, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(20), score: getRealisticScore(20, getAccreditationLevel(20)), focusAreas: getRealisticFocusAreas("Jain International Residential School (JIRS), Kanakapura", 120, undefined) },
  { name: "Treamis World School, Electronic City", city: "Bengaluru", country: "India", ranking: 121, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(21), score: getRealisticScore(21, getAccreditationLevel(21)), focusAreas: getRealisticFocusAreas("Treamis World School, Electronic City", 121, undefined) },
  { name: "VIBGYOR High", city: "Bengaluru", country: "India", ranking: 122, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(22), score: getRealisticScore(22, getAccreditationLevel(22)), focusAreas: getRealisticFocusAreas("VIBGYOR High", 122, undefined) },
  { name: "Trio World Academy, Sahakar Nagar", city: "Bengaluru", country: "India", ranking: 123, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(23), score: getRealisticScore(23, getAccreditationLevel(23)), focusAreas: getRealisticFocusAreas("Trio World Academy, Sahakar Nagar", 123, getBoardType("IB/IGCSE")) },
  { name: "Orchids The International School", city: "Bengaluru", country: "India", ranking: 124, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(24), score: getRealisticScore(24, getAccreditationLevel(24)), focusAreas: getRealisticFocusAreas("Orchids The International School", 124, undefined) },
  { name: "Harvest International School, Sarjapur", city: "Bengaluru", country: "India", ranking: 125, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(25), score: getRealisticScore(25, getAccreditationLevel(25)), focusAreas: getRealisticFocusAreas("Harvest International School, Sarjapur", 125, undefined) },
  { name: "EuroSchool, HSR", city: "Bengaluru", country: "India", ranking: 126, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(26), score: getRealisticScore(26, getAccreditationLevel(26)), focusAreas: getRealisticFocusAreas("EuroSchool, HSR", 126, undefined) },
  { name: "Presidency School, RT Nagar", city: "Bengaluru", country: "India", ranking: 127, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(27), score: getRealisticScore(27, getAccreditationLevel(27)), focusAreas: getRealisticFocusAreas("Presidency School, RT Nagar", 127, undefined) },
  { name: "Presidency School, Nandini Layout", city: "Bengaluru", country: "India", ranking: 128, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(28), score: getRealisticScore(28, getAccreditationLevel(28)), focusAreas: getRealisticFocusAreas("Presidency School, Nandini Layout", 128, undefined) },
  { name: "BGS National Public School, Hulimavu", city: "Bengaluru", country: "India", ranking: 129, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(29), score: getRealisticScore(29, getAccreditationLevel(29)), focusAreas: getRealisticFocusAreas("BGS National Public School, Hulimavu", 129, undefined) },
  { name: "Sacred Heart Girls' High School, Residency Road", city: "Bengaluru", country: "India", ranking: 130, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(30), score: getRealisticScore(30, getAccreditationLevel(30)), focusAreas: getRealisticFocusAreas("Sacred Heart Girls' High School, Residency Road", 130, undefined) },
  { name: "Kendriya Vidyalaya", city: "Bengaluru", country: "India", ranking: 131, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(31), score: getRealisticScore(31, getAccreditationLevel(31)), focusAreas: getRealisticFocusAreas("Kendriya Vidyalaya", 131, undefined) },
  { name: "Bethany High School, Koramangala", city: "Bengaluru", country: "India", ranking: 132, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(32), score: getRealisticScore(32, getAccreditationLevel(32)), focusAreas: getRealisticFocusAreas("Bethany High School, Koramangala", 132, undefined) },
  { name: "St. Joseph's Boys' High School, Museum Road", city: "Bengaluru", country: "India", ranking: 133, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(33), score: getRealisticScore(33, getAccreditationLevel(33)), focusAreas: getRealisticFocusAreas("St. Joseph's Boys' High School, Museum Road", 133, undefined) },
  { name: "St. Francis Xavier Girls' High School, Frazer Town", city: "Bengaluru", country: "India", ranking: 134, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(34), score: getRealisticScore(34, getAccreditationLevel(34)), focusAreas: getRealisticFocusAreas("St. Francis Xavier Girls' High School, Frazer Town", 134, undefined) },
  { name: "Lawrence School, HSR Layout", city: "Bengaluru", country: "India", ranking: 135, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(35), score: getRealisticScore(35, getAccreditationLevel(35)), focusAreas: getRealisticFocusAreas("Lawrence School, HSR Layout", 135, undefined) },
  { name: "Clarence High School, Richards Town", city: "Bengaluru", country: "India", ranking: 136, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(36), score: getRealisticScore(36, getAccreditationLevel(36)), focusAreas: getRealisticFocusAreas("Clarence High School, Richards Town", 136, undefined) },
  { name: "Gear Innovative International School, Bellandur", city: "Bengaluru", country: "India", ranking: 137, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(37), score: getRealisticScore(37, getAccreditationLevel(37)), focusAreas: getRealisticFocusAreas("Gear Innovative International School, Bellandur", 137, undefined) },
  { name: "The Cambridge International School, HSR", city: "Bengaluru", country: "India", ranking: 138, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(38), score: getRealisticScore(38, getAccreditationLevel(38)), focusAreas: getRealisticFocusAreas("The Cambridge International School, HSR", 138, undefined) },
  { name: "Christ Academy, Begur", city: "Bengaluru", country: "India", ranking: 139, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(39), score: getRealisticScore(39, getAccreditationLevel(39)), focusAreas: getRealisticFocusAreas("Christ Academy, Begur", 139, undefined) },
  { name: "Baldwin Boys' High School, Richmond Town", city: "Bengaluru", country: "India", ranking: 140, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(40), score: getRealisticScore(40, getAccreditationLevel(40)), focusAreas: getRealisticFocusAreas("Baldwin Boys' High School, Richmond Town", 140, undefined) },
  
  // Gurgaon Schools (141-155)
  { name: "The Shri Ram School, Moulsari", city: "Gurgaon", country: "India", ranking: 141, institutionType: "School", subType: getBoardType("IB/ICSE"), accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("The Shri Ram School, Moulsari", 141, getBoardType("IB/ICSE")) },
  { name: "Shiv Nadar School, Gurgaon", city: "Gurgaon", country: "India", ranking: 142, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Shiv Nadar School, Gurgaon", 142, getBoardType("CBSE")) },
  { name: "GD Goenka World School", city: "Gurgaon", country: "India", ranking: 143, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("GD Goenka World School", 143, getBoardType("IB/IGCSE")) },
  { name: "Pathways World School, Aravali", city: "Gurgaon", country: "India", ranking: 144, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Pathways World School, Aravali", 144, getBoardType("IB")) },
  { name: "Delhi Public School (DPS), Sector 45", city: "Gurgaon", country: "India", ranking: 145, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS), Sector 45", 145, getBoardType("CBSE")) },
  { name: "Suncity School, Sector 54", city: "Gurgaon", country: "India", ranking: 146, institutionType: "School", subType: getBoardType("CBSE/IB"), accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Suncity School, Sector 54", 146, getBoardType("CBSE/IB")) },
  { name: "Scottish High International School", city: "Gurgaon", country: "India", ranking: 147, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("Scottish High International School", 147, getBoardType("IB/IGCSE")) },
  { name: "Heritage Xperiential School", city: "Gurgaon", country: "India", ranking: 148, institutionType: "School", subType: getBoardType("CBSE/IB"), accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("Heritage Xperiential School", 148, getBoardType("CBSE/IB")) },
  { name: "Excelsior American School", city: "Gurgaon", country: "India", ranking: 149, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Excelsior American School", 149, getBoardType("IB/IGCSE")) },
  { name: "Amity International School, Sector 46", city: "Gurgaon", country: "India", ranking: 150, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Amity International School, Sector 46", 150, getBoardType("CBSE")) },
  { name: "Blue Bells Model School", city: "Gurgaon", country: "India", ranking: 151, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Blue Bells Model School", 151, getBoardType("CBSE")) },
  { name: "K.R. Mangalam World School", city: "Gurgaon", country: "India", ranking: 152, institutionType: "School", subType: getBoardType("CBSE/IGCSE"), accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("K.R. Mangalam World School", 152, getBoardType("CBSE/IGCSE")) },
  { name: "Presidium School, Gurgaon", city: "Gurgaon", country: "India", ranking: 153, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Presidium School, Gurgaon", 153, undefined) },
  { name: "Greenwood Public School", city: "Gurgaon", country: "India", ranking: 154, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Greenwood Public School", 154, undefined) },
  { name: "Lotus Valley International School", city: "Gurgaon", country: "India", ranking: 155, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Lotus Valley International School", 155, getBoardType("CBSE")) },
  
  // Noida Schools (156-170)
  { name: "Step by Step School, Sector 132", city: "Noida", country: "India", ranking: 156, institutionType: "School", subType: getBoardType("CBSE/IB"), accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Step by Step School, Sector 132", 156, getBoardType("CBSE/IB")) },
  { name: "Lotus Valley International School, Sector 126", city: "Noida", country: "India", ranking: 157, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Lotus Valley International School, Sector 126", 157, getBoardType("CBSE")) },
  { name: "Delhi Public School (DPS) Noida, Sector 30", city: "Noida", country: "India", ranking: 158, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Noida, Sector 30", 158, getBoardType("CBSE")) },
  { name: "Shiv Nadar School, Noida", city: "Noida", country: "India", ranking: 159, institutionType: "School", subType: getBoardType("CBSE/IB"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Shiv Nadar School, Noida", 159, getBoardType("CBSE/IB")) },
  { name: "Pathways School, Noida", city: "Noida", country: "India", ranking: 160, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Pathways School, Noida", 160, getBoardType("IB")) },
  { name: "Amity International School, Sector 44", city: "Noida", country: "India", ranking: 161, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Amity International School, Sector 44", 161, getBoardType("CBSE")) },
  { name: "Mayoor School, Sector 126", city: "Noida", country: "India", ranking: 162, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("Mayoor School, Sector 126", 162, getBoardType("CBSE")) },
  { name: "Kothari International School", city: "Noida", country: "India", ranking: 163, institutionType: "School", subType: getBoardType("CBSE/IGCSE"), accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("Kothari International School", 163, getBoardType("CBSE/IGCSE")) },
  { name: "Apeejay School, Noida", city: "Noida", country: "India", ranking: 164, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Apeejay School, Noida", 164, getBoardType("CBSE")) },
  { name: "Somerville School, Sector 22", city: "Noida", country: "India", ranking: 165, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Somerville School, Sector 22", 165, getBoardType("CBSE")) },
  { name: "Gyanshree School, Sector 127", city: "Noida", country: "India", ranking: 166, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Gyanshree School, Sector 127", 166, undefined) },
  { name: "Ramagya School, Sector 50", city: "Noida", country: "India", ranking: 167, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Ramagya School, Sector 50", 167, undefined) },
  { name: "Billabong High International School", city: "Noida", country: "India", ranking: 168, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Billabong High International School", 168, undefined) },
  { name: "JBM Global School", city: "Noida", country: "India", ranking: 169, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("JBM Global School", 169, undefined) },
  { name: "Global Indian International School (GIIS)", city: "Noida", country: "India", ranking: 170, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Global Indian International School (GIIS)", 170, undefined) },
  
  // Delhi Schools (171-185)
  { name: "The Shri Ram School, Vasant Vihar", city: "Delhi", country: "India", ranking: 171, institutionType: "School", subType: getBoardType("ICSE"), accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("The Shri Ram School, Vasant Vihar", 171, getBoardType("ICSE")) },
  { name: "Delhi Public School (DPS) R.K. Puram", city: "Delhi", country: "India", ranking: 172, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) R.K. Puram", 172, getBoardType("CBSE")) },
  { name: "Delhi Public School (DPS) Mathura Road", city: "Delhi", country: "India", ranking: 173, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Mathura Road", 173, getBoardType("CBSE")) },
  { name: "Sardar Patel Vidyalaya, Lodhi Estate", city: "Delhi", country: "India", ranking: 174, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Sardar Patel Vidyalaya, Lodhi Estate", 174, getBoardType("CBSE")) },
  { name: "Modern School, Barakhamba Road", city: "Delhi", country: "India", ranking: 175, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Modern School, Barakhamba Road", 175, getBoardType("CBSE")) },
  { name: "Vasant Valley School, Vasant Kunj", city: "Delhi", country: "India", ranking: 176, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Vasant Valley School, Vasant Kunj", 176, getBoardType("CBSE")) },
  { name: "The Mother's International School, Sri Aurobindo Marg", city: "Delhi", country: "India", ranking: 177, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("The Mother's International School, Sri Aurobindo Marg", 177, getBoardType("CBSE")) },
  { name: "St. Columba's School, Ashok Place", city: "Delhi", country: "India", ranking: 178, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("St. Columba's School, Ashok Place", 178, getBoardType("CBSE")) },
  { name: "St. Xavier's School, Raj Niwas Marg", city: "Delhi", country: "India", ranking: 179, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("St. Xavier's School, Raj Niwas Marg", 179, undefined) },
  { name: "Carmel Convent School, Chanakyapuri", city: "Delhi", country: "India", ranking: 180, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Carmel Convent School, Chanakyapuri", 180, undefined) },
  { name: "Springdales School, Pusa Road", city: "Delhi", country: "India", ranking: 181, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Springdales School, Pusa Road", 181, undefined) },
  { name: "Springdales School, Dhaula Kuan", city: "Delhi", country: "India", ranking: 182, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Springdales School, Dhaula Kuan", 182, undefined) },
  { name: "Bal Bharati Public School, Pitampura", city: "Delhi", country: "India", ranking: 183, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Bal Bharati Public School, Pitampura", 183, undefined) },
  { name: "Bluebells School International, Kailash", city: "Delhi", country: "India", ranking: 184, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Bluebells School International, Kailash", 184, undefined) },
  { name: "Loreto Convent School, Delhi Cantt", city: "Delhi", country: "India", ranking: 185, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Loreto Convent School, Delhi Cantt", 185, undefined) },
  
  // Chennai Schools (186-200)
  { name: "Chettinad Vidyashram, RA Puram", city: "Chennai", country: "India", ranking: 186, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Chettinad Vidyashram, RA Puram", 186, undefined) },
  { name: "Sishya School, Adyar", city: "Chennai", country: "India", ranking: 187, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Sishya School, Adyar", 187, undefined) },
  { name: "Padma Seshadri Bala Bhavan (PSBB), KK Nagar", city: "Chennai", country: "India", ranking: 188, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Padma Seshadri Bala Bhavan (PSBB), KK Nagar", 188, undefined) },
  { name: "Padma Seshadri Bala Bhavan (PSBB), T Nagar", city: "Chennai", country: "India", ranking: 189, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Padma Seshadri Bala Bhavan (PSBB), T Nagar", 189, undefined) },
  { name: "DAV Boys Senior Secondary School, Gopalapuram", city: "Chennai", country: "India", ranking: 190, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("DAV Boys Senior Secondary School, Gopalapuram", 190, undefined) },
  { name: "DAV Girls Senior Secondary School, Gopalapuram", city: "Chennai", country: "India", ranking: 191, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("DAV Girls Senior Secondary School, Gopalapuram", 191, undefined) },
  { name: "Vana Vani School, IIT Madras", city: "Chennai", country: "India", ranking: 192, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("Vana Vani School, IIT Madras", 192, undefined) },
  { name: "Vidya Mandir Senior Secondary School, Mylapore", city: "Chennai", country: "India", ranking: 193, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("Vidya Mandir Senior Secondary School, Mylapore", 193, undefined) },
  { name: "BVM Global School, Bollineni", city: "Chennai", country: "India", ranking: 194, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("BVM Global School, Bollineni", 194, undefined) },
  { name: "Olympia Panache International School", city: "Chennai", country: "India", ranking: 195, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Olympia Panache International School", 195, undefined) },
  { name: "The Schram Academy", city: "Chennai", country: "India", ranking: 196, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("The Schram Academy", 196, undefined) },
  { name: "Chinmaya Vidyalaya, Virugambakkam", city: "Chennai", country: "India", ranking: 197, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Chinmaya Vidyalaya, Virugambakkam", 197, undefined) },
  { name: "Kendriya Vidyalaya CLRI", city: "Chennai", country: "India", ranking: 198, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Kendriya Vidyalaya CLRI", 198, undefined) },
  { name: "Delhi Public School (DPS), Nellikuppam Road", city: "Chennai", country: "India", ranking: 199, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS), Nellikuppam Road", 199, getBoardType("CBSE")) },
  { name: "Maharishi Vidya Mandir, Chetpet", city: "Chennai", country: "India", ranking: 200, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Maharishi Vidya Mandir, Chetpet", 200, undefined) },
  
  // Pune Schools (201-215)
  { name: "The Bishop's School", city: "Pune", country: "India", ranking: 201, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("The Bishop's School", 201, undefined) },
  { name: "Delhi Public School (DPS), Pune", city: "Pune", country: "India", ranking: 202, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS), Pune", 202, getBoardType("CBSE")) },
  { name: "Symbiosis International School, Viman Nagar", city: "Pune", country: "India", ranking: 203, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Symbiosis International School, Viman Nagar", 203, undefined) },
  { name: "St. Mary's School, Camp", city: "Pune", country: "India", ranking: 204, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("St. Mary's School, Camp", 204, undefined) },
  { name: "Indus International School, Mulshi", city: "Pune", country: "India", ranking: 205, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Indus International School, Mulshi", 205, getBoardType("IB")) },
  { name: "Vibgyor High", city: "Pune", country: "India", ranking: 206, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Vibgyor High", 206, undefined) },
  { name: "The Lexicon International School", city: "Pune", country: "India", ranking: 207, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("The Lexicon International School", 207, undefined) },
  { name: "DAV Public School, Aundh", city: "Pune", country: "India", ranking: 208, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("DAV Public School, Aundh", 208, getBoardType("CBSE")) },
  { name: "Army Public School, Dighi", city: "Pune", country: "India", ranking: 209, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Army Public School, Dighi", 209, undefined) },
  { name: "Orchids The International School", city: "Pune", country: "India", ranking: 210, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Orchids The International School", 210, undefined) },
  { name: "Pawar Public School, Hadapsar", city: "Pune", country: "India", ranking: 211, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Pawar Public School, Hadapsar", 211, undefined) },
  { name: "Ryan International School", city: "Pune", country: "India", ranking: 212, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Ryan International School", 212, undefined) },
  { name: "Kendriya Vidyalaya Southern Command", city: "Pune", country: "India", ranking: 213, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Kendriya Vidyalaya Southern Command", 213, undefined) },
  { name: "Victorious Kidss Educares (IB)", city: "Pune", country: "India", ranking: 214, institutionType: "School", subType: getBoardType("IB"), accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Victorious Kidss Educares (IB)", 214, getBoardType("IB")) },
  { name: "Delhi Public School (DPS), Hinjewadi", city: "Pune", country: "India", ranking: 215, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS), Hinjewadi", 215, getBoardType("CBSE")) },
  
  // Ahmedabad Schools (216-230)
  { name: "Ahmedabad International School (AIS)", city: "Ahmedabad", country: "India", ranking: 216, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Ahmedabad International School (AIS)", 216, undefined) },
  { name: "Calorx Olive International School (COIS)", city: "Ahmedabad", country: "India", ranking: 217, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Calorx Olive International School (COIS)", 217, undefined) },
  { name: "Udgam School for Children", city: "Ahmedabad", country: "India", ranking: 218, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Udgam School for Children", 218, undefined) },
  { name: "Delhi Public School (DPS) Bopal", city: "Ahmedabad", country: "India", ranking: 219, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Bopal", 219, getBoardType("CBSE")) },
  { name: "St. Kabir School, Drive-In Road", city: "Ahmedabad", country: "India", ranking: 220, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("St. Kabir School, Drive-In Road", 220, undefined) },
  { name: "Maharaja Agrasen Vidyalaya", city: "Ahmedabad", country: "India", ranking: 221, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Maharaja Agrasen Vidyalaya", 221, undefined) },
  { name: "Zydus School for Excellence", city: "Ahmedabad", country: "India", ranking: 222, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("Zydus School for Excellence", 222, undefined) },
  { name: "SGVP International School", city: "Ahmedabad", country: "India", ranking: 223, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("SGVP International School", 223, undefined) },
  { name: "Global Indian International School (GIIS)", city: "Ahmedabad", country: "India", ranking: 224, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Global Indian International School (GIIS)", 224, undefined) },
  { name: "Anand Niketan School (Satellite)", city: "Ahmedabad", country: "India", ranking: 225, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Anand Niketan School (Satellite)", 225, undefined) },
  { name: "Anand Niketan School (Shilaj)", city: "Ahmedabad", country: "India", ranking: 226, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Anand Niketan School (Shilaj)", 226, undefined) },
  { name: "Eklavya School", city: "Ahmedabad", country: "India", ranking: 227, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Eklavya School", 227, undefined) },
  { name: "Sattva Vikas School", city: "Ahmedabad", country: "India", ranking: 228, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Sattva Vikas School", 228, undefined) },
  { name: "Calorx Public School", city: "Ahmedabad", country: "India", ranking: 229, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Calorx Public School", 229, undefined) },
  { name: "The New Tulip International School", city: "Ahmedabad", country: "India", ranking: 230, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("The New Tulip International School", 230, undefined) },
  
  // Kolkata Schools (231-245)
  { name: "La Martiniere for Boys", city: "Kolkata", country: "India", ranking: 231, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("La Martiniere for Boys", 231, undefined) },
  { name: "La Martiniere for Girls", city: "Kolkata", country: "India", ranking: 232, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("La Martiniere for Girls", 232, undefined) },
  { name: "St. Xavier's Collegiate School", city: "Kolkata", country: "India", ranking: 233, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("St. Xavier's Collegiate School", 233, undefined) },
  { name: "Modern High School for Girls", city: "Kolkata", country: "India", ranking: 234, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Modern High School for Girls", 234, undefined) },
  { name: "The Heritage School", city: "Kolkata", country: "India", ranking: 235, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("The Heritage School", 235, undefined) },
  { name: "South Point High School", city: "Kolkata", country: "India", ranking: 236, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("South Point High School", 236, undefined) },
  { name: "Delhi Public School, Ruby Park", city: "Kolkata", country: "India", ranking: 237, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("Delhi Public School, Ruby Park", 237, getBoardType("CBSE")) },
  { name: "DPS Megacity", city: "Kolkata", country: "India", ranking: 238, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("DPS Megacity", 238, getBoardType("CBSE")) },
  { name: "Birla High School", city: "Kolkata", country: "India", ranking: 239, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Birla High School", 239, undefined) },
  { name: "Calcutta International School (CIS)", city: "Kolkata", country: "India", ranking: 240, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Calcutta International School (CIS)", 240, undefined) },
  { name: "Sri Sri Academy", city: "Kolkata", country: "India", ranking: 241, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Sri Sri Academy", 241, undefined) },
  { name: "Loreto House", city: "Kolkata", country: "India", ranking: 242, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Loreto House", 242, undefined) },
  { name: "Apeejay School, Park Street", city: "Kolkata", country: "India", ranking: 243, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Apeejay School, Park Street", 243, undefined) },
  { name: "Garden High School", city: "Kolkata", country: "India", ranking: 244, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Garden High School", 244, undefined) },
  { name: "Bhawanipur Gujarati Education Society School", city: "Kolkata", country: "India", ranking: 245, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Bhawanipur Gujarati Education Society School", 245, undefined) },
  
  // Jaipur Schools (246-260)
  { name: "Maharani Gayatri Devi Girls' School (MGD)", city: "Jaipur", country: "India", ranking: 246, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Maharani Gayatri Devi Girls' School (MGD)", 246, undefined) },
  { name: "The Palace School", city: "Jaipur", country: "India", ranking: 247, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("The Palace School", 247, undefined) },
  { name: "India International School (IIS)", city: "Jaipur", country: "India", ranking: 248, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("India International School (IIS)", 248, undefined) },
  { name: "Delhi Public School (DPS) Jaipur", city: "Jaipur", country: "India", ranking: 249, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Jaipur", 249, getBoardType("CBSE")) },
  { name: "Sanskar School, Sirsi Road", city: "Jaipur", country: "India", ranking: 250, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Sanskar School, Sirsi Road", 250, undefined) },
  { name: "St. Xavier's Senior Secondary School", city: "Jaipur", country: "India", ranking: 251, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("St. Xavier's Senior Secondary School", 251, undefined) },
  { name: "Vidya Ashram School", city: "Jaipur", country: "India", ranking: 252, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("Vidya Ashram School", 252, undefined) },
  { name: "Neerja Modi School", city: "Jaipur", country: "India", ranking: 253, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("Neerja Modi School", 253, undefined) },
  { name: "Jayshree Periwal International School (JPIS)", city: "Jaipur", country: "India", ranking: 254, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Jayshree Periwal International School (JPIS)", 254, undefined) },
  { name: "MGM Senior Secondary School", city: "Jaipur", country: "India", ranking: 255, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("MGM Senior Secondary School", 255, undefined) },
  { name: "Subodh Public School", city: "Jaipur", country: "India", ranking: 256, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Subodh Public School", 256, undefined) },
  { name: "Imperial Public School", city: "Jaipur", country: "India", ranking: 257, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Imperial Public School", 257, undefined) },
  { name: "Tagore International School", city: "Jaipur", country: "India", ranking: 258, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Tagore International School", 258, undefined) },
  { name: "Maharaja Sawai Man Singh Vidyalaya (MMS)", city: "Jaipur", country: "India", ranking: 259, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Maharaja Sawai Man Singh Vidyalaya (MMS)", 259, undefined) },
  { name: "Seedling Public School", city: "Jaipur", country: "India", ranking: 260, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Seedling Public School", 260, undefined) },
  
  // Kochi Schools (261-275)
  { name: "Global Public School, Thiruvaniyoor", city: "Kochi", country: "India", ranking: 261, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Global Public School, Thiruvaniyoor", 261, undefined) },
  { name: "Rajagiri Public School, Kalamassery", city: "Kochi", country: "India", ranking: 262, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Rajagiri Public School, Kalamassery", 262, undefined) },
  { name: "Rajagiri Christu Jayanthi Public School", city: "Kochi", country: "India", ranking: 263, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Rajagiri Christu Jayanthi Public School", 263, undefined) },
  { name: "Navy Children School, Kochi", city: "Kochi", country: "India", ranking: 264, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Navy Children School, Kochi", 264, undefined) },
  { name: "Choice School, Tripunithura", city: "Kochi", country: "India", ranking: 265, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Choice School, Tripunithura", 265, undefined) },
  { name: "Greets Public School", city: "Kochi", country: "India", ranking: 266, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Greets Public School", 266, undefined) },
  { name: "St. Teresa's CGHSS", city: "Kochi", country: "India", ranking: 267, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("St. Teresa's CGHSS", 267, undefined) },
  { name: "Assisi Vidyaniketan Public School", city: "Kochi", country: "India", ranking: 268, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("Assisi Vidyaniketan Public School", 268, undefined) },
  { name: "Toc H Public School, Vyttila", city: "Kochi", country: "India", ranking: 269, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("Toc H Public School, Vyttila", 269, undefined) },
  { name: "Bhavans Vidya Mandir (Elamakkara)", city: "Kochi", country: "India", ranking: 270, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Bhavans Vidya Mandir (Elamakkara)", 270, undefined) },
  { name: "Bhavans Vidya Mandir (Girinagar)", city: "Kochi", country: "India", ranking: 271, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Bhavans Vidya Mandir (Girinagar)", 271, undefined) },
  { name: "Chinmaya Vidyalaya, Vaduthala", city: "Kochi", country: "India", ranking: 272, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Chinmaya Vidyalaya, Vaduthala", 272, undefined) },
  { name: "Kendriya Vidyalaya Naval Base", city: "Kochi", country: "India", ranking: 273, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Kendriya Vidyalaya Naval Base", 273, undefined) },
  { name: "Gregorian Public School, Maradu", city: "Kochi", country: "India", ranking: 274, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("Gregorian Public School, Maradu", 274, undefined) },
  { name: "Orchids The International School", city: "Kochi", country: "India", ranking: 275, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Orchids The International School", 275, undefined) },
  
  // Indore Schools (276-290)
  { name: "The Daly College, Indore", city: "Indore", country: "India", ranking: 276, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("The Daly College, Indore", 276, undefined) },
  { name: "Indore Public School (IPS)", city: "Indore", country: "India", ranking: 277, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Indore Public School (IPS)", 277, undefined) },
  { name: "Choithram School", city: "Indore", country: "India", ranking: 278, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Choithram School", 278, undefined) },
  { name: "Emerald Heights International School", city: "Indore", country: "India", ranking: 279, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Emerald Heights International School", 279, undefined) },
  { name: "Delhi Public School (DPS) Indore", city: "Indore", country: "India", ranking: 280, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Indore", 280, getBoardType("CBSE")) },
  { name: "Shri Satya Sai Vidya Vihar", city: "Indore", country: "India", ranking: 281, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Shri Satya Sai Vidya Vihar", 281, undefined) },
  { name: "St. Paul Higher Secondary School", city: "Indore", country: "India", ranking: 282, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(7), score: getRealisticScore(7, getAccreditationLevel(7)), focusAreas: getRealisticFocusAreas("St. Paul Higher Secondary School", 282, undefined) },
  { name: "St. Raphael's Girls School", city: "Indore", country: "India", ranking: 283, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(8), score: getRealisticScore(8, getAccreditationLevel(8)), focusAreas: getRealisticFocusAreas("St. Raphael's Girls School", 283, undefined) },
  { name: "New Digamber Public School (NDPS)", city: "Indore", country: "India", ranking: 284, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(9), score: getRealisticScore(9, getAccreditationLevel(9)), focusAreas: getRealisticFocusAreas("New Digamber Public School (NDPS)", 284, undefined) },
  { name: "Sri Sathya Sai Vidya Vihar", city: "Indore", country: "India", ranking: 285, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(10), score: getRealisticScore(10, getAccreditationLevel(10)), focusAreas: getRealisticFocusAreas("Sri Sathya Sai Vidya Vihar", 285, undefined) },
  { name: "Medi-Caps International School", city: "Indore", country: "India", ranking: 286, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(11), score: getRealisticScore(11, getAccreditationLevel(11)), focusAreas: getRealisticFocusAreas("Medi-Caps International School", 286, undefined) },
  { name: "Agarwal Public School", city: "Indore", country: "India", ranking: 287, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(12), score: getRealisticScore(12, getAccreditationLevel(12)), focusAreas: getRealisticFocusAreas("Agarwal Public School", 287, undefined) },
  { name: "Laurels School International", city: "Indore", country: "India", ranking: 288, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(13), score: getRealisticScore(13, getAccreditationLevel(13)), focusAreas: getRealisticFocusAreas("Laurels School International", 288, undefined) },
  { name: "The Shishukunj International School", city: "Indore", country: "India", ranking: 289, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(14), score: getRealisticScore(14, getAccreditationLevel(14)), focusAreas: getRealisticFocusAreas("The Shishukunj International School", 289, undefined) },
  { name: "Vibgyor High School", city: "Indore", country: "India", ranking: 290, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(15), score: getRealisticScore(15, getAccreditationLevel(15)), focusAreas: getRealisticFocusAreas("Vibgyor High School", 290, undefined) },
  
  // Surat Schools (291-296)
  { name: "Fountainhead School", city: "Surat", country: "India", ranking: 291, institutionType: "School", subType: getBoardType("IB/IGCSE"), accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Fountainhead School", 291, getBoardType("IB/IGCSE")) },
  { name: "Lourdes Convent High School", city: "Surat", country: "India", ranking: 292, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Lourdes Convent High School", 292, undefined) },
  { name: "Delhi Public School (DPS) Surat", city: "Surat", country: "India", ranking: 293, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Surat", 293, getBoardType("CBSE")) },
  { name: "Essar International School", city: "Surat", country: "India", ranking: 294, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Essar International School", 294, undefined) },
  { name: "Tapti Valley International School", city: "Surat", country: "India", ranking: 295, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Tapti Valley International School", 295, undefined) },
  { name: "Podar International School", city: "Surat", country: "India", ranking: 296, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Podar International School", 296, undefined) },
  
  // Lucknow Schools (297-302)
  { name: "City Montessori School (CMS), Gomti Nagar", city: "Lucknow", country: "India", ranking: 297, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("City Montessori School (CMS), Gomti Nagar", 297, undefined) },
  { name: "La Martiniere College", city: "Lucknow", country: "India", ranking: 298, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("La Martiniere College", 298, undefined) },
  { name: "La Martiniere Girls' College", city: "Lucknow", country: "India", ranking: 299, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("La Martiniere Girls' College", 299, undefined) },
  { name: "Delhi Public School (DPS) Eldeco", city: "Lucknow", country: "India", ranking: 300, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Eldeco", 300, getBoardType("CBSE")) },
  { name: "Amity International School", city: "Lucknow", country: "India", ranking: 301, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Amity International School", 301, undefined) },
  { name: "Study Hall School", city: "Lucknow", country: "India", ranking: 302, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Study Hall School", 302, undefined) },
  
  // Chandigarh Schools (303-308)
  { name: "Carmel Convent School", city: "Chandigarh", country: "India", ranking: 303, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Carmel Convent School", 303, undefined) },
  { name: "St. John's High School", city: "Chandigarh", country: "India", ranking: 304, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("St. John's High School", 304, undefined) },
  { name: "Sacred Heart Senior Secondary School", city: "Chandigarh", country: "India", ranking: 305, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Sacred Heart Senior Secondary School", 305, undefined) },
  { name: "Delhi Public School (DPS) Chandigarh", city: "Chandigarh", country: "India", ranking: 306, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Chandigarh", 306, getBoardType("CBSE")) },
  { name: "Bhartiya Vidya Bhavan Vidyalaya", city: "Chandigarh", country: "India", ranking: 307, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Bhartiya Vidya Bhavan Vidyalaya", 307, undefined) },
  { name: "Vivek High School", city: "Chandigarh", country: "India", ranking: 308, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Vivek High School", 308, undefined) },
  
  // Visakhapatnam Schools (309-314)
  { name: "Delhi Public School (DPS) Vizag", city: "Visakhapatnam", country: "India", ranking: 309, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Vizag", 309, getBoardType("CBSE")) },
  { name: "Timpany School (Waltair)", city: "Visakhapatnam", country: "India", ranking: 310, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Timpany School (Waltair)", 310, undefined) },
  { name: "Visakha Valley School", city: "Visakhapatnam", country: "India", ranking: 311, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Visakha Valley School", 311, undefined) },
  { name: "Sri Prakash Vidyaniketan", city: "Visakhapatnam", country: "India", ranking: 312, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Sri Prakash Vidyaniketan", 312, undefined) },
  { name: "Navy Children School, Vizag", city: "Visakhapatnam", country: "India", ranking: 313, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Navy Children School, Vizag", 313, undefined) },
  { name: "Bhashyam Blooms / Olympiad School", city: "Visakhapatnam", country: "India", ranking: 314, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Bhashyam Blooms / Olympiad School", 314, undefined) },
  
  // Vijayawada Schools (315-320)
  { name: "Narayana e-Techno School", city: "Vijayawada", country: "India", ranking: 315, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Narayana e-Techno School", 315, undefined) },
  { name: "Sri Chaitanya School", city: "Vijayawada", country: "India", ranking: 316, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Sri Chaitanya School", 316, undefined) },
  { name: "Atkinson Senior Secondary School", city: "Vijayawada", country: "India", ranking: 317, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Atkinson Senior Secondary School", 317, undefined) },
  { name: "Delhi Public School (DPS) Vijayawada", city: "Vijayawada", country: "India", ranking: 318, institutionType: "School", subType: getBoardType("CBSE"), accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Delhi Public School (DPS) Vijayawada", 318, getBoardType("CBSE")) },
  { name: "Kennedy High School", city: "Vijayawada", country: "India", ranking: 319, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Kennedy High School", 319, undefined) },
  { name: "NSM Public School", city: "Vijayawada", country: "India", ranking: 320, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("NSM Public School", 320, undefined) },
  
  // Kakinada Schools (321-326)
  { name: "Narayana e-Techno School", city: "Kakinada", country: "India", ranking: 321, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("Narayana e-Techno School", 321, undefined) },
  { name: "Sri Chaitanya Techno School", city: "Kakinada", country: "India", ranking: 322, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Sri Chaitanya Techno School", 322, undefined) },
  { name: "Ashram Public School", city: "Kakinada", country: "India", ranking: 323, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Ashram Public School", 323, undefined) },
  { name: "Bhashyam Public School", city: "Kakinada", country: "India", ranking: 324, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Bhashyam Public School", 324, undefined) },
  { name: "Johnson Grammar School (IGCSE)", city: "Kakinada", country: "India", ranking: 325, institutionType: "School", subType: getBoardType("IGCSE"), accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Johnson Grammar School (IGCSE)", 325, getBoardType("IGCSE")) },
  { name: "SPPS (Sasi Public School)", city: "Kakinada", country: "India", ranking: 326, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("SPPS (Sasi Public School)", 326, undefined) },
  
  // Rajahmundry Schools (327-332)
  { name: "GIET School", city: "Rajahmundry", country: "India", ranking: 327, institutionType: "School", subType: getBoardType("IGCSE/CBSE"), accreditationLevel: getAccreditationLevel(1), score: getRealisticScore(1, getAccreditationLevel(1)), focusAreas: getRealisticFocusAreas("GIET School", 327, getBoardType("IGCSE/CBSE")) },
  { name: "Narayana e-Techno School", city: "Rajahmundry", country: "India", ranking: 328, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(2), score: getRealisticScore(2, getAccreditationLevel(2)), focusAreas: getRealisticFocusAreas("Narayana e-Techno School", 328, undefined) },
  { name: "Sri Chaitanya Techno School", city: "Rajahmundry", country: "India", ranking: 329, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(3), score: getRealisticScore(3, getAccreditationLevel(3)), focusAreas: getRealisticFocusAreas("Sri Chaitanya Techno School", 329, undefined) },
  { name: "Bhashyam Public School", city: "Rajahmundry", country: "India", ranking: 330, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(4), score: getRealisticScore(4, getAccreditationLevel(4)), focusAreas: getRealisticFocusAreas("Bhashyam Public School", 330, undefined) },
  { name: "Tirumala Public School", city: "Rajahmundry", country: "India", ranking: 331, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(5), score: getRealisticScore(5, getAccreditationLevel(5)), focusAreas: getRealisticFocusAreas("Tirumala Public School", 331, undefined) },
  { name: "Vignan School", city: "Rajahmundry", country: "India", ranking: 332, institutionType: "School", subType: undefined, accreditationLevel: getAccreditationLevel(6), score: getRealisticScore(6, getAccreditationLevel(6)), focusAreas: getRealisticFocusAreas("Vignan School", 332, undefined) },
];

// Process ranking data: Calculate national rankings and reclassify tiers
const processRankingData = (): InstitutionRanking[] => {
  // Calculate scores for all schools if not already set
  const processedData = initialRankingData.map((institution) => ({
    ...institution,
    score: institution.score || getRealisticScore(institution.ranking, institution.accreditationLevel),
  }));

  // Sort by score (high to low) to calculate national rankings
  processedData.sort((a, b) => (b.score || 0) - (a.score || 0));
  
  const totalSchools = processedData.length;
  
  // Assign national rankings and reclassify tiers
  processedData.forEach((institution, index) => {
    institution.nationalRanking = index + 1;
    institution.accreditationLevel = getAccreditationLevelByNationalRank(index + 1, totalSchools);
  });

  // Sort back by original ranking (city-based) for display
  processedData.sort((a, b) => a.ranking - b.ranking);
  
  return processedData;
};

const rankingData = processRankingData();

const Rankings = () => {
  const navigate = useNavigate();
  const [institutionTypeFilter, setInstitutionTypeFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const uniqueCities = useMemo(() => {
    const cities = Array.from(new Set(rankingData.map((institution) => institution.city)));
    cities.sort((a, b) => a.localeCompare(b));
    return cities;
  }, []);

  const filteredInstitutions = useMemo(() => {
    const filtered = rankingData
      .filter((institution) => (institutionTypeFilter === "all" ? true : institution.institutionType === institutionTypeFilter))
      .filter((institution) => (cityFilter === "all" ? true : institution.city === cityFilter))
      .filter((institution) =>
        institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.city.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    
    // Sort by national ranking (if available) or score, then limit to top 5
    const sorted = filtered.sort((a, b) => {
      // Prioritize national ranking if available, otherwise use score
      if (a.nationalRanking && b.nationalRanking) {
        return a.nationalRanking - b.nationalRanking;
      }
      if (a.score && b.score) {
        return b.score - a.score; // Higher score = better
      }
      return a.ranking - b.ranking; // Fallback to city ranking
    });
    
    // Limit to top 5 schools on this page
    return sorted.slice(0, 5);
  }, [institutionTypeFilter, cityFilter, searchTerm]);

  // Export to CSV function
  const exportToCSV = () => {
    const headers = ["Rank", "School Name", "City", "Country", "Type", "Board", "Accreditation Level", "Focus Areas"];
    const csvRows = [headers.join(",")];
    
    filteredInstitutions.forEach((institution) => {
      const row = [
        institution.ranking,
        `"${institution.name}"`,
        institution.city,
        institution.country,
        institution.institutionType,
        institution.subType || "",
        institution.accreditationLevel,
        `"${institution.focusAreas.join("; ")}"`,
      ];
      csvRows.push(row.join(","));
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `school-rankings-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navigation />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-14">
            <header className="text-center space-y-4">
              <Badge className="px-5 py-2 text-[0.65rem] uppercase tracking-[0.35em] bg-gold/10 text-gold border border-gold/40">
                GTAP Rankings
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold">
                Leading GTAP Accredited Institutions <span className="text-gradient-gold">Across India</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Discover top-performing schools across India. View the top 5 ranked institutions below, or click "View Full List" to see all {rankingData.length} schools.
              </p>
            </header>

            <Card className="p-6 md:p-8 shadow-premium border-border/50 bg-card/60 backdrop-blur space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters & Search</h3>
                {filteredInstitutions.length > 0 && (
                  <Button
                    onClick={exportToCSV}
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Filter by Type</label>
                  <Select value={institutionTypeFilter} onValueChange={setInstitutionTypeFilter}>
                    <SelectTrigger className="bg-background/60">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="School">Schools</SelectItem>
                      <SelectItem value="College">Colleges</SelectItem>
                      <SelectItem value="University">Universities</SelectItem>
                      <SelectItem value="Coaching Institute">Coaching Institutes</SelectItem>
                      <SelectItem value="EdTech Platform">EdTech Platforms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Filter by City</label>
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="bg-background/60">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {uniqueCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium text-muted-foreground">
                    Search Institution or City
                  </label>
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="e.g., Aurora Heights or Mumbai"
                    className="bg-background/60"
                  />
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              {filteredInstitutions.length === 0 ? (
                <Card className="p-10 text-center border-dashed border-border/60 bg-card/50 backdrop-blur">
                  <p className="text-muted-foreground">
                    No institutions found for the selected filters. Try adjusting the type, city, or search term.
                  </p>
                </Card>
              ) : (
                <>
                  {filteredInstitutions.map((institution) => (
                  <Card
                    key={institution.name}
                    className="p-6 md:p-8 shadow-premium border-border/40 bg-card/70 backdrop-blur transition-shadow hover:shadow-glow"
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
                            <Award className="h-4 w-4" />
                            Rank #{institution.nationalRanking || institution.ranking}
                          </div>
                          <Badge variant="outline" className="border-blue-500/40 text-blue-600 text-xs">
                            {institution.institutionType}
                          </Badge>
                          {institution.subType && (
                            <Badge variant="outline" className="border-purple-500/40 text-purple-600 text-xs">
                              {institution.subType}
                            </Badge>
                          )}
                        </div>
                        <h2 className="text-2xl font-serif font-semibold">{institution.name}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {institution.city}, {institution.country}
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Accreditation</p>
                        <p className="text-xl font-semibold text-gradient-gold">{institution.accreditationLevel}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {institution.focusAreas.map((area) => (
                        <Badge key={area} variant="outline" className="border-gold/40 text-xs uppercase tracking-wide">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                  ))}
                  {filteredInstitutions.length === 5 && (
                    <Card className="p-6 text-center border-dashed border-border/60 bg-card/50 backdrop-blur">
                      <p className="text-muted-foreground mb-4">
                        Showing top 5 schools. View all {rankingData.length} schools in the full rankings.
                      </p>
                    </Card>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-center pt-8">
              <Button
                onClick={() => navigate("/full-rankings")}
                size="lg"
                className="gradient-gold text-primary font-semibold px-8 hover:opacity-90 transition-opacity shadow-glow"
              >
                View Full List ({rankingData.length} Schools)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rankings;

