import {
  Smartphone,
  Landmark,
  Hospital,
  Truck,
  FileSignature,
  Bus,
  Building2,
  Languages,
  Coffee,
  type LucideIcon,
} from "lucide-react";

export type HelpService = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

/** "What do you need help with in Korea?" */
export const HELP_SERVICES: HelpService[] = [
  { id: "sim", name: "SIM Card", description: "Phone plans & eSIM setup", icon: Smartphone, accent: "text-sky-500" },
  { id: "bank", name: "Bank", description: "Open an account, transfers", icon: Landmark, accent: "text-emerald-500" },
  { id: "hospital", name: "Hospital", description: "Clinics, pharmacy, insurance", icon: Hospital, accent: "text-rose-500" },
  { id: "moving", name: "Moving", description: "Move-in day & furniture", icon: Truck, accent: "text-amber-500" },
  { id: "contract", name: "Contract", description: "Lease review & signing", icon: FileSignature, accent: "text-primary" },
  { id: "transport", name: "Transportation", description: "T-money, routes, pickup", icon: Bus, accent: "text-indigo-500" },
  { id: "gov", name: "Government Office", description: "ARC, visa, registration", icon: Building2, accent: "text-violet-500" },
  { id: "translation", name: "Korean Translation", description: "On-site interpreting", icon: Languages, accent: "text-cyan-600" },
  { id: "life", name: "Local Life", description: "Errands, shopping, settling in", icon: Coffee, accent: "text-orange-500" },
];

export type MatchHelper = {
  id: string;
  name: string;
  avatar: string;
  district: string; // e.g. "Seongdong-gu"
  city: string;
  languages: string[]; // e.g. ["English", "Korean"]
  services: string[]; // HelpService ids
  rating: number;
  reviews: number;
  jobsDone: number;
  idVerified: boolean;
  backgroundChecked: boolean;
  hourlyRate: number; // KRW
  responseMin: number;
  bio: string;
};

const face = (seed: string) => `https://i.pravatar.cc/240?u=${seed}`;

export const HELPER_POOL: MatchHelper[] = [
  { id: "m1", name: "Jiwoo Park", avatar: face("jiwoo"), district: "Seongdong-gu", city: "Seoul", languages: ["English", "Korean", "Japanese"], services: ["hospital", "gov", "translation"], rating: 4.9, reviews: 128, jobsDone: 164, idVerified: true, backgroundChecked: true, hourlyRate: 25000, responseMin: 8, bio: "Hanyang Univ. grad. I handle hospital visits and ARC paperwork weekly." },
  { id: "m2", name: "Minho Lee", avatar: face("minho"), district: "Seongdong-gu", city: "Seoul", languages: ["English", "Korean", "Chinese"], services: ["moving", "contract", "transport"], rating: 4.8, reviews: 84, jobsDone: 97, idVerified: true, backgroundChecked: true, hourlyRate: 30000, responseMin: 12, bio: "Move-in specialist around Wangsimni & Seongsu. Lease checks included." },
  { id: "m3", name: "Soyeon Kim", avatar: face("soyeon"), district: "Seongdong-gu", city: "Seoul", languages: ["English", "Korean"], services: ["sim", "bank", "life"], rating: 5.0, reviews: 56, jobsDone: 61, idVerified: true, backgroundChecked: false, hourlyRate: 22000, responseMin: 6, bio: "SIM + bank account in one afternoon. I know which branches speak English." },
  { id: "m4", name: "Daniel Cho", avatar: face("daniel"), district: "Jongno-gu", city: "Seoul", languages: ["English", "Korean"], services: ["contract", "translation", "gov"], rating: 4.7, reviews: 41, jobsDone: 52, idVerified: true, backgroundChecked: true, hourlyRate: 35000, responseMin: 15, bio: "Business interpreter, contract and immigration documents." },
  { id: "m5", name: "Yuna Han", avatar: face("yuna"), district: "Seodaemun-gu", city: "Seoul", languages: ["English", "Korean", "Japanese"], services: ["life", "moving", "sim"], rating: 4.9, reviews: 73, jobsDone: 88, idVerified: true, backgroundChecked: true, hourlyRate: 24000, responseMin: 9, bio: "Student-life helper near Yonsei & Ewha. Settling-in checklists." },
  { id: "m6", name: "Hyunwoo Seo", avatar: face("hyunwoo"), district: "Gwangjin-gu", city: "Seoul", languages: ["English", "Korean"], services: ["hospital", "bank", "transport"], rating: 4.8, reviews: 38, jobsDone: 44, idVerified: true, backgroundChecked: false, hourlyRate: 20000, responseMin: 11, bio: "Konkuk area. Clinic appointments and bank visits after 6pm too." },
  { id: "m7", name: "Eunji Nam", avatar: face("eunji"), district: "Gangnam-gu", city: "Seoul", languages: ["English", "Korean", "Chinese"], services: ["bank", "gov", "contract"], rating: 4.9, reviews: 152, jobsDone: 190, idVerified: true, backgroundChecked: true, hourlyRate: 33000, responseMin: 7, bio: "Ex-bank teller. Accounts, cards, and rental contracts." },
  { id: "m8", name: "Taeyang Ryu", avatar: face("taeyang"), district: "Mapo-gu", city: "Seoul", languages: ["English", "Korean"], services: ["sim", "transport", "life"], rating: 4.6, reviews: 29, jobsDone: 33, idVerified: true, backgroundChecked: false, hourlyRate: 19000, responseMin: 14, bio: "Hongdae local. Phone plans, T-money, and neighborhood tours." },
  { id: "m9", name: "Hana Jung", avatar: face("hana"), district: "Dongdaemun-gu", city: "Seoul", languages: ["English", "Korean"], services: ["hospital", "translation", "moving"], rating: 4.8, reviews: 64, jobsDone: 79, idVerified: true, backgroundChecked: true, hourlyRate: 26000, responseMin: 10, bio: "Medical interpreting at university hospitals in eastern Seoul." },
  { id: "m10", name: "Jaewon Oh", avatar: face("jaewon"), district: "Haeundae-gu", city: "Busan", languages: ["English", "Korean"], services: ["life", "transport", "sim"], rating: 4.7, reviews: 47, jobsDone: 55, idVerified: true, backgroundChecked: true, hourlyRate: 21000, responseMin: 13, bio: "Busan settling-in help, from SIM cards to beach-side apartments." },
];

