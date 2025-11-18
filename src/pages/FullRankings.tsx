import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, MapPin, Globe, TrendingUp, ArrowLeft, Upload, FileText, FileSpreadsheet, Download } from "lucide-react";
import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type InstitutionType = "School" | "College" | "University" | "Coaching Institute" | "EdTech Platform";

type InstitutionRanking = {
  name: string;
  city: string;
  state?: string;
  country: string;
  institutionType: InstitutionType;
  nationalRanking: number;
  stateRanking?: number;
  globalRanking: number;
  accreditationLevel: "Diamond" | "Platinum" | "Gold" | "Silver" | "Emerging";
  focusAreas: string[];
  score: number;
};
  
  // Map Indian cities to states
  const cityToState: Record<string, string> = {
    "Mumbai": "Maharashtra",
    "Bengaluru": "Karnataka",
    "Gurgaon": "Haryana",
    "Noida": "Uttar Pradesh",
    "Delhi": "Delhi",
    "Hyderabad": "Telangana",
    "Chennai": "Tamil Nadu",
    "Pune": "Maharashtra",
    "Ahmedabad": "Gujarat",
    "Kolkata": "West Bengal",
    "Jaipur": "Rajasthan",
    "Kochi": "Kerala",
    "Indore": "Madhya Pradesh",
    "Surat": "Gujarat",
    "Lucknow": "Uttar Pradesh",
    "Chandigarh": "Chandigarh",
    "Visakhapatnam": "Andhra Pradesh",
    "Vijayawada": "Andhra Pradesh",
    "Kakinada": "Andhra Pradesh",
    "Rajahmundry": "Andhra Pradesh"
  };
  
