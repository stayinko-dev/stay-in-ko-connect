import { ArrowRight, Search, ShieldCheck, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroBg from "@/assets/hero-bg.jpg";

const trustChips = [
  { icon: ShieldCheck, label: "Verified hosts" },
  { icon: Sparkles, label: "No-deposit options" },
  { icon: Star, label: "4.9 / 5 guest rating" },
];

const HeroSection = () => {
  const scrollToSearch = () => {
    document.getElementById("search-listings")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-primary-glow/20 blur-3xl" />

      <div className="relative container mx-auto px-4 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32 lg:pt-32 lg:pb-40">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left: Copy */}
          <div className="max-w-2xl">
            <Badge variant="soft" className="mb-6 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]">
              For international students & professionals
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.05] text-foreground text-balance">
              The easiest way to{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">land in Korea.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl text-pretty leading-relaxed">
              Search verified stays, message hosts in English, and book without massive deposits — all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="xl" variant="gradient" onClick={scrollToSearch} className="shadow-glow">
                <Search className="h-5 w-5" />
                Find a stay
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/host">
                  List your place
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {trustChips.map((chip) => (
                <div key={chip.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <chip.icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{chip.label}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { value: "5,000+", label: "Tenants moved in" },
                { value: "1,200+", label: "Verified listings" },
                { value: "98%", label: "Satisfaction" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-display font-bold text-foreground">{s.value}</div>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero visual card */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-overlay ring-1 ring-border/60">
              <img src={heroBg} alt="Cozy Korean apartment" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -left-6 top-10 rounded-2xl bg-card shadow-floating border border-border/60 px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="h-10 w-10 rounded-xl bg-success/15 text-success flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Verified host</p>
                <p className="text-sm font-semibold text-foreground">Replied in 12 min</p>
              </div>
            </div>

            <div className="absolute -right-4 bottom-12 rounded-2xl bg-card shadow-floating border border-border/60 px-4 py-3 animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-star text-star" />
                ))}
              </div>
              <p className="text-sm font-semibold text-foreground">"Felt at home day one"</p>
              <p className="text-xs text-muted-foreground mt-0.5">— Lucas, exchange student</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
