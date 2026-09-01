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
import type { DbHelper } from "@/hooks/useHelpers";

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

/** Landmark / university / station keyword → district */
const AREA_HINTS: { match: string[]; district: string; city: string }[] = [
  { match: ["hanyang", "한양", "wangsimni", "왕십리", "seongsu", "성수", "seongdong", "성동"], district: "Seongdong-gu", city: "Seoul" },
  { match: ["yonsei", "연세", "ewha", "이대", "이화", "sinchon", "신촌", "seodaemun", "서대문"], district: "Seodaemun-gu", city: "Seoul" },
  { match: ["hongdae", "홍대", "mapo", "마포", "sangam", "상암"], district: "Mapo-gu", city: "Seoul" },
  { match: ["konkuk", "건국", "gwangjin", "광진", "gunja", "군자"], district: "Gwangjin-gu", city: "Seoul" },
  { match: ["gangnam", "강남", "yeoksam", "역삼", "seolleung", "선릉"], district: "Gangnam-gu", city: "Seoul" },
  { match: ["korea university", "고려대", "hankuk", "외대", "dongdaemun", "동대문", "hoegi", "회기"], district: "Dongdaemun-gu", city: "Seoul" },
  { match: ["snu", "서울대", "jongno", "종로", "gwanghwamun", "광화문", "sungkyunkwan", "성균관"], district: "Jongno-gu", city: "Seoul" },
  { match: ["kaist", "카이스트", "chungnam", "충남대", "yuseong", "유성", "daejeon", "대전"], district: "Yuseong-gu", city: "Daejeon" },
  { match: ["chonnam", "전남대", "gwangju", "광주", "buk-gu", "북구"], district: "Buk-gu", city: "Gwangju" },
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

export type ScoredHelper = DbHelper & { score: number; reasons: string[] };

/** Score = service fit + area proximity + language + rating + verification + price value */
export const matchHelpers = (
  pool: DbHelper[],
  serviceId: string,
  area: AreaGuess,
  language = "English",
  limit = 3,
): ScoredHelper[] => {
  const scored = pool.map((h) => {
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
    score += (Number(h.rating) - 4) * 12;
    if (Number(h.rating) >= 4.8) reasons.push(`${h.rating} rating · ${h.reviews_count} reviews`);
    if (h.id_verified) {
      score += 6;
      reasons.push("ID verified");
    }
    if (h.background_checked) {
      score += 5;
      reasons.push("Background checked");
    }
    score += Math.max(0, (35000 - h.hourly_rate) / 2000);

    return { ...h, score, reasons: reasons.slice(0, 4) };
  });

  const specialists = scored
    .filter((h) => h.services.includes(serviceId))
    .sort((a, b) => b.score - a.score);
  const rest = scored
    .filter((h) => !h.services.includes(serviceId))
    .sort((a, b) => b.score - a.score);

  return [...specialists, ...rest].slice(0, limit);
};
