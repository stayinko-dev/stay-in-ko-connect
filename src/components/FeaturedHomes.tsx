import { Star, MapPin, Users, BedDouble, Bath, ArrowRight } from "lucide-react";
import listing1 from "@/assets/listing-1.jpg";
import listing2 from "@/assets/listing-2.jpg";
import listing3 from "@/assets/listing-3.jpg";

const listings = [
  {
    image: listing1,
    tags: ["Guesthouse", "Short-term OK"],
    tagColors: [false, true],
    location: "Yongsan-gu, Seoul",
    rating: 5.0,
    title: "Itaewon Guesthouse – Sunny Studio",
    guests: 1,
    beds: 1,
    baths: 1,
    price: "₩45k",
    period: "night",
  },
  {
    image: listing2,
    tags: ["Apartment"],
    tagColors: [false],
    location: "Mapo-gu, Seoul",
    rating: 5.0,
    title: "Cozy Hongdae Share House",
    guests: 2,
    beds: 1,
    baths: 1,
    price: "₩95M",
    period: "month",
    deposit: "Deposit: ₩300M",
  },
  {
    image: listing3,
    tags: ["Studio", "Short-term OK"],
    tagColors: [false, true],
    location: "Gangnam-gu, Seoul",
    rating: 4.5,
    title: "Modern Studio in Gangnam",
    guests: 2,
    beds: 1,
    baths: 1,
    price: "₩120M",
    period: "month",
    deposit: "Deposit: ₩500M",
  },
];

const FeaturedHomes = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Featured Homes</h2>
            <p className="text-muted-foreground mt-2 font-body">Handpicked properties with verified hosts.</p>
          </div>
          <a href="#" className="hidden md:flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors">
            View all <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  width={800}
                  height={600}
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
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{listing.guests} max</span>
                  <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{listing.beds} bed</span>
                  <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{listing.baths} bath</span>
                </div>

                <div>
                  <span className="text-lg font-bold text-foreground">{listing.price}</span>
                  <span className="text-sm text-muted-foreground"> / {listing.period}</span>
                  {listing.deposit && (
                    <p className="text-xs text-muted-foreground mt-0.5">{listing.deposit}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <a href="#" className="md:hidden flex items-center justify-center gap-1 text-sm font-semibold text-foreground hover:text-primary mt-8">
          View all <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

export default FeaturedHomes;
