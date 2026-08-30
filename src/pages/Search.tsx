import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingCard from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { useListings } from "@/hooks/useListings";
import EmptyState from "@/components/ui/empty-state";
import ServiceMatchSection from "@/components/ServiceMatchSection";


const cities = ["All", "Seoul", "Busan", "Daejeon", "Gwangju"];
const propertyTypes = [
  { value: "all", label: "All" },
  { value: "studio", label: "Studio" },
  { value: "apartment", label: "Apartment" },
  { value: "guesthouse", label: "Guesthouse" },
  { value: "officeTel", label: "Officetel" },
  { value: "share", label: "Share house" },
  { value: "coliving", label: "Co-living" },
  { value: "private", label: "Private" },
  { value: "women_only", label: "Women only" },
];
const stayTypes = [
  { value: "all", label: "All" },
  { value: "short", label: "Short stay" },
  { value: "long", label: "Long stay" },
];
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under 500K", min: 0, max: 500_000 },
  { label: "500K-800K", min: 500_000, max: 800_000 },
  { label: "800K-1.2M", min: 800_000, max: 1_200_000 },
  { label: "1.2M+", min: 1_200_000, max: Infinity },
];

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const { listings, loading } = useListings();

  const [keyword, setKeyword] = useState(params.get("keyword") || "");
  const [city, setCity] = useState(params.get("city") || "All");
  const [propertyType, setPropertyType] = useState(params.get("propertyType") || "all");
  const [stayType, setStayType] = useState(params.get("stayType") || "all");
  const [noDeposit, setNoDeposit] = useState(params.get("nodeposit") === "true");
  const [university, setUniversity] = useState(params.get("university") || "");
  const [priceIdx, setPriceIdx] = useState(0);

  // Sync URL when filters change
  useEffect(() => {
    const next = new URLSearchParams();
    if (keyword) next.set("keyword", keyword);
    if (city !== "All") next.set("city", city);
    if (propertyType !== "all") next.set("propertyType", propertyType);
    if (stayType !== "all") next.set("stayType", stayType);
    if (noDeposit) next.set("nodeposit", "true");
    if (university) next.set("university", university);
    setParams(next, { replace: true });
  }, [keyword, city, propertyType, stayType, noDeposit, university, setParams]);

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const kw = keyword.trim().toLowerCase();
      if (kw) {
        const hay = `${l.title} ${l.location_label || ""} ${l.description || ""} ${l.university_area || ""}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      if (city !== "All" && (l.city || "").toLowerCase() !== city.toLowerCase()) return false;
      if (propertyType !== "all" && l.type !== propertyType) return false;
      if (noDeposit && !l.no_deposit) return false;
      if (university && !(l.university_area || "").toLowerCase().includes(university.toLowerCase())) return false;
      if (stayType === "short" && l.period !== "night") return false;
      if (stayType === "long" && l.period === "night") return false;
      const range = priceRanges[priceIdx];
      if (l.price < range.min || l.price > range.max) return false;
      return true;
    });
  }, [listings, keyword, city, propertyType, stayType, noDeposit, university, priceIdx]);

  const clearAll = () => {
    setKeyword("");
    setCity("All");
    setPropertyType("all");
    setStayType("all");
    setNoDeposit(false);
    setUniversity("");
    setPriceIdx(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-10 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Find your stay</h1>
          <p className="mt-2 text-muted-foreground">Verified listings across Seoul, Busan, Daejeon and Gwangju.</p>
        </header>

        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
          <SearchIcon className="h-5 w-5 shrink-0 text-primary" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by title, location, or keyword..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {keyword && (
            <button onClick={() => setKeyword("")} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mb-8 grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
          </div>

          <Group label="City" items={cities} value={city} onChange={setCity} />
          <Group
            label="Property type"
            items={propertyTypes.map((p) => p.label)}
            value={propertyTypes.find((p) => p.value === propertyType)?.label || "All"}
            onChange={(label) => setPropertyType(propertyTypes.find((p) => p.label === label)?.value || "all")}
          />
          <Group
            label="Stay length"
            items={stayTypes.map((s) => s.label)}
            value={stayTypes.find((s) => s.value === stayType)?.label || "All"}
            onChange={(label) => setStayType(stayTypes.find((s) => s.label === label)?.value || "all")}
          />
          <Group
            label="Price (monthly)"
            items={priceRanges.map((p) => p.label)}
            value={priceRanges[priceIdx].label}
            onChange={(label) => setPriceIdx(priceRanges.findIndex((p) => p.label === label))}
          />

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setNoDeposit((v) => !v)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-base ${
                noDeposit ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              No deposit only
            </button>

            <input
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Near university (e.g. Yonsei)"
              className="flex-1 min-w-[180px] rounded-full bg-secondary px-3 py-1.5 text-xs outline-none placeholder:text-muted-foreground"
            />

            <Button variant="ghost" size="sm" onClick={clearAll} className="ml-auto">
              <X className="h-4 w-4" /> Clear
            </Button>
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {loading ? "Loading..." : `${filtered.length} listing${filtered.length === 1 ? "" : "s"} found`}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="No listings match"
            description="Try widening your filters or clearing the search."
            action={{ label: "Reset filters", onClick: clearAll }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <ServiceMatchSection
          className="mt-14"
          searchContext={[keyword, university, city !== "All" ? city : ""].filter(Boolean).join(" ")}
        />
      </main>


      <Footer />
    </div>
  );
};

const Group = ({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-base ${
            value === item
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  </div>
);

export default SearchPage;
