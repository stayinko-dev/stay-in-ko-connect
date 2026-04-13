import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";

export interface Listing {
  id: number;
  image: string;
  images: string[];
  tags: string[];
  tagColors: boolean[];
  location: string;
  university: string;
  rating: number;
  title: string;
  description: string;
  guests: number;
  beds: number;
  baths: number;
  price: number;
  priceDisplay: string;
  period: string;
  deposit?: string;
  noDeposit?: boolean;
  type: "Private" | "Co-living" | "Women Only" | "Studio" | "Share House";
  amenities: string[];
  hostName: string;
  hostResponse: string;
}

export const mockListings: Listing[] = [
  {
    id: 1,
    image: listing1,
    images: [listing1, listing2, listing3],
    tags: ["Guesthouse", "Short-term OK"],
    tagColors: [false, true],
    location: "Yongsan-gu, Seoul",
    university: "Near Itaewon",
    rating: 5.0,
    title: "Itaewon Guesthouse – Sunny Studio",
    description: "A sun-filled studio in the heart of Itaewon. 5-minute walk to the subway, fully furnished. A popular choice among international students.",
    guests: 1,
    beds: 1,
    baths: 1,
    price: 45000,
    priceDisplay: "₩45,000",
    period: "night",
    noDeposit: true,
    type: "Private",
    amenities: ["WiFi", "A/C", "Washer", "Kitchen"],
    hostName: "Minsu Kim",
    hostResponse: "Usually responds within 1 hour",
  },
  {
    id: 2,
    image: listing2,
    images: [listing2, listing1, listing3],
    tags: ["Apartment", "Co-living"],
    tagColors: [false, true],
    location: "Mapo-gu, Seoul",
    university: "Near Hongik Univ.",
    rating: 5.0,
    title: "Cozy Hongdae Share House",
    description: "3-minute walk from Hongik Univ. Station! A vibrant share house with a common lounge and fully equipped kitchen. Start your life in Korea here.",
    guests: 2,
    beds: 1,
    baths: 1,
    price: 950000,
    priceDisplay: "₩950,000",
    period: "month",
    deposit: "Deposit: ₩3,000,000",
    type: "Co-living",
    amenities: ["WiFi", "A/C", "Washer", "Shared Kitchen", "Lounge"],
    hostName: "Jiyoung Park",
    hostResponse: "Usually responds within 30 min",
  },
  {
    id: 3,
    image: listing3,
    images: [listing3, listing1, listing2],
    tags: ["Studio", "Women Only"],
    tagColors: [false, true],
    location: "Gangnam-gu, Seoul",
    university: "Near Gangnam",
    rating: 4.5,
    title: "Modern Studio in Gangnam (Women Only)",
    description: "7-minute walk from Gangnam Station. A secure women-only studio with full appliances and clean interiors. Safe and comfortable living in Seoul.",
    guests: 1,
    beds: 1,
    baths: 1,
    price: 1200000,
    priceDisplay: "₩1,200,000",
    period: "month",
    deposit: "Deposit: ₩5,000,000",
    type: "Women Only",
    amenities: ["WiFi", "A/C", "Washer", "Fridge", "Microwave", "CCTV"],
    hostName: "Seoyeon Lee",
    hostResponse: "Usually responds within 2 hours",
  },
  {
    id: 4,
    image: listing1,
    images: [listing1, listing3, listing2],
    tags: ["Studio", "No Deposit"],
    tagColors: [false, true],
    location: "Gwanak-gu, Seoul",
    university: "Near Seoul Nat'l Univ.",
    rating: 4.8,
    title: "Clean Studio Near Seoul National Univ.",
    description: "10-minute walk from Seoul Nat'l Univ. Station. A tidy studio in a quiet residential area. Recommended for graduate students.",
    guests: 1,
    beds: 1,
    baths: 1,
    price: 550000,
    priceDisplay: "₩550,000",
    period: "month",
    noDeposit: true,
    type: "Studio",
    amenities: ["WiFi", "A/C", "Washer", "Desk"],
    hostName: "Junhyuk Choi",
    hostResponse: "Usually responds within 1 hour",
  },
  {
    id: 5,
    image: listing2,
    images: [listing2, listing3, listing1],
    tags: ["Share House", "Short-term OK"],
    tagColors: [false, true],
    location: "Seongbuk-gu, Seoul",
    university: "Near Korea Univ.",
    rating: 4.7,
    title: "International Share House Near Korea Univ.",
    description: "5-minute walk from Korea Univ. main gate! An international share house with students from various countries. Korean language exchange program available.",
    guests: 2,
    beds: 1,
    baths: 1,
    price: 650000,
    priceDisplay: "₩650,000",
    period: "month",
    deposit: "Deposit: ₩1,000,000",
    type: "Share House",
    amenities: ["WiFi", "A/C", "Washer", "Shared Kitchen", "Rooftop Terrace"],
    hostName: "Haneul Jeong",
    hostResponse: "Usually responds within 15 min",
  },
  {
    id: 6,
    image: listing3,
    images: [listing3, listing2, listing1],
    tags: ["Studio", "Co-living"],
    tagColors: [false, true],
    location: "Seodaemun-gu, Seoul",
    university: "Near Yonsei Univ.",
    rating: 4.9,
    title: "Premium Co-living Near Yonsei Univ.",
    description: "8-minute walk from Yonsei Sinchon campus. Premium co-living space with private room + shared lounge, study room, and fitness center.",
    guests: 1,
    beds: 1,
    baths: 1,
    price: 850000,
    priceDisplay: "₩850,000",
    period: "month",
    deposit: "Deposit: ₩2,000,000",
    type: "Co-living",
    amenities: ["WiFi", "A/C", "Washer", "Study Room", "Fitness", "Lounge"],
    hostName: "Sohee Han",
    hostResponse: "Usually responds within 30 min",
  },
];

export const universities = ["All", "Near Seoul Nat'l Univ.", "Near Korea Univ.", "Near Yonsei Univ.", "Near Hongik Univ.", "Near Itaewon", "Near Gangnam"];
export const propertyTypes = ["All", "Private", "Co-living", "Women Only", "Studio", "Share House"];
export const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under ₩500K", min: 0, max: 500000 },
  { label: "₩500K–800K", min: 500000, max: 800000 },
  { label: "₩800K–1.2M", min: 800000, max: 1200000 },
  { label: "₩1.2M+", min: 1200000, max: Infinity },
];
