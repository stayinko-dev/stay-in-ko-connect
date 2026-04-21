import { useMemo, useState } from "react";
import { Bath, BedDouble, Loader2, MapPin, Search, SlidersHorizontal, Star, Users } from "lucide-react";
import ListingDetailModal from "./ListingDetailModal";
import { ListingRow, resolveImage, useListings } from "@/hooks/useListings";

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
  const [selectedListing, setSelectedListing] = useState<ListingRow | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const openDetail = (listing: ListingRow) => {
    setSelectedListing(listing);
    setModalOpen(true);
  };

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
            {filteredListings.map((listing) => {
              const cover = listing.images?.[0] ? resolveImage(listing.images[0]) : "";
              const tags = listing.tags || [];
              const tagColors = listing.tag_colors || [];

              return (
                <button
                  key={listing.id}
                  type="button"
                  onClick={() => openDetail(listing)}
                  className="group overflow-hidden rounded-2xl bg-card text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={cover}
                      alt={listing.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={`${listing.id}-${tag}-${index}`}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            tagColors[index]
                              ? "bg-primary text-primary-foreground"
                              : "bg-card/90 text-foreground backdrop-blur-sm"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {listing.no_deposit ? (
                      <div className="absolute top-3 right-3 rounded-full bg-badge-green px-3 py-1 text-xs font-bold text-badge-green-foreground">
                        No Deposit
                      </div>
                    ) : null}
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {listing.location_label}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Star className="h-4 w-4 fill-star text-star" />
                        {Number(listing.rating).toFixed(1)}
                      </div>
                    </div>

                    <h3 className="mb-2 font-semibold text-foreground">{listing.title}</h3>

                    <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{listing.guests} guests</span>
                      <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{listing.beds} bed</span>
                      <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{listing.baths} bath</span>
                    </div>

                    <div>
                      <span className="text-lg font-bold text-foreground">{listing.price_display || `${listing.price.toLocaleString("ko-KR")}원`}</span>
                      <span className="text-sm text-muted-foreground"> / {listing.period}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && filteredListings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No listings found.</p>
            <p className="mt-1 text-sm text-muted-foreground">필터를 조금 넓혀서 다시 찾아보세요.</p>
          </div>
        ) : null}
      </div>

      <ListingDetailModal listing={selectedListing} open={modalOpen} onOpenChange={setModalOpen} />
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
