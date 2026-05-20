import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/data/concierge";

const ConciergeSection = () => {
  return (
    <section className="border-y border-border/60 bg-gradient-to-br from-primary-soft/40 via-background to-background py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              StayInKo Concierge
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl">
              Need help in Korea? <span className="text-primary">We've got a local for that.</span>
            </h2>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              Hospital visits, airport pickup, paperwork, translation — request a verified local helper in minutes.
            </p>
          </div>
          <Button asChild size="lg" variant="gradient" className="shrink-0">
            <Link to="/concierge">
              Request Help <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {SERVICE_CATEGORIES.map((s) => (
            <Link
              key={s.id}
              to={`/concierge?service=${s.id}`}
              className="group rounded-2xl border border-border/70 bg-card p-4 text-center shadow-soft transition-base hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow"
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/70 group-hover:bg-primary-soft/70">
                <s.icon className={`h-5 w-5 ${s.accent}`} />
              </div>
              <div className="mt-3 text-sm font-semibold text-foreground">{s.name}</div>
              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConciergeSection;