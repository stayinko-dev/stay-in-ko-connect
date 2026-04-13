import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ChevronLeft, ChevronRight, Home, MapPin, Tag, FileCheck } from "lucide-react";

const STEPS = [
  { label: "숙소 타입", icon: Home },
  { label: "위치 & 가격", icon: MapPin },
  { label: "편의시설 & 설명", icon: Tag },
  { label: "최종 확인", icon: FileCheck },
];

const propertyTypes = [
  { value: "studio", label: "스튜디오", desc: "1인 독립 공간" },
  { value: "apartment", label: "아파트", desc: "넓은 거주 공간" },
  { value: "share", label: "쉐어하우스", desc: "공유 주거 공간" },
  { value: "coliving", label: "코리빙", desc: "커뮤니티 기반 주거" },
];

const amenityOptions = [
  "WiFi", "에어컨", "세탁기", "냉장고", "전자레인지", "TV",
  "주방", "공용주방", "라운지", "스터디룸", "피트니스", "CCTV",
  "옥상 테라스", "주차장", "엘리베이터", "반려동물 가능",
];

interface ListingWizardProps {
  onClose: () => void;
  onSubmit: () => void;
}

const ListingWizard = ({ onClose, onSubmit }: ListingWizardProps) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    type: "",
    address: "",
    city: "",
    price: "",
    area: "",
    rooms: "1",
    baths: "1",
    amenities: [] as string[],
    title: "",
    description: "",
  });

  const updateForm = (key: string, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const canNext = () => {
    if (step === 0) return !!form.type;
    if (step === 1) return !!form.address && !!form.city && !!form.price;
    if (step === 2) return !!form.title && !!form.description;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">{s.label}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Type */}
      {step === 0 && (
        <div className="grid grid-cols-2 gap-4">
          {propertyTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => updateForm("type", t.value)}
              className={`p-5 rounded-xl border-2 text-left transition-all ${
                form.type === t.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <p className="font-semibold text-foreground">{t.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Location & Price */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">도시</label>
              <Input value={form.city} onChange={(e) => updateForm("city", e.target.value)} placeholder="예: 서울" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">상세 주소</label>
              <Input value={form.address} onChange={(e) => updateForm("address", e.target.value)} placeholder="예: 마포구 홍대입구" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">월세 (원)</label>
              <Input type="number" value={form.price} onChange={(e) => updateForm("price", e.target.value)} placeholder="850000" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">면적 (㎡)</label>
              <Input type="number" value={form.area} onChange={(e) => updateForm("area", e.target.value)} placeholder="33" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">방 수</label>
              <Input type="number" value={form.rooms} onChange={(e) => updateForm("rooms", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Amenities & Description */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">숙소 제목</label>
            <Input value={form.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="매력적인 숙소 제목을 입력하세요" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">숙소 설명</label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="숙소의 특징과 장점을 자세히 설명해주세요..."
              className="w-full bg-background border border-input rounded-md p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none h-24 font-body"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">편의시설 선택</label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    form.amenities.includes(a)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">등록 정보 확인</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="숙소 타입" value={propertyTypes.find((t) => t.value === form.type)?.label || ""} />
            <Row label="위치" value={`${form.city} ${form.address}`} />
            <Row label="월세" value={form.price ? `₩${Number(form.price).toLocaleString()}` : ""} />
            <Row label="면적" value={form.area ? `${form.area}㎡` : "-"} />
            <Row label="방 수" value={`${form.rooms}개`} />
            <Row label="제목" value={form.title} />
            <div>
              <span className="text-muted-foreground">설명:</span>
              <p className="text-foreground mt-1">{form.description}</p>
            </div>
            <div>
              <span className="text-muted-foreground">편의시설:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {form.amenities.map((a) => (
                  <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={step === 0 ? onClose : () => setStep(step - 1)}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          {step === 0 ? "취소" : "이전"}
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
            다음 <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={onSubmit}>
            🎉 매물 등록하기
          </Button>
        )}
      </div>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

export default ListingWizard;
