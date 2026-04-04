import { Search, MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
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

          <p className="text-lg text-muted-foreground mb-10 max-w-lg font-body">
            Short-term stays or long-term leases. No complicated deposits, no language barrier. We bridge the gap between you and Korean landlords.
          </p>
        </div>

        <div className="max-w-3xl bg-card rounded-2xl shadow-xl p-3 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <input
              type="text"
              placeholder="Where do you want to live? (e.g. Seoul, Busan)"
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground w-full outline-none font-body"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shrink-0 text-sm">
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
