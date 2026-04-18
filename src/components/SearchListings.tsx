import { useState, useMemo } from "react";
import { Search, MapPin, Users, BedDouble, Bath, Star, SlidersHorizontal, Loader2 } from "lucide-react";
import { useListings, resolveImage, ListingRow } from "@/hooks/useListings";
import ListingDetailModal from "./ListingDetailModal";

const universities = ["All", "Near Seoul Nat'l Univ.", "Near Korea Univ.", "Near Yonsei Univ.", "Near Hongik Univ.", "Near Itaewon", "Near Gangnam"];
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
  { label: "Under ₩500K", min: 0, max: 500000 },
  { label: "₩500K–800K", min: 500000, max: 800000 },
  { label: "₩800K–1.2M", min: 800000, max: 1200000 },
  { label: "₩1.2M+", min: 1200000, max: Infinity },
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
  }, [listings, searchQuery, selectedUniversity, selectedType, selectedPriceRange]);

  const openDetail = (listing: ListingRow) => {
    setSelectedListing(listing);
    setModalOpen(true);
  };

  return (
    <section id="search-listings" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            🔍 Search & Filter Listings
          </h2>
          <p className="text-muted-foreground mt-2 font-body">
            Find your ideal place by university, property type, and price range.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center gap-2 bg-card rounded-xl px-4 py-3 shadow-sm border border-border">
            <Search className="h-5 w-5 text-primary shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or location..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground w-full outline-none font-body"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Filters
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">University / Area</p>
            <div className="flex flex-wrap gap-2">
              {universities.map((uni) => (
                <button
                  key={uni}
                  onClick={() => setSelectedUniversity(uni)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedUniversity === uni
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {uni}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Property Type</p>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedType === t.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Price Range (Monthly)</p>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range, i) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPriceRange(i)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedPriceRange === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {loading ? "Loading..." : `${filteredListings.length} listings found`}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const tags = listing.tags || [];
              const tagColors = listing.tag_colors || [];
              const cover = listing.images?.[0] ? resolveImage(listing.images[0]) : "";
              return (
                <div
                  key={listing.id}
                  onClick={() => openDetail(listing)}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={cover}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {tags.map((tag, j) => (
                        <span
                          key={j}
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            tagColors[j]
                              ? "bg-primary text-primary-foreground"
                              : "bg-card/90 text-foreground backdrop-blur-sm"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {listing.no_deposit && (
                      <div className="absolute top-3 right-3 bg-badge-green text-badge-green-foreground text-xs font-bold px-3 py-1 rounded-full">
                        No Deposit
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {listing.location_label}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold">
                        <Star className="h-4 w-4 text-star fill-star" />
                        {Number(listing.rating).toFixed(1)}
                      </div>
                    </div>

                    <h3 className="font-semibold text-foreground mb-2 font-body">{listing.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{listing.guests} guest(s)</span>
                      <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{listing.beds} bed</span>
                      <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{listing.baths} bath</span>
                    </div>

                    <div>
                      <span className="text-lg font-bold text-foreground">{listing.price_display}</span>
                      <span className="text-sm text-muted-foreground"> / {listing.period}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No listings found.</p>
            <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      <ListingDetailModal
        listing={selectedListing}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};

export default SearchListings;
