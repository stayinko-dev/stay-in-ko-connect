import {
  Hospital,
  Home,
  Plane,
  Languages,
  ShoppingBag,
  FileText,
  GraduationCap,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export type ServiceCategory = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: string; // tailwind text color token
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: "hospital", name: "Hospital", description: "Doctor visits & pharmacies", icon: Hospital, accent: "text-rose-500" },
  { id: "housing", name: "Housing", description: "Move-in & contract help", icon: Home, accent: "text-primary" },
  { id: "airport", name: "Airport", description: "Pickup & drop-off", icon: Plane, accent: "text-sky-500" },
  { id: "translate", name: "Translate", description: "On-site interpreting", icon: Languages, accent: "text-emerald-500" },
  { id: "shopping", name: "Shopping", description: "Daily errands & delivery", icon: ShoppingBag, accent: "text-amber-500" },
  { id: "gov", name: "Gov Office", description: "Visa, ARC, banking", icon: FileText, accent: "text-violet-500" },
  { id: "school", name: "School", description: "Enrollment & campus help", icon: GraduationCap, accent: "text-indigo-500" },
  { id: "business", name: "Business", description: "Meetings & paperwork", icon: Briefcase, accent: "text-cyan-600" },
];

export type Helper = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  languages: string[];
  specialties: string[];
  area: string;
  hourlyRate: number; // KRW
  verified: boolean;
};

const avatar = (seed: string) => `https://i.pravatar.cc/200?u=${seed}`;

export const HELPERS: Helper[] = [
  { id: "h1", name: "Jiwoo Park", avatar: avatar("jiwoo"), rating: 4.9, reviews: 128, languages: ["KO", "EN", "JA"], specialties: ["Hospital", "Translate"], area: "Hongdae, Seoul", hourlyRate: 25000, verified: true },
  { id: "h2", name: "Minho Lee", avatar: avatar("minho"), rating: 4.8, reviews: 84, languages: ["KO", "EN", "ZH"], specialties: ["Airport", "Housing"], area: "Gangnam, Seoul", hourlyRate: 30000, verified: true },
  { id: "h3", name: "Soyeon Kim", avatar: avatar("soyeon"), rating: 5.0, reviews: 56, languages: ["KO", "EN"], specialties: ["Shopping", "Gov Office"], area: "Itaewon, Seoul", hourlyRate: 22000, verified: true },
  { id: "h4", name: "Daniel Cho", avatar: avatar("daniel"), rating: 4.7, reviews: 41, languages: ["KO", "EN"], specialties: ["Business", "Translate"], area: "Jongno, Seoul", hourlyRate: 35000, verified: false },
  { id: "h5", name: "Yuna Han", avatar: avatar("yuna"), rating: 4.9, reviews: 73, languages: ["KO", "EN", "JA"], specialties: ["School", "Housing"], area: "Sinchon, Seoul", hourlyRate: 24000, verified: true },
  { id: "h6", name: "Hyun Woo", avatar: avatar("hyunwoo"), rating: 4.8, reviews: 38, languages: ["KO", "ZH"], specialties: ["Hospital", "Gov Office"], area: "Busan", hourlyRate: 20000, verified: true },
];

export type LiveRequest = {
  id: string;
  category: string; // matches ServiceCategory.id
  area: string;
  ago: string;
  urgent?: boolean;
};

export const LIVE_REQUESTS: LiveRequest[] = [
  { id: "r1", category: "hospital", area: "Mapo-gu", ago: "just now", urgent: true },
  { id: "r2", category: "airport", area: "Incheon T2", ago: "3 min" },
  { id: "r3", category: "housing", area: "Seongdong-gu", ago: "12 min" },
  { id: "r4", category: "translate", area: "Gangnam", ago: "18 min" },
  { id: "r5", category: "gov", area: "Jongno-gu", ago: "27 min" },
];

export type CommunityPost = {
  id: string;
  flag: string;
  author: string;
  ago: string;
  area: string;
  tag: "Question" | "Review" | "Tip";
  title: string;
  excerpt: string;
  likes: number;
  comments: number;
};

export const COMMUNITY_POSTS: CommunityPost[] = [
  { id: "c1", flag: "🇮🇹", author: "Marco", ago: "2h", area: "Gangnam", tag: "Question", title: "Best clinic in Gangnam for skin issues?", excerpt: "I've been here 2 weeks and need a dermatologist that speaks English…", likes: 24, comments: 12 },
  { id: "c2", flag: "🇯🇵", author: "Aiko", ago: "5h", area: "Incheon", tag: "Review", title: "Soyeon helped me at Incheon — 10/10", excerpt: "Showed up early, carried my bags, even bought me coffee. Worth every won.", likes: 56, comments: 8 },
  { id: "c3", flag: "🇺🇸", author: "Jake", ago: "1d", area: "Hongdae", tag: "Tip", title: "How to set up a Korean bank account as a student", excerpt: "Bring your ARC + passport + lease. KB Star Bank in Hongdae has English staff.", likes: 102, comments: 21 },
];