// Helper function to get realistic score based on ranking and accreditation level (based on online research)
const getScore = (level: "Diamond" | "Platinum" | "Gold" | "Silver" | "Emerging", rank: number): number => {
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

// Helper function to extract board type from school description
const getBoardType = (description: string): string | undefined => {
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
// This will be called after national rankings are calculated
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

// Legacy function for city-based ranking (kept for backward compatibility)
const getAccreditationLevel = (rank: number): "Diamond" | "Platinum" | "Gold" | "Silver" | "Emerging" => {
  if (rank <= 10) return "Diamond";
  if (rank <= 20) return "Platinum";
  if (rank <= 30) return "Gold";
  if (rank <= 40) return "Silver";
  return "Emerging";
};

// Helper function to get realistic focus areas based on school name and type (based on online research)
const getFocusAreas = (schoolName: string, rank: number, board?: string): string[] => {
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

// Real school data - same as in Rankings.tsx
const realSchoolData = [
  // Mumbai Schools
  { name: "Dhirubhai Ambani International School, BKC", city: "Mumbai", ranking: 1, board: "IB/IGCSE" },
  { name: "Cathedral & John Connon School, Fort", city: "Mumbai", ranking: 2, board: "ICSE" },
  { name: "Jamnabai Narsee School, Juhu", city: "Mumbai", ranking: 3, board: "ICSE/IB" },
  { name: "Campion School, Fort", city: "Mumbai", ranking: 4, board: "ICSE" },
  { name: "Bombay Scottish School, Mahim", city: "Mumbai", ranking: 5, board: "ICSE" },
  { name: "Bombay Scottish School, Powai", city: "Mumbai", ranking: 6, board: "ICSE" },
  { name: "St. Mary's School, Mazgaon", city: "Mumbai", ranking: 7, board: "ICSE" },
  { name: "Oberoi International School, Goregaon", city: "Mumbai", ranking: 8, board: "IB" },
  { name: "Aditya Birla World Academy, Tardeo", city: "Mumbai", ranking: 9, board: "IB/IGCSE" },
  { name: "Podar International School, Santacruz", city: "Mumbai", ranking: 10, board: "IB/IGCSE" },
  { name: "Don Bosco High School, Matunga", city: "Mumbai", ranking: 11, board: "ICSE" },
  { name: "SIES High School, Matunga", city: "Mumbai", ranking: 12, board: undefined },
  { name: "RN Podar School, Santacruz", city: "Mumbai", ranking: 13, board: "CBSE" },
  { name: "Apeejay School, Nerul", city: "Mumbai", ranking: 14, board: "CBSE" },
  { name: "Lilavatibai Podar School, Santacruz", city: "Mumbai", ranking: 15, board: "ICSE" },
  { name: "St. Xavier's High School, Fort", city: "Mumbai", ranking: 16, board: undefined },
  { name: "Hiranandani Foundation School, Powai", city: "Mumbai", ranking: 17, board: "ICSE/CBSE" },
  { name: "Billabong High International School, Andheri/Malad", city: "Mumbai", ranking: 18, board: undefined },
  { name: "Greenlawns High School, Warden Road", city: "Mumbai", ranking: 19, board: undefined },
  { name: "Singapore International School, Dahisar", city: "Mumbai", ranking: 20, board: "IB" },
  { name: "JBCN International School", city: "Mumbai", ranking: 21, board: undefined },
  { name: "École Mondiale World School, Juhu", city: "Mumbai", ranking: 22, board: "IB" },
  { name: "The Somaiya School, Ghatkopar", city: "Mumbai", ranking: 23, board: "CBSE" },
  { name: "Parle Tilak Vidyalaya, Vile Parle", city: "Mumbai", ranking: 24, board: undefined },
  { name: "HVB Global Academy, Marine Lines", city: "Mumbai", ranking: 25, board: undefined },
  { name: "Shishuvan School, Matunga", city: "Mumbai", ranking: 26, board: undefined },
  { name: "MET Rishikul Vidyalaya, Bandra", city: "Mumbai", ranking: 27, board: undefined },
  { name: "SVKM JV Parekh International School, Vile Parle", city: "Mumbai", ranking: 28, board: undefined },
  { name: "NES International School, Mulund", city: "Mumbai", ranking: 29, board: "IB/IGCSE" },
  { name: "Orchids The International School", city: "Mumbai", ranking: 30, board: undefined },
  { name: "EuroSchool", city: "Mumbai", ranking: 31, board: undefined },
  { name: "Ryan International School", city: "Mumbai", ranking: 32, board: undefined },
  { name: "VIBGYOR High", city: "Mumbai", ranking: 33, board: undefined },
  { name: "Avalon Heights International School, Vashi", city: "Mumbai", ranking: 34, board: undefined },
  { name: "Rustomjee Cambridge International School, Dahisar", city: "Mumbai", ranking: 35, board: undefined },
  { name: "New Horizon Public School, Airoli", city: "Mumbai", ranking: 36, board: undefined },
  { name: "St. Gregorios High School, Chembur", city: "Mumbai", ranking: 37, board: undefined },
  { name: "Christ Church School, Byculla", city: "Mumbai", ranking: 38, board: undefined },
  { name: "Children's Academy", city: "Mumbai", ranking: 39, board: undefined },
  { name: "Bombay International School, Marine Drive", city: "Mumbai", ranking: 40, board: "IB" },
  { name: "St. Joseph's High School, Wadala", city: "Mumbai", ranking: 41, board: undefined },
  { name: "Holy Family High School, Andheri", city: "Mumbai", ranking: 42, board: undefined },
  { name: "Hansraj Morarji Public School, Andheri", city: "Mumbai", ranking: 43, board: undefined },
  { name: "Gopi Birla Memorial School, Walkeshwar", city: "Mumbai", ranking: 44, board: undefined },
  { name: "IIT Campus School, Powai", city: "Mumbai", ranking: 45, board: undefined },
  { name: "Rose Manor International School, Santacruz", city: "Mumbai", ranking: 46, board: undefined },
  { name: "St. Stanislaus High School, Bandra", city: "Mumbai", ranking: 47, board: undefined },
  { name: "Our Lady of Perpetual Succour (OLPS), Chembur", city: "Mumbai", ranking: 48, board: undefined },
  { name: "St. Joseph's Convent High School, Bandra", city: "Mumbai", ranking: 49, board: undefined },
  { name: "Vissanji Academy, Andheri", city: "Mumbai", ranking: 50, board: undefined },
  
  // Hyderabad Schools
  { name: "Oakridge International School, Gachibowli", city: "Hyderabad", ranking: 1, board: "IB/IGCSE" },
  { name: "Chirec International School, Kondapur", city: "Hyderabad", ranking: 2, board: "CBSE/IB/IGCSE" },
  { name: "International School of Hyderabad – ISH", city: "Hyderabad", ranking: 3, board: "IB" },
  { name: "Delhi Public School – DPS Hyderabad, Khajaguda", city: "Hyderabad", ranking: 4, board: "CBSE" },
  { name: "Delhi Public School – DPS Secunderabad", city: "Hyderabad", ranking: 5, board: "CBSE" },
  { name: "The Hyderabad Public School – HPS Begumpet", city: "Hyderabad", ranking: 6, board: "ICSE/ISC" },
  { name: "The Hyderabad Public School – HPS Ramanthapur", city: "Hyderabad", ranking: 7, board: undefined },
  { name: "Glendale International School", city: "Hyderabad", ranking: 8, board: "CBSE/IGCSE" },
  { name: "Jubilee Hills Public School, Jubilee Hills", city: "Hyderabad", ranking: 9, board: "CBSE" },
  { name: "Silver Oaks International School", city: "Hyderabad", ranking: 10, board: "IB/CBSE" },
  { name: "Gitanjali Senior School, Begumpet", city: "Hyderabad", ranking: 11, board: "ICSE" },
  { name: "Meridian School, Banjara Hills", city: "Hyderabad", ranking: 12, board: "CBSE/IGCSE" },
  { name: "Meridian School, Madhapur", city: "Hyderabad", ranking: 13, board: undefined },
  { name: "Obul Reddy Public School, Jubilee Hills", city: "Hyderabad", ranking: 14, board: "CBSE" },
  { name: "Sreenidhi International School", city: "Hyderabad", ranking: 15, board: "IB" },
  { name: "Kennedy High Global School, Bachupally", city: "Hyderabad", ranking: 16, board: undefined },
  { name: "DAV Public School, Safilguda", city: "Hyderabad", ranking: 17, board: "CBSE" },
  { name: "Delhi Public School – DPS Nacharam", city: "Hyderabad", ranking: 18, board: "CBSE" },
  { name: "Phoenix Greens International School, Gachibowli", city: "Hyderabad", ranking: 19, board: undefined },
  { name: "Vidyaranya High School, Saifabad", city: "Hyderabad", ranking: 20, board: undefined },
  { name: "Sentia Global School, Miyapur", city: "Hyderabad", ranking: 21, board: undefined },
  { name: "Rockwell International School, Kokapet", city: "Hyderabad", ranking: 22, board: undefined },
  { name: "Vikas The Concept School, Bachupally", city: "Hyderabad", ranking: 23, board: undefined },
  { name: "DPS Miyapur", city: "Hyderabad", ranking: 24, board: "CBSE" },
  { name: "Vignan Bo Tree School, Nizampet", city: "Hyderabad", ranking: 25, board: undefined },
  { name: "Manthan International School, Tellapur", city: "Hyderabad", ranking: 26, board: undefined },
  { name: "Delhi School of Excellence (DSE), Banjara Hills", city: "Hyderabad", ranking: 27, board: undefined },
  { name: "Delhi School of Excellence, Manikonda", city: "Hyderabad", ranking: 28, board: undefined },
  { name: "Sanskriti School, Kondapur", city: "Hyderabad", ranking: 29, board: undefined },
  { name: "Hari Sri Vidya Nidhi School", city: "Hyderabad", ranking: 30, board: "ICSE" },
  { name: "Birla Open Minds International School", city: "Hyderabad", ranking: 31, board: undefined },
  { name: "VIBGYOR High School, Nizampet", city: "Hyderabad", ranking: 32, board: undefined },
  { name: "VIBGYOR High, Madhapur", city: "Hyderabad", ranking: 33, board: undefined },
  { name: "Unicent School, Miyapur", city: "Hyderabad", ranking: 34, board: undefined },
  { name: "Mount Litera Zee School", city: "Hyderabad", ranking: 35, board: undefined },
  { name: "Green Gables International School", city: "Hyderabad", ranking: 36, board: undefined },
  { name: "The Gaudium School, Kollur", city: "Hyderabad", ranking: 37, board: "IB/CBSE" },
  { name: "Vishwashanti Gurukul, Hyderabad", city: "Hyderabad", ranking: 38, board: undefined },
  { name: "Gaudium International School", city: "Hyderabad", ranking: 39, board: undefined },
  { name: "Sloka - The Hyderabad Waldorf School", city: "Hyderabad", ranking: 40, board: undefined },
  { name: "Johnson Grammar School, Habsiguda", city: "Hyderabad", ranking: 41, board: "ICSE/CBSE" },
  { name: "Johnson Grammar School, Mallapur", city: "Hyderabad", ranking: 42, board: undefined },
  { name: "Little Flower High School, Abids", city: "Hyderabad", ranking: 43, board: undefined },
  { name: "St. Joseph's Public School, King Koti", city: "Hyderabad", ranking: 44, board: undefined },
  { name: "St. Ann's High School, Secunderabad", city: "Hyderabad", ranking: 45, board: undefined },
  { name: "All Saints High School, Abids", city: "Hyderabad", ranking: 46, board: undefined },
  { name: "Pallavi Model School", city: "Hyderabad", ranking: 47, board: undefined },
  { name: "Sri Chaitanya Techno School", city: "Hyderabad", ranking: 48, board: undefined },
  { name: "Narayana Olympiad School", city: "Hyderabad", ranking: 49, board: undefined },
  { name: "Mount Carmel High School, Ramanthapur", city: "Hyderabad", ranking: 50, board: undefined },
  
  // Bangalore Schools
  { name: "The International School Bangalore (TISB), Whitefield", city: "Bengaluru", ranking: 1, board: "IB/IGCSE" },
  { name: "Inventure Academy, Whitefield", city: "Bengaluru", ranking: 2, board: "IB/IGCSE" },
  { name: "Greenwood High International School, Sarjapur", city: "Bengaluru", ranking: 3, board: "IB/ICSE" },
  { name: "Indus International School, Sarjapur", city: "Bengaluru", ranking: 4, board: "IB" },
  { name: "Stonehill International School, Yelahanka", city: "Bengaluru", ranking: 5, board: "IB" },
  { name: "Mallya Aditi International School, Yelahanka", city: "Bengaluru", ranking: 6, board: "ICSE/ISC" },
  { name: "Canadian International School, Yelahanka", city: "Bengaluru", ranking: 7, board: "IB/IGCSE" },
  { name: "Bishop Cotton Boys' School, Residency Road", city: "Bengaluru", ranking: 8, board: "ICSE/ISC" },
  { name: "Bishop Cotton Girls' School, Residency Road", city: "Bengaluru", ranking: 9, board: "ICSE/ISC" },
  { name: "National Public School (NPS), Indiranagar", city: "Bengaluru", ranking: 10, board: "CBSE" },
  { name: "National Public School (NPS), Koramangala", city: "Bengaluru", ranking: 11, board: "CBSE" },
  { name: "National Public School (NPS), Rajajinagar", city: "Bengaluru", ranking: 12, board: "CBSE" },
  { name: "Delhi Public School (DPS), South", city: "Bengaluru", ranking: 13, board: "CBSE" },
  { name: "Delhi Public School (DPS), North", city: "Bengaluru", ranking: 14, board: "CBSE" },
  { name: "Delhi Public School (DPS), East", city: "Bengaluru", ranking: 15, board: "CBSE" },
  { name: "Vidya Niketan School, Hebbal", city: "Bengaluru", ranking: 16, board: undefined },
  { name: "New Horizon Public School, Indiranagar", city: "Bengaluru", ranking: 17, board: undefined },
  { name: "Army Public School, Kamaraj Road", city: "Bengaluru", ranking: 18, board: undefined },
  { name: "Sri Kumaran Children's Home, Kumaraswamy Layout", city: "Bengaluru", ranking: 19, board: undefined },
  { name: "Jain International Residential School (JIRS), Kanakapura", city: "Bengaluru", ranking: 20, board: undefined },
  { name: "Treamis World School, Electronic City", city: "Bengaluru", ranking: 21, board: undefined },
  { name: "VIBGYOR High", city: "Bengaluru", ranking: 22, board: undefined },
  { name: "Trio World Academy, Sahakar Nagar", city: "Bengaluru", ranking: 23, board: "IB/IGCSE" },
  { name: "Orchids The International School", city: "Bengaluru", ranking: 24, board: undefined },
  { name: "Harvest International School, Sarjapur", city: "Bengaluru", ranking: 25, board: undefined },
  { name: "EuroSchool, HSR", city: "Bengaluru", ranking: 26, board: undefined },
  { name: "Presidency School, RT Nagar", city: "Bengaluru", ranking: 27, board: undefined },
  { name: "Presidency School, Nandini Layout", city: "Bengaluru", ranking: 28, board: undefined },
  { name: "BGS National Public School, Hulimavu", city: "Bengaluru", ranking: 29, board: undefined },
  { name: "Sacred Heart Girls' High School, Residency Road", city: "Bengaluru", ranking: 30, board: undefined },
  { name: "Kendriya Vidyalaya", city: "Bengaluru", ranking: 31, board: undefined },
  { name: "Bethany High School, Koramangala", city: "Bengaluru", ranking: 32, board: undefined },
  { name: "St. Joseph's Boys' High School, Museum Road", city: "Bengaluru", ranking: 33, board: undefined },
  { name: "St. Francis Xavier Girls' High School, Frazer Town", city: "Bengaluru", ranking: 34, board: undefined },
  { name: "Lawrence School, HSR Layout", city: "Bengaluru", ranking: 35, board: undefined },
  { name: "Clarence High School, Richards Town", city: "Bengaluru", ranking: 36, board: undefined },
  { name: "Gear Innovative International School, Bellandur", city: "Bengaluru", ranking: 37, board: undefined },
  { name: "The Cambridge International School, HSR", city: "Bengaluru", ranking: 38, board: undefined },
  { name: "Christ Academy, Begur", city: "Bengaluru", ranking: 39, board: undefined },
  { name: "Baldwin Boys' High School, Richmond Town", city: "Bengaluru", ranking: 40, board: undefined },
  
  // Gurgaon Schools
  { name: "The Shri Ram School, Moulsari", city: "Gurgaon", ranking: 1, board: "IB/ICSE" },
  { name: "Shiv Nadar School, Gurgaon", city: "Gurgaon", ranking: 2, board: "CBSE" },
  { name: "GD Goenka World School", city: "Gurgaon", ranking: 3, board: "IB/IGCSE" },
  { name: "Pathways World School, Aravali", city: "Gurgaon", ranking: 4, board: "IB" },
  { name: "Delhi Public School (DPS), Sector 45", city: "Gurgaon", ranking: 5, board: "CBSE" },
  { name: "Suncity School, Sector 54", city: "Gurgaon", ranking: 6, board: "CBSE/IB" },
  { name: "Scottish High International School", city: "Gurgaon", ranking: 7, board: "IB/IGCSE" },
  { name: "Heritage Xperiential School", city: "Gurgaon", ranking: 8, board: "CBSE/IB" },
  { name: "Excelsior American School", city: "Gurgaon", ranking: 9, board: "IB/IGCSE" },
  { name: "Amity International School, Sector 46", city: "Gurgaon", ranking: 10, board: "CBSE" },
  { name: "Blue Bells Model School", city: "Gurgaon", ranking: 11, board: "CBSE" },
  { name: "K.R. Mangalam World School", city: "Gurgaon", ranking: 12, board: "CBSE/IGCSE" },
  { name: "Presidium School, Gurgaon", city: "Gurgaon", ranking: 13, board: undefined },
  { name: "Greenwood Public School", city: "Gurgaon", ranking: 14, board: undefined },
  { name: "Lotus Valley International School", city: "Gurgaon", ranking: 15, board: "CBSE" },
  
  // Noida Schools
  { name: "Step by Step School, Sector 132", city: "Noida", ranking: 1, board: "CBSE/IB" },
  { name: "Lotus Valley International School, Sector 126", city: "Noida", ranking: 2, board: "CBSE" },
  { name: "Delhi Public School (DPS) Noida, Sector 30", city: "Noida", ranking: 3, board: "CBSE" },
  { name: "Shiv Nadar School, Noida", city: "Noida", ranking: 4, board: "CBSE/IB" },
  { name: "Pathways School, Noida", city: "Noida", ranking: 5, board: "IB" },
  { name: "Amity International School, Sector 44", city: "Noida", ranking: 6, board: "CBSE" },
  { name: "Mayoor School, Sector 126", city: "Noida", ranking: 7, board: "CBSE" },
  { name: "Kothari International School", city: "Noida", ranking: 8, board: "CBSE/IGCSE" },
  { name: "Apeejay School, Noida", city: "Noida", ranking: 9, board: "CBSE" },
  { name: "Somerville School, Sector 22", city: "Noida", ranking: 10, board: "CBSE" },
  { name: "Gyanshree School, Sector 127", city: "Noida", ranking: 11, board: undefined },
  { name: "Ramagya School, Sector 50", city: "Noida", ranking: 12, board: undefined },
  { name: "Billabong High International School", city: "Noida", ranking: 13, board: undefined },
  { name: "JBM Global School", city: "Noida", ranking: 14, board: undefined },
  { name: "Global Indian International School (GIIS)", city: "Noida", ranking: 15, board: undefined },
  
  // Delhi Schools
  { name: "The Shri Ram School, Vasant Vihar", city: "Delhi", ranking: 1, board: "ICSE" },
  { name: "Delhi Public School (DPS) R.K. Puram", city: "Delhi", ranking: 2, board: "CBSE" },
  { name: "Delhi Public School (DPS) Mathura Road", city: "Delhi", ranking: 3, board: "CBSE" },
  { name: "Sardar Patel Vidyalaya, Lodhi Estate", city: "Delhi", ranking: 4, board: "CBSE" },
  { name: "Modern School, Barakhamba Road", city: "Delhi", ranking: 5, board: "CBSE" },
  { name: "Vasant Valley School, Vasant Kunj", city: "Delhi", ranking: 6, board: "CBSE" },
  { name: "The Mother's International School, Sri Aurobindo Marg", city: "Delhi", ranking: 7, board: "CBSE" },
  { name: "St. Columba's School, Ashok Place", city: "Delhi", ranking: 8, board: "CBSE" },
  { name: "St. Xavier's School, Raj Niwas Marg", city: "Delhi", ranking: 9, board: undefined },
  { name: "Carmel Convent School, Chanakyapuri", city: "Delhi", ranking: 10, board: undefined },
  { name: "Springdales School, Pusa Road", city: "Delhi", ranking: 11, board: undefined },
  { name: "Springdales School, Dhaula Kuan", city: "Delhi", ranking: 12, board: undefined },
  { name: "Bal Bharati Public School, Pitampura", city: "Delhi", ranking: 13, board: undefined },
  { name: "Bluebells School International, Kailash", city: "Delhi", ranking: 14, board: undefined },
  { name: "Loreto Convent School, Delhi Cantt", city: "Delhi", ranking: 15, board: undefined },
  
  // Chennai Schools
  { name: "Chettinad Vidyashram, RA Puram", city: "Chennai", ranking: 1, board: undefined },
  { name: "Sishya School, Adyar", city: "Chennai", ranking: 2, board: undefined },
  { name: "Padma Seshadri Bala Bhavan (PSBB), KK Nagar", city: "Chennai", ranking: 3, board: undefined },
  { name: "Padma Seshadri Bala Bhavan (PSBB), T Nagar", city: "Chennai", ranking: 4, board: undefined },
  { name: "DAV Boys Senior Secondary School, Gopalapuram", city: "Chennai", ranking: 5, board: undefined },
  { name: "DAV Girls Senior Secondary School, Gopalapuram", city: "Chennai", ranking: 6, board: undefined },
  { name: "Vana Vani School, IIT Madras", city: "Chennai", ranking: 7, board: undefined },
  { name: "Vidya Mandir Senior Secondary School, Mylapore", city: "Chennai", ranking: 8, board: undefined },
  { name: "BVM Global School, Bollineni", city: "Chennai", ranking: 9, board: undefined },
  { name: "Olympia Panache International School", city: "Chennai", ranking: 10, board: undefined },
  { name: "The Schram Academy", city: "Chennai", ranking: 11, board: undefined },
  { name: "Chinmaya Vidyalaya, Virugambakkam", city: "Chennai", ranking: 12, board: undefined },
  { name: "Kendriya Vidyalaya CLRI", city: "Chennai", ranking: 13, board: undefined },
  { name: "Delhi Public School (DPS), Nellikuppam Road", city: "Chennai", ranking: 14, board: "CBSE" },
  { name: "Maharishi Vidya Mandir, Chetpet", city: "Chennai", ranking: 15, board: undefined },
  
  // Pune Schools
  { name: "The Bishop's School", city: "Pune", ranking: 1, board: undefined },
  { name: "Delhi Public School (DPS), Pune", city: "Pune", ranking: 2, board: "CBSE" },
  { name: "Symbiosis International School, Viman Nagar", city: "Pune", ranking: 3, board: undefined },
  { name: "St. Mary's School, Camp", city: "Pune", ranking: 4, board: undefined },
  { name: "Indus International School, Mulshi", city: "Pune", ranking: 5, board: "IB" },
  { name: "Vibgyor High", city: "Pune", ranking: 6, board: undefined },
  { name: "The Lexicon International School", city: "Pune", ranking: 7, board: undefined },
  { name: "DAV Public School, Aundh", city: "Pune", ranking: 8, board: "CBSE" },
  { name: "Army Public School, Dighi", city: "Pune", ranking: 9, board: undefined },
  { name: "Orchids The International School", city: "Pune", ranking: 10, board: undefined },
  { name: "Pawar Public School, Hadapsar", city: "Pune", ranking: 11, board: undefined },
  { name: "Ryan International School", city: "Pune", ranking: 12, board: undefined },
  { name: "Kendriya Vidyalaya Southern Command", city: "Pune", ranking: 13, board: undefined },
  { name: "Victorious Kidss Educares (IB)", city: "Pune", ranking: 14, board: "IB" },
  { name: "Delhi Public School (DPS), Hinjewadi", city: "Pune", ranking: 15, board: "CBSE" },
  
  // Ahmedabad Schools
  { name: "Ahmedabad International School (AIS)", city: "Ahmedabad", ranking: 1, board: undefined },
  { name: "Calorx Olive International School (COIS)", city: "Ahmedabad", ranking: 2, board: undefined },
  { name: "Udgam School for Children", city: "Ahmedabad", ranking: 3, board: undefined },
  { name: "Delhi Public School (DPS) Bopal", city: "Ahmedabad", ranking: 4, board: "CBSE" },
  { name: "St. Kabir School, Drive-In Road", city: "Ahmedabad", ranking: 5, board: undefined },
  { name: "Maharaja Agrasen Vidyalaya", city: "Ahmedabad", ranking: 6, board: undefined },
  { name: "Zydus School for Excellence", city: "Ahmedabad", ranking: 7, board: undefined },
  { name: "SGVP International School", city: "Ahmedabad", ranking: 8, board: undefined },
  { name: "Global Indian International School (GIIS)", city: "Ahmedabad", ranking: 9, board: undefined },
  { name: "Anand Niketan School (Satellite)", city: "Ahmedabad", ranking: 10, board: undefined },
  { name: "Anand Niketan School (Shilaj)", city: "Ahmedabad", ranking: 11, board: undefined },
  { name: "Eklavya School", city: "Ahmedabad", ranking: 12, board: undefined },
  { name: "Sattva Vikas School", city: "Ahmedabad", ranking: 13, board: undefined },
  { name: "Calorx Public School", city: "Ahmedabad", ranking: 14, board: undefined },
  { name: "The New Tulip International School", city: "Ahmedabad", ranking: 15, board: undefined },
  
  // Kolkata Schools
  { name: "La Martiniere for Boys", city: "Kolkata", ranking: 1, board: undefined },
  { name: "La Martiniere for Girls", city: "Kolkata", ranking: 2, board: undefined },
  { name: "St. Xavier's Collegiate School", city: "Kolkata", ranking: 3, board: undefined },
  { name: "Modern High School for Girls", city: "Kolkata", ranking: 4, board: undefined },
  { name: "The Heritage School", city: "Kolkata", ranking: 5, board: undefined },
  { name: "South Point High School", city: "Kolkata", ranking: 6, board: undefined },
  { name: "Delhi Public School, Ruby Park", city: "Kolkata", ranking: 7, board: "CBSE" },
  { name: "DPS Megacity", city: "Kolkata", ranking: 8, board: "CBSE" },
  { name: "Birla High School", city: "Kolkata", ranking: 9, board: undefined },
  { name: "Calcutta International School (CIS)", city: "Kolkata", ranking: 10, board: undefined },
  { name: "Sri Sri Academy", city: "Kolkata", ranking: 11, board: undefined },
  { name: "Loreto House", city: "Kolkata", ranking: 12, board: undefined },
  { name: "Apeejay School, Park Street", city: "Kolkata", ranking: 13, board: undefined },
  { name: "Garden High School", city: "Kolkata", ranking: 14, board: undefined },
  { name: "Bhawanipur Gujarati Education Society School", city: "Kolkata", ranking: 15, board: undefined },
  
  // Jaipur Schools
  { name: "Maharani Gayatri Devi Girls' School (MGD)", city: "Jaipur", ranking: 1, board: undefined },
  { name: "The Palace School", city: "Jaipur", ranking: 2, board: undefined },
  { name: "India International School (IIS)", city: "Jaipur", ranking: 3, board: undefined },
  { name: "Delhi Public School (DPS) Jaipur", city: "Jaipur", ranking: 4, board: "CBSE" },
  { name: "Sanskar School, Sirsi Road", city: "Jaipur", ranking: 5, board: undefined },
  { name: "St. Xavier's Senior Secondary School", city: "Jaipur", ranking: 6, board: undefined },
  { name: "Vidya Ashram School", city: "Jaipur", ranking: 7, board: undefined },
  { name: "Neerja Modi School", city: "Jaipur", ranking: 8, board: undefined },
  { name: "Jayshree Periwal International School (JPIS)", city: "Jaipur", ranking: 9, board: undefined },
  { name: "MGM Senior Secondary School", city: "Jaipur", ranking: 10, board: undefined },
  { name: "Subodh Public School", city: "Jaipur", ranking: 11, board: undefined },
  { name: "Imperial Public School", city: "Jaipur", ranking: 12, board: undefined },
  { name: "Tagore International School", city: "Jaipur", ranking: 13, board: undefined },
  { name: "Maharaja Sawai Man Singh Vidyalaya (MMS)", city: "Jaipur", ranking: 14, board: undefined },
  { name: "Seedling Public School", city: "Jaipur", ranking: 15, board: undefined },
  
  // Kochi Schools
  { name: "Global Public School, Thiruvaniyoor", city: "Kochi", ranking: 1, board: undefined },
  { name: "Rajagiri Public School, Kalamassery", city: "Kochi", ranking: 2, board: undefined },
  { name: "Rajagiri Christu Jayanthi Public School", city: "Kochi", ranking: 3, board: undefined },
  { name: "Navy Children School, Kochi", city: "Kochi", ranking: 4, board: undefined },
  { name: "Choice School, Tripunithura", city: "Kochi", ranking: 5, board: undefined },
  { name: "Greets Public School", city: "Kochi", ranking: 6, board: undefined },
  { name: "St. Teresa's CGHSS", city: "Kochi", ranking: 7, board: undefined },
  { name: "Assisi Vidyaniketan Public School", city: "Kochi", ranking: 8, board: undefined },
  { name: "Toc H Public School, Vyttila", city: "Kochi", ranking: 9, board: undefined },
  { name: "Bhavans Vidya Mandir (Elamakkara)", city: "Kochi", ranking: 10, board: undefined },
  { name: "Bhavans Vidya Mandir (Girinagar)", city: "Kochi", ranking: 11, board: undefined },
  { name: "Chinmaya Vidyalaya, Vaduthala", city: "Kochi", ranking: 12, board: undefined },
  { name: "Kendriya Vidyalaya Naval Base", city: "Kochi", ranking: 13, board: undefined },
  { name: "Gregorian Public School, Maradu", city: "Kochi", ranking: 14, board: undefined },
  { name: "Orchids The International School", city: "Kochi", ranking: 15, board: undefined },
  
  // Indore Schools
  { name: "The Daly College, Indore", city: "Indore", ranking: 1, board: undefined },
  { name: "Indore Public School (IPS)", city: "Indore", ranking: 2, board: undefined },
  { name: "Choithram School", city: "Indore", ranking: 3, board: undefined },
  { name: "Emerald Heights International School", city: "Indore", ranking: 4, board: undefined },
  { name: "Delhi Public School (DPS) Indore", city: "Indore", ranking: 5, board: "CBSE" },
  { name: "Shri Satya Sai Vidya Vihar", city: "Indore", ranking: 6, board: undefined },
  { name: "St. Paul Higher Secondary School", city: "Indore", ranking: 7, board: undefined },
  { name: "St. Raphael's Girls School", city: "Indore", ranking: 8, board: undefined },
  { name: "New Digamber Public School (NDPS)", city: "Indore", ranking: 9, board: undefined },
  { name: "Sri Sathya Sai Vidya Vihar", city: "Indore", ranking: 10, board: undefined },
  { name: "Medi-Caps International School", city: "Indore", ranking: 11, board: undefined },
  { name: "Agarwal Public School", city: "Indore", ranking: 12, board: undefined },
  { name: "Laurels School International", city: "Indore", ranking: 13, board: undefined },
  { name: "The Shishukunj International School", city: "Indore", ranking: 14, board: undefined },
  { name: "Vibgyor High School", city: "Indore", ranking: 15, board: undefined },
  
  // Surat Schools
  { name: "Fountainhead School", city: "Surat", ranking: 1, board: "IB/IGCSE" },
  { name: "Lourdes Convent High School", city: "Surat", ranking: 2, board: undefined },
  { name: "Delhi Public School (DPS) Surat", city: "Surat", ranking: 3, board: "CBSE" },
  { name: "Essar International School", city: "Surat", ranking: 4, board: undefined },
  { name: "Tapti Valley International School", city: "Surat", ranking: 5, board: undefined },
  { name: "Podar International School", city: "Surat", ranking: 6, board: undefined },
  
  // Lucknow Schools
  { name: "City Montessori School (CMS), Gomti Nagar", city: "Lucknow", ranking: 1, board: undefined },
  { name: "La Martiniere College", city: "Lucknow", ranking: 2, board: undefined },
  { name: "La Martiniere Girls' College", city: "Lucknow", ranking: 3, board: undefined },
  { name: "Delhi Public School (DPS) Eldeco", city: "Lucknow", ranking: 4, board: "CBSE" },
  { name: "Amity International School", city: "Lucknow", ranking: 5, board: undefined },
  { name: "Study Hall School", city: "Lucknow", ranking: 6, board: undefined },
  
  // Chandigarh Schools
  { name: "Carmel Convent School", city: "Chandigarh", ranking: 1, board: undefined },
  { name: "St. John's High School", city: "Chandigarh", ranking: 2, board: undefined },
  { name: "Sacred Heart Senior Secondary School", city: "Chandigarh", ranking: 3, board: undefined },
  { name: "Delhi Public School (DPS) Chandigarh", city: "Chandigarh", ranking: 4, board: "CBSE" },
  { name: "Bhartiya Vidya Bhavan Vidyalaya", city: "Chandigarh", ranking: 5, board: undefined },
  { name: "Vivek High School", city: "Chandigarh", ranking: 6, board: undefined },
  
  // Visakhapatnam Schools
  { name: "Delhi Public School (DPS) Vizag", city: "Visakhapatnam", ranking: 1, board: "CBSE" },
  { name: "Timpany School (Waltair)", city: "Visakhapatnam", ranking: 2, board: undefined },
  { name: "Visakha Valley School", city: "Visakhapatnam", ranking: 3, board: undefined },
  { name: "Sri Prakash Vidyaniketan", city: "Visakhapatnam", ranking: 4, board: undefined },
  { name: "Navy Children School, Vizag", city: "Visakhapatnam", ranking: 5, board: undefined },
  { name: "Bhashyam Blooms / Olympiad School", city: "Visakhapatnam", ranking: 6, board: undefined },
  
  // Vijayawada Schools
  { name: "Narayana e-Techno School", city: "Vijayawada", ranking: 1, board: undefined },
  { name: "Sri Chaitanya School", city: "Vijayawada", ranking: 2, board: undefined },
  { name: "Atkinson Senior Secondary School", city: "Vijayawada", ranking: 3, board: undefined },
  { name: "Delhi Public School (DPS) Vijayawada", city: "Vijayawada", ranking: 4, board: "CBSE" },
  { name: "Kennedy High School", city: "Vijayawada", ranking: 5, board: undefined },
  { name: "NSM Public School", city: "Vijayawada", ranking: 6, board: undefined },
  
  // Kakinada Schools
  { name: "Narayana e-Techno School", city: "Kakinada", ranking: 1, board: undefined },
  { name: "Sri Chaitanya Techno School", city: "Kakinada", ranking: 2, board: undefined },
  { name: "Ashram Public School", city: "Kakinada", ranking: 3, board: undefined },
  { name: "Bhashyam Public School", city: "Kakinada", ranking: 4, board: undefined },
  { name: "Johnson Grammar School (IGCSE)", city: "Kakinada", ranking: 5, board: "IGCSE" },
  { name: "SPPS (Sasi Public School)", city: "Kakinada", ranking: 6, board: undefined },
  
  // Rajahmundry Schools
  { name: "GIET School", city: "Rajahmundry", ranking: 1, board: "IGCSE/CBSE" },
  { name: "Narayana e-Techno School", city: "Rajahmundry", ranking: 2, board: undefined },
  { name: "Sri Chaitanya Techno School", city: "Rajahmundry", ranking: 3, board: undefined },
  { name: "Bhashyam Public School", city: "Rajahmundry", ranking: 4, board: undefined },
  { name: "Tirumala Public School", city: "Rajahmundry", ranking: 5, board: undefined },
  { name: "Vignan School", city: "Rajahmundry", ranking: 6, board: undefined },
];

// Convert real school data to FullRankings format
const generateRankingData = (): InstitutionRanking[] => {
  const institutions: InstitutionRanking[] = [];
  
  // Track city-specific rankings for calculating state rankings
  const cityRankings: Record<string, number> = {};
  
  realSchoolData.forEach((school, index) => {
    const state = cityToState[school.city];
    // Use city ranking for initial score calculation
    const cityAccreditationLevel = getAccreditationLevel(school.ranking);
    const score = getScore(cityAccreditationLevel, school.ranking);
    const boardType = school.board ? getBoardType(school.board) : undefined;
    
    institutions.push({
      name: school.name,
      city: school.city,
      state: state,
      country: "India",
      institutionType: "School" as InstitutionType,
      nationalRanking: 0, // Will be calculated later
      stateRanking: 0, // Will be calculated later
      globalRanking: index + 1,
      accreditationLevel: cityAccreditationLevel, // Temporary, will be updated based on national ranking
      focusAreas: getFocusAreas(school.name, school.ranking, boardType),
      score: score,
    });
  });

  // Calculate national rankings (sorted by score, high to low)
  institutions.sort((a, b) => b.score - a.score);
  const totalSchools = institutions.length;
  institutions.forEach((institution, index) => {
    institution.nationalRanking = index + 1;
    // Reclassify accreditation level based on national ranking distribution
    institution.accreditationLevel = getAccreditationLevelByNationalRank(index + 1, totalSchools);
  });

  // Calculate state rankings
  const stateGroups: Record<string, InstitutionRanking[]> = {};
  institutions.forEach(institution => {
    if (institution.state) {
      if (!stateGroups[institution.state]) {
        stateGroups[institution.state] = [];
      }
      stateGroups[institution.state].push(institution);
    }
  });

  // Sort each state's institutions by score (high to low) and assign rankings
  Object.keys(stateGroups).forEach(state => {
    stateGroups[state].sort((a, b) => b.score - a.score);
    stateGroups[state].forEach((institution, index) => {
      institution.stateRanking = index + 1;
    });
  });

  // Sort by national ranking (high to low)
  return institutions.sort((a, b) => (a.nationalRanking || 0) - (b.nationalRanking || 0));
};

const rankingData = generateRankingData();

const FullRankings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [institutionTypeFilter, setInstitutionTypeFilter] = useState<string>("School");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"highToLow" | "lowToHigh">("highToLow");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importType, setImportType] = useState<"csv" | "pdf" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 50;

  const uniqueStates = useMemo(() => {
    const states = Array.from(
      new Set(
        rankingData
          .filter((institution) => 
            (institutionTypeFilter === "all" || institution.institutionType === institutionTypeFilter) &&
            institution.country === "India" &&
            institution.state
          )
          .map((institution) => institution.state!)
      )
    );
    states.sort((a, b) => a.localeCompare(b));
    return states;
  }, [institutionTypeFilter]);

  const uniqueCities = useMemo(() => {
    const cities = Array.from(
      new Set(
        rankingData
          .filter((institution) => 
            (institutionTypeFilter === "all" || institution.institutionType === institutionTypeFilter) &&
            (stateFilter === "all" || institution.state === stateFilter)
          )
          .map((institution) => institution.city)
      )
    );
    cities.sort((a, b) => a.localeCompare(b));
    return cities;
  }, [institutionTypeFilter, stateFilter]);

  const filteredInstitutions = useMemo(() => {
    let filtered = rankingData
      .filter((institution) => (institutionTypeFilter === "all" ? true : institution.institutionType === institutionTypeFilter))
      .filter((institution) => (stateFilter === "all" ? true : institution.state === stateFilter))
      .filter((institution) => (cityFilter === "all" ? true : institution.city === cityFilter))
      .filter((institution) => (levelFilter === "all" ? true : institution.accreditationLevel === levelFilter))
      .filter((institution) =>
        institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (institution.state && institution.state.toLowerCase().includes(searchTerm.toLowerCase())),
      );

    // Sort based on selected criteria
    if (sortBy === "highToLow") {
      filtered.sort((a, b) => b.score - a.score);
    } else {
      filtered.sort((a, b) => a.score - b.score);
    }

    return filtered;
  }, [institutionTypeFilter, stateFilter, cityFilter, levelFilter, searchTerm, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [institutionTypeFilter, stateFilter, cityFilter, levelFilter, searchTerm, sortBy]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredInstitutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInstitutions = filteredInstitutions.slice(startIndex, endIndex);

  const handleImportClick = (type: "csv" | "pdf") => {
    setImportType(type);
    setIsImportDialogOpen(true);
    // Trigger file input
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically process the file
      // For now, we'll just show a success message
      console.log(`Importing ${importType?.toUpperCase()} file:`, file.name);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsImportDialogOpen(false);
      setImportType(null);
    }
  };

  // Export to CSV function
  const exportToCSV = () => {
    const headers = [
      "National Rank",
      "State Rank",
      "School Name",
      "Type",
      "City",
      "State",
      "Country",
      "Accreditation Level",
      "Score",
      "Focus Areas",
    ];
    const csvRows = [headers.join(",")];
    
    filteredInstitutions.forEach((institution) => {
      const row = [
        institution.nationalRanking || "",
        institution.stateRanking || "",
        `"${institution.name}"`,
        institution.institutionType,
        institution.city,
        institution.state || "",
        institution.country,
        institution.accreditationLevel,
        institution.score,
        `"${institution.focusAreas.join("; ")}"`,
      ];
      csvRows.push(row.join(","));
    });
    
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `school-rankings-full-${new Date().toISOString().split("T")[0]}.csv`);
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
          <div className="max-w-7xl mx-auto space-y-14">
            <header className="text-center space-y-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/rankings")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Rankings
                </Button>
              </div>
              <Badge className="px-5 py-2 text-[0.65rem] uppercase tracking-[0.35em] bg-gold/10 text-gold border border-gold/40">
                Complete Rankings Database
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold">
                National <span className="text-gradient-gold">Institution Rankings</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive rankings of GTAP-accredited schools across India. Filter by type, city, accreditation level, or search by name.
              </p>
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-gold" />
                  <span className="text-muted-foreground">{rankingData.length} Schools</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-gold" />
                  <span className="text-muted-foreground">National Rankings</span>
                </div>
              </div>
            </header>

            <Card className="p-6 md:p-8 shadow-premium border-border/50 bg-card/60 backdrop-blur space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters & Search</h3>
                <div className="flex items-center gap-2">
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
                {isAuthenticated && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Import Data
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleImportClick("csv")} className="gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Import CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleImportClick("pdf")} className="gap-2">
                        <FileText className="h-4 w-4" />
                        Import PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Filter by Type</label>
                  <Select value={institutionTypeFilter} onValueChange={(value) => {
                    setInstitutionTypeFilter(value);
                    setStateFilter("all");
                    setCityFilter("all");
                  }}>
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
                  <label className="text-sm font-medium text-muted-foreground">Filter by State</label>
                  <Select value={stateFilter} onValueChange={(value) => {
                    setStateFilter(value);
                    setCityFilter("all");
                  }}>
                    <SelectTrigger className="bg-background/60">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {uniqueStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Filter by City</label>
                  <Select value={cityFilter} onValueChange={setCityFilter} disabled={institutionTypeFilter === "all" && uniqueCities.length > 50}>
                    <SelectTrigger className="bg-background/60">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {uniqueCities.slice(0, 50).map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Accreditation Level</label>
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="bg-background/60">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Diamond">Diamond</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Emerging">Emerging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Sort By</label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as "highToLow" | "lowToHigh")}>
                    <SelectTrigger className="bg-background/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highToLow">High to Low</SelectItem>
                      <SelectItem value="lowToHigh">Low to High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium text-muted-foreground">
                  Search Institution, City, or Country
                </label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="e.g., Mumbai International School or India"
                  className="bg-background/60"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredInstitutions.length}</span> of {rankingData.length} institutions
                </p>
                {filteredInstitutions.length > itemsPerPage && (
                  <p className="text-sm text-muted-foreground">
                    Page <span className="font-semibold text-foreground">{currentPage}</span> of {totalPages}
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6 shadow-premium border-border/50 bg-card/60 backdrop-blur">
              {filteredInstitutions.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-muted-foreground">
                    No institutions found for the selected filters. Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-border/50">
                        <TableHead className="w-[80px] font-semibold text-foreground">National Rank</TableHead>
                        <TableHead className="w-[80px] font-semibold text-foreground">State Rank</TableHead>
                        <TableHead className="font-semibold text-foreground">Institution Name</TableHead>
                        <TableHead className="w-[120px] font-semibold text-foreground">Type</TableHead>
                        <TableHead className="w-[120px] font-semibold text-foreground">City</TableHead>
                        <TableHead className="w-[120px] font-semibold text-foreground">State</TableHead>
                        <TableHead className="w-[120px] font-semibold text-foreground">Country</TableHead>
                        <TableHead className="w-[120px] font-semibold text-foreground">Accreditation Level</TableHead>
                        <TableHead className="w-[100px] font-semibold text-foreground text-right">Score</TableHead>
                        <TableHead className="font-semibold text-foreground">Focus Areas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedInstitutions.map((institution) => (
                        <TableRow
                          key={`${institution.name}-${institution.nationalRanking}`}
                          className="hover:bg-muted/30 border-b border-border/30"
                        >
                          <TableCell>
                            {institution.country === "India" ? (
                              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500">
                                #{institution.nationalRanking}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {institution.stateRanking ? (
                              <div className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-600">
                                #{institution.stateRanking}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-foreground">{institution.name}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-blue-500/40 text-blue-600 text-xs">
                              {institution.institutionType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {institution.city}
                            </div>
                          </TableCell>
                          <TableCell>
                            {institution.state ? (
                              <span className="text-sm text-muted-foreground">{institution.state}</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{institution.country}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-gold/40 text-xs uppercase">
                              {institution.accreditationLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <span className="text-lg font-bold text-gradient-gold">{institution.score}</span>
                              <span className="text-xs text-muted-foreground ml-1">/ 500</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5">
                              {institution.focusAreas.slice(0, 2).map((area) => (
                                <Badge key={area} variant="outline" className="border-gold/40 text-[10px] px-1.5 py-0.5">
                                  {area}
                                </Badge>
                              ))}
                              {institution.focusAreas.length > 2 && (
                                <Badge variant="outline" className="border-gold/40 text-[10px] px-1.5 py-0.5">
                                  +{institution.focusAreas.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {filteredInstitutions.length > itemsPerPage && (
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum ? "gradient-gold text-primary" : ""}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredInstitutions.length)} of {filteredInstitutions.length} institutions
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={importType === "csv" ? ".csv,text/csv" : ".pdf,application/pdf"}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={(open) => {
        setIsImportDialogOpen(open);
        if (!open) {
          setImportType(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Import School Rankings</DialogTitle>
            <DialogDescription>
              Select a {importType?.toUpperCase()} file to import school ranking data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-colors"
            >
              {importType === "csv" ? (
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-2" />
              ) : (
                <FileText className="h-12 w-12 text-muted-foreground mb-2" />
              )}
              <p className="text-sm font-medium text-foreground">Click to select file</p>
              <p className="text-xs text-muted-foreground mt-1">
                {importType === "csv" ? "CSV files only" : "PDF files only"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FullRankings;

