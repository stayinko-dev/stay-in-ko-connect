import { useState, useMemo } from "react";
import { Search, MapPin, Users, BedDouble, Bath, Star, SlidersHorizontal } from "lucide-react";
import { mockListings, universities, propertyTypes, priceRanges, Listing } from "@/data/mockListings";
import ListingDetailModal from "./ListingDetailModal";

const SearchListings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("전체");
  const [selectedType, setSelectedType] = useState("전체");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredListings = useMemo(() => {
    return mockListings.filter((listing) => {
      const matchesSearch =
        !searchQuery ||
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUni = selectedUniversity === "전체" || listing.university === selectedUniversity;
      const matchesType = selectedType === "전체" || listing.type === selectedType;
      const range = priceRanges[selectedPriceRange];
      const matchesPrice = listing.price >= range.min && listing.price <= range.max;
      return matchesSearch && matchesUni && matchesType && matchesPrice;
    });
  }, [searchQuery, selectedUniversity, selectedType, selectedPriceRange]);

  const openDetail = (listing: Listing) => {
    setSelectedListing(listing);
    setModalOpen(true);
  };

  return (
    <section id="search-listings" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            🔍 숙소 검색 & 필터
          </h2>
          <p className="text-muted-foreground mt-2 font-body">
            대학교별, 숙소 타입별, 가격대별로 원하는 매물을 찾아보세요.
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
              placeholder="제목 또는 지역명으로 검색..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground w-full outline-none font-body"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            필터
          </div>

          {/* University filter */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">대학교 / 지역</p>
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

          {/* Type filter */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">숙소 타입</p>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price filter */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">가격대 (월세)</p>
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

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredListings.length}개의 매물을 찾았습니다
        </p>

        {/* Listing grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              onClick={() => openDetail(listing)}
              className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {listing.tags.map((tag, j) => (
                    <span
                      key={j}
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        listing.tagColors[j]
                          ? "bg-primary text-primary-foreground"
                          : "bg-card/90 text-foreground backdrop-blur-sm"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {listing.noDeposit && (
                  <div className="absolute top-3 right-3 bg-badge-green text-badge-green-foreground text-xs font-bold px-3 py-1 rounded-full">
                    No Deposit
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {listing.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Star className="h-4 w-4 text-star fill-star" />
                    {listing.rating}
                  </div>
                </div>

                <h3 className="font-semibold text-foreground mb-2 font-body">{listing.title}</h3>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{listing.guests}명</span>
                  <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{listing.beds} bed</span>
                  <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{listing.baths} bath</span>
                </div>

                <div>
                  <span className="text-lg font-bold text-foreground">{listing.priceDisplay}</span>
                  <span className="text-sm text-muted-foreground"> / {listing.period}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">검색 결과가 없습니다.</p>
            <p className="text-muted-foreground text-sm mt-1">필터를 변경해보세요.</p>
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