/** Landmark / university / station keyword → district */
const AREA_HINTS: { match: string[]; district: string; city: string }[] = [
  { match: ["hanyang", "한양", "wangsimni", "왕십리", "seongsu", "성수", "seongdong", "성동"], district: "Seongdong-gu", city: "Seoul" },
  { match: ["yonsei", "연세", "ewha", "이대", "이화", "sinchon", "신촌", "seodaemun", "서대문"], district: "Seodaemun-gu", city: "Seoul" },
  { match: ["hongdae", "홍대", "mapo", "마포", "sangam", "상암"], district: "Mapo-gu", city: "Seoul" },
  { match: ["konkuk", "건국", "gwangjin", "광진", "gunja", "군자"], district: "Gwangjin-gu", city: "Seoul" },
  { match: ["gangnam", "강남", "yeoksam", "역삼", "seolleung", "선릉"], district: "Gangnam-gu", city: "Seoul" },
  { match: ["korea university", "고려대", "hankuk", "외대", "dongdaemun", "동대문", "hoegi", "회기"], district: "Dongdaemun-gu", city: "Seoul" },
  { match: ["snu", "서울대", "jongno", "종로", "gwanghwamun", "광화문", "sungkyunkwan", "성균관"], district: "Jongno-gu", city: "Seoul" },
  { match: ["busan", "부산", "haeundae", "해운대", "seomyeon", "서면"], district: "Haeundae-gu", city: "Busan" },
];

export type AreaGuess = { district: string; city: string } | null;

export const inferArea = (input: string): AreaGuess => {
  const q = (input || "").toLowerCase();
  if (!q.trim()) return null;
  for (const hint of AREA_HINTS) {
    if (hint.match.some((m) => q.includes(m))) return { district: hint.district, city: hint.city };
  }
  return null;
};

export type ScoredHelper = MatchHelper & { score: number; reasons: string[] };

/** Score = service fit + area proximity + language + rating + verification + price value */
export const matchHelpers = (
  serviceId: string,
  area: AreaGuess,
  language = "English",
  limit = 3,
): ScoredHelper[] => {
  const scored = HELPER_POOL.map((h) => {
    let score = 0;
    const reasons: string[] = [];

    if (h.services.includes(serviceId)) {
      score += 40;
      reasons.push("Specializes in this service");
    }
    if (area && h.district === area.district) {
      score += 25;
      reasons.push(`Based in ${h.district}`);
    } else if (area && h.city === area.city) {
      score += 10;
      reasons.push(`Works across ${h.city}`);
    }
    if (h.languages.includes(language)) {
      score += 15;
      reasons.push(`${language} speaking`);
    }
    score += (h.rating - 4) * 12;
    if (h.rating >= 4.8) reasons.push(`${h.rating} rating · ${h.reviews} reviews`);
    if (h.idVerified) {
      score += 6;
      reasons.push("ID verified");
    }
    if (h.backgroundChecked) {
      score += 5;
      reasons.push("Background checked");
    }
    score += Math.max(0, (35000 - h.hourlyRate) / 2000);

    return { ...h, score, reasons: reasons.slice(0, 4) };
  });

  return scored
    .filter((h) => h.services.includes(serviceId))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .concat(
      // fallback if fewer than `limit` specialists exist
      scored.filter((h) => !h.services.includes(serviceId)).sort((a, b) => b.score - a.score),
    )
    .slice(0, limit);
};
