import { Search, MapPin, Home, Users, ShieldCheck, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const quickFilters = [
  { label: "Private", icon: Home },
  { label: "Co-living", icon: Users },
  { label: "Women Only", icon: ShieldCheck },
  { label: "No Deposit", icon: Sparkles },
];

const HeroSection = () => {
  const scrollToSearch = () => {
    document.getElementById("search-listings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Cozy Korean apartment" className="w-full h-full object-cover" width={1920} height={900} />
        <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/60 to-card/30" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
            For International Students & Pros
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-foreground mb-4">
            Find your perfect home in{" "}
            <span className="text-primary">Korea.</span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-lg font-body">
            Short-term stays or long-term leases. No complicated deposits, no language barrier.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mb-10">
            <div>
              <span className="text-3xl font-display font-bold text-foreground">5,000+</span>
              <p className="text-sm text-muted-foreground">Tenants</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <span className="text-3xl font-display font-bold text-foreground">1,200+</span>
              <p className="text-sm text-muted-foreground">Listings</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <span className="text-3xl font-display font-bold text-foreground">98%</span>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="max-w-3xl bg-card rounded-2xl shadow-xl p-3 flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <input
              type="text"
              placeholder="Where do you want to live? (e.g. Seoul, Busan)"
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground w-full outline-none font-body"
            />
          </div>
          <button
            onClick={scrollToSearch}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shrink-0 text-sm"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>

        {/* Quick filter buttons */}
        <div className="flex flex-wrap gap-3 max-w-3xl">
          {quickFilters.map((filter) => (
            <button
              key={filter.label}
              onClick={scrollToSearch}
              className="flex items-center gap-2 bg-card/80 backdrop-blur-sm text-foreground text-sm font-medium px-4 py-2.5 rounded-full hover:bg-card hover:shadow-md transition-all"
            >
              <filter.icon className="h-4 w-4 text-primary" />
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
