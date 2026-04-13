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
  type: "독립공간" | "코리빙" | "여성전용" | "원룸" | "쉐어하우스";
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
    location: "용산구, 서울",
    university: "이태원 인근",
    rating: 5.0,
    title: "이태원 게스트하우스 – 써니 스튜디오",
    description: "이태원 중심부에 위치한 햇살 가득한 스튜디오입니다. 지하철역 도보 5분, 편의시설 완비. 외국인 유학생에게 인기 있는 숙소입니다.",
    guests: 1,
    beds: 1,
    baths: 1,
    price: 45000,
    priceDisplay: "₩45,000",
    period: "night",
    noDeposit: true,
    type: "독립공간",
    amenities: ["WiFi", "에어컨", "세탁기", "주방"],
    hostName: "김민수",
    hostResponse: "보통 1시간 내 응답",
  },
  {
    id: 2,
    image: listing2,
    images: [listing2, listing1, listing3],
    tags: ["Apartment", "코리빙"],
    tagColors: [false, true],
    location: "마포구, 서울",
    university: "홍익대 인근",
    rating: 5.0,
    title: "홍대 코지 쉐어하우스",
    description: "홍대입구역 도보 3분! 젊고 활기찬 분위기의 쉐어하우스. 공용 라운지, 주방 완비. 한국 생활의 첫 걸음을 함께하세요.",
    guests: 2,
    beds: 1,
    baths: 1,
    price: 950000,
    priceDisplay: "₩950,000",
    period: "month",
    deposit: "보증금: ₩3,000,000",
    type: "코리빙",
    amenities: ["WiFi", "에어컨", "세탁기", "공용주방", "라운지"],
    hostName: "박지영",
    hostResponse: "보통 30분 내 응답",
  },
  {
    id: 3,
    image: listing3,
    images: [listing3, listing1, listing2],
    tags: ["Studio", "여성전용"],
    tagColors: [false, true],
    location: "강남구, 서울",
    university: "강남 인근",
    rating: 4.5,
    title: "강남 모던 스튜디오 (여성전용)",
    description: "강남역 도보 7분, 보안 철저한 여성전용 원룸. 풀옵션 가전, 깨끗한 인테리어. 안전하고 편안한 서울 생활을 약속합니다.",
    guests: 1,
    beds: 1,
    baths: 1,
    price: 1200000,
    priceDisplay: "₩1,200,000",
    period: "month",
    deposit: "보증금: ₩5,000,000",
    type: "여성전용",
    amenities: ["WiFi", "에어컨", "세탁기", "냉장고", "전자레인지", "CCTV"],
    hostName: "이서연",
    hostResponse: "보통 2시간 내 응답",
  },
  {
    id: 4,
    image: listing1,
    images: [listing1, listing3, listing2],
    tags: ["원룸", "No Deposit"],
    tagColors: [false, true],
    location: "관악구, 서울",
    university: "서울대 인근",
    rating: 4.8,
    title: "서울대 근처 깔끔한 원룸",
    description: "서울대입구역 도보 10분. 조용한 주택가에 위치한 깔끔한 원룸. 대학원생에게 추천합니다.",
    guests: 1,
    beds: 1,
    baths: 1,
    price: 550000,
    priceDisplay: "₩550,000",
    period: "month",
    noDeposit: true,
    type: "원룸",
    amenities: ["WiFi", "에어컨", "세탁기", "책상"],
    hostName: "최준혁",
    hostResponse: "보통 1시간 내 응답",
  },
  {
    id: 5,
    image: listing2,
    images: [listing2, listing3, listing1],
    tags: ["쉐어하우스", "Short-term OK"],
    tagColors: [false, true],
    location: "성북구, 서울",
    university: "고려대 인근",
    rating: 4.7,
    title: "고려대 앞 국제 쉐어하우스",
    description: "고려대 정문 도보 5분! 다양한 국적의 학생들이 함께 생활하는 국제 쉐어하우스. 한국어 교환 파트너 프로그램 운영 중.",
    guests: 2,
    beds: 1,
    baths: 1,
    price: 650000,
    priceDisplay: "₩650,000",
    period: "month",
    deposit: "보증금: ₩1,000,000",
    type: "쉐어하우스",
    amenities: ["WiFi", "에어컨", "세탁기", "공용주방", "옥상 테라스"],
    hostName: "정하늘",
    hostResponse: "보통 15분 내 응답",
  },
  {
    id: 6,
    image: listing3,
    images: [listing3, listing2, listing1],
    tags: ["Studio", "코리빙"],
    tagColors: [false, true],
    location: "서대문구, 서울",
    university: "연세대 인근",
    rating: 4.9,
    title: "연세대 인근 프리미엄 코리빙",
    description: "연세대 신촌캠퍼스 도보 8분. 프리미엄 코리빙 스페이스. 개인 룸 + 공용 라운지, 스터디룸, 피트니스 이용 가능.",
    guests: 1,
    beds: 1,
    baths: 1,
    price: 850000,
    priceDisplay: "₩850,000",
    period: "month",
    deposit: "보증금: ₩2,000,000",
    type: "코리빙",
    amenities: ["WiFi", "에어컨", "세탁기", "스터디룸", "피트니스", "라운지"],
    hostName: "한소희",
    hostResponse: "보통 30분 내 응답",
  },
];

export const universities = ["전체", "서울대 인근", "고려대 인근", "연세대 인근", "홍익대 인근", "이태원 인근", "강남 인근"];
export const propertyTypes = ["전체", "독립공간", "코리빙", "여성전용", "원룸", "쉐어하우스"];
export const priceRanges = [
  { label: "전체", min: 0, max: Infinity },
  { label: "~50만원", min: 0, max: 500000 },
  { label: "50~80만원", min: 500000, max: 800000 },
  { label: "80~120만원", min: 800000, max: 1200000 },
  { label: "120만원~", min: 1200000, max: Infinity },
];
