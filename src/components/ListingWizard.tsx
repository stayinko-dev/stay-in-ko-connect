import { useMemo, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, FileCheck, Home, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const steps = [
  { label: "Property type", icon: Home },
  { label: "Location and price", icon: MapPin },
  { label: "Highlights", icon: Tag },
  { label: "Final review", icon: FileCheck },
];

const propertyTypes = [
  { value: "studio", label: "Studio", desc: "Great for exchange students and solo stays" },
  { value: "apartment", label: "Apartment", desc: "Best for families and long stays" },
  { value: "share", label: "Share house", desc: "Affordable and community-friendly" },
  { value: "coliving", label: "Co-living", desc: "Service-led housing for flexible residents" },
  { value: "private", label: "Private room", desc: "Private space inside a shared home" },
  { value: "women_only", label: "Women only", desc: "Safety-first inventory segment" },
];

const amenityOptions = [
  "Wi-Fi",
  "Air conditioning",
  "Washer",
  "Dryer",
  "Microwave",
  "Desk",
  "Wardrobe",
  "Secure access",
  "Elevator",
  "Parking",
  "Gym",
  "Shared lounge",
];

export type ListingWizardValues = {
  type: string;
  city: string;
  address: string;
  locationLabel: string;
  universityArea: string;
  nearbySubway: string;
  nearbyUniversity: string;
  title: string;
  description: string;
  price: string;
  deposit: string;
  beds: string;
  baths: string;
  guests: string;
  area: string;
  noDeposit: boolean;
  amenities: string[];
  hostResponse: string;
};

const initialValues: ListingWizardValues = {
  type: "studio",
  city: "Seoul",
  address: "",
  locationLabel: "",
  universityArea: "",
  nearbySubway: "",
  nearbyUniversity: "",
  title: "",
  description: "",
  price: "",
  deposit: "",
  beds: "1",
  baths: "1",
  guests: "1",
  area: "",
  noDeposit: false,
  amenities: [],
  hostResponse: "Usually replies within 1 hour",
};

interface ListingWizardProps {
  onClose: () => void;
  onSubmit: (values: ListingWizardValues) => Promise<void> | void;
  submitting?: boolean;
}

const ListingWizard = ({ onClose, onSubmit, submitting = false }: ListingWizardProps) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ListingWizardValues>(initialValues);

  const summary = useMemo(() => {
    const monthlyRent = form.price ? `KRW ${Number(form.price).toLocaleString("ko-KR")} / month` : "-";
    const deposit = form.noDeposit ? "No deposit" : form.deposit ? `KRW ${Number(form.deposit).toLocaleString("ko-KR")}` : "-";

    return { monthlyRent, deposit };
  }, [form.deposit, form.noDeposit, form.price]);

  const canNext = () => {
    if (step === 0) return Boolean(form.type);
    if (step === 1) return Boolean(form.city && form.address && form.locationLabel && form.price);
    if (step === 2) return Boolean(form.title && form.description);
    return true;
  };

  const update = <K extends keyof ListingWizardValues>(key: K, value: ListingWizardValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((current) => ({
      ...current,
      amenities: current.amenities.includes(amenity)
        ? current.amenities.filter((item) => item !== amenity)
        : [...current.amenities, amenity],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {steps.map((currentStep, index) => (
          <div key={currentStep.label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                index <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {index < step ? <CheckCircle className="h-4 w-4" /> : index + 1}
            </div>
            <span className="hidden text-xs text-muted-foreground sm:block">{currentStep.label}</span>
            {index < steps.length - 1 ? <div className="h-px flex-1 bg-border" /> : null}
          </div>
        ))}
      </div>

      {step === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {propertyTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => update("type", type.value)}
              className={`rounded-2xl border-2 p-5 text-left transition-colors ${
                form.type === type.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
              }`}
            >
              <p className="font-semibold text-foreground">{type.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{type.desc}</p>
            </button>
          ))}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledInput label="City" value={form.city} onChange={(value) => update("city", value)} placeholder="Seoul" />
            <LabeledInput
              label="Public location label"
              value={form.locationLabel}
              onChange={(value) => update("locationLabel", value)}
              placeholder="Seongsu, 10 min to Seoul Forest"
            />
          </div>
          <LabeledInput
            label="Full address"
            value={form.address}
            onChange={(value) => update("address", value)}
            placeholder="123 Yeonmujang-gil, Seongdong-gu"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <LabeledInput
              label="University or district"
              value={form.universityArea}
              onChange={(value) => update("universityArea", value)}
              placeholder="Near Korea Univ."
            />
            <LabeledInput
              label="Nearest subway"
              value={form.nearbySubway}
              onChange={(value) => update("nearbySubway", value)}
              placeholder="Seongsu Station, 6 min walk"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <LabeledInput label="Monthly rent" type="number" value={form.price} onChange={(value) => update("price", value)} placeholder="850000" />
            <LabeledInput
              label="Deposit"
              type="number"
              value={form.deposit}
              onChange={(value) => update("deposit", value)}
              placeholder="1000000"
              disabled={form.noDeposit}
            />
            <LabeledInput label="Area (sqm)" type="number" value={form.area} onChange={(value) => update("area", value)} placeholder="22" />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.noDeposit}
              onChange={(event) => update("noDeposit", event.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Offer this listing with no deposit
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4">
          <LabeledInput
            label="Listing title"
            value={form.title}
            onChange={(value) => update("title", value)}
            placeholder="No-deposit studio near Korea University"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <LabeledInput label="Beds" type="number" value={form.beds} onChange={(value) => update("beds", value)} />
            <LabeledInput label="Baths" type="number" value={form.baths} onChange={(value) => update("baths", value)} />
            <LabeledInput label="Guests" type="number" value={form.guests} onChange={(value) => update("guests", value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Explain check-in, neighborhood strengths, and what is included for international residents."
              className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <LabeledInput
            label="Host response promise"
            value={form.hostResponse}
            onChange={(value) => update("hostResponse", value)}
            placeholder="Usually replies within 30 minutes"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    form.amenities.includes(amenity)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Review before publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <SummaryRow
              label="Property type"
              value={propertyTypes.find((type) => type.value === form.type)?.label || "-"}
            />
            <SummaryRow label="Location" value={`${form.city} - ${form.locationLabel}`} />
            <SummaryRow label="Address" value={form.address || "-"} />
            <SummaryRow label="Price" value={`${summary.monthlyRent} / ${summary.deposit}`} />
            <SummaryRow label="District" value={form.universityArea || "-"} />
            <SummaryRow label="Subway" value={form.nearbySubway || "-"} />
            <SummaryRow label="Title" value={form.title || "-"} />
            <div>
              <p className="text-muted-foreground">Description</p>
              <p className="mt-1 text-foreground">{form.description || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Amenities</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.amenities.length ? form.amenities.map((amenity) => <Badge key={amenity}>{amenity}</Badge>) : <span>-</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={step === 0 ? onClose : () => setStep((value) => value - 1)}>
          <ChevronLeft className="h-4 w-4" />
          {step === 0 ? "Cancel" : "Back"}
        </Button>

        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => setStep((value) => value + 1)} disabled={!canNext()}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={() => onSubmit(form)} disabled={submitting}>
            {submitting ? "Publishing..." : "Publish listing"}
          </Button>
        )}
      </div>
    </div>
  );
};

const LabeledInput = ({
  disabled = false,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <Input
      disabled={disabled}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-6">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium text-foreground">{value}</span>
  </div>
);

export default ListingWizard;
