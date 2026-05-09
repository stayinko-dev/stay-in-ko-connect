import { useMemo, useState } from "react";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import ListingCard from "./ListingCard";
import { Button } from "@/components/ui/button";

const universities = [
  "All",
  "Near Seoul Nat'l Univ.",
  "Near Korea Univ.",
  "Near Yonsei Univ.",
  "Near Hongik Univ.",
  "Near Itaewon",
  "Near Gangnam",
];

const propertyTypes = [
  { value: "All", label: "All" },
  { value: "private", label: "Private" },
  { value: "coliving", label: "Co-living" },
  { value: "women_only", label: "Women Only" },
  { value: "studio", label: "Studio" },
  { value: "share", label: "Share House" },
];

const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under 500K", min: 0, max: 500000 },
  { label: "500K - 800K", min: 500000, max: 800000 },
  { label: "800K - 1.2M", min: 800000, max: 1200000 },
  { label: "1.2M+", min: 1200000, max: Infinity },
];

const SearchListings = () => {
  const { listings, loading } = useListings();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch =
        !searchQuery ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (listing.location_label || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUni = selectedUniversity === "All" || listing.university_area === selectedUniversity;
      const matchesType = selectedType === "All" || listing.type === selectedType;
      const range = priceRanges[selectedPriceRange];
      const matchesPrice = listing.price >= range.min && listing.price <= range.max;
      return matchesSearch && matchesUni && matchesType && matchesPrice;
    });
  }, [listings, searchQuery, selectedPriceRange, selectedType, selectedUniversity]);

  return (
    <section id="search-listings" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Search and filter listings that fit your stay</h2>
          <p className="mt-2 text-muted-foreground">
            학교, 지역, 월세 구간, 주거 타입 기준으로 빠르게 비교할 수 있습니다.
          </p>
        </div>

        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <Search className="h-5 w-5 shrink-0 text-primary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title or location..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filters
          </div>

          <FilterGroup
            label="University / Area"
            items={universities}
            selected={selectedUniversity}
            onSelect={setSelectedUniversity}
          />
          <FilterGroup
            label="Property Type"
            items={propertyTypes.map((type) => type.label)}
            selected={propertyTypes.find((type) => type.value === selectedType)?.label || "All"}
            onSelect={(label) => setSelectedType(propertyTypes.find((type) => type.label === label)?.value || "All")}
          />
          <FilterGroup
            label="Price Range (Monthly)"
            items={priceRanges.map((range) => range.label)}
            selected={priceRanges[selectedPriceRange].label}
            onSelect={(label) => setSelectedPriceRange(priceRanges.findIndex((range) => range.label === label))}
          />
        </div>

        <p className="mb-6 text-sm text-muted-foreground">
          {loading ? "Loading listings..." : `${filteredListings.length} listings found`}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.slice(0, 6).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {!loading && filteredListings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No listings found.</p>
            <p className="mt-1 text-sm text-muted-foreground">필터를 조금 넓혀서 다시 찾아보세요.</p>
          </div>
        ) : null}

        {!loading && filteredListings.length > 0 && (
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" variant="outline">
              <Link to="/search">View all properties</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

const FilterGroup = ({
  items,
  label,
  onSelect,
  selected,
}: {
  items: string[];
  label: string;
  onSelect: (value: string) => void;
  selected: string;
}) => (
  <div>
    <p className="mb-2 text-xs text-muted-foreground">{label}</p>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            selected === item
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

export default SearchListings;
