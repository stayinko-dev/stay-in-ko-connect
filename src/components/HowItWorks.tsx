import { Search, MessageSquare, KeyRound, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Discover your home",
    description: "Browse verified listings filtered by university, subway line, budget, and amenities — all in English.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Chat & book safely",
    description: "Message the host directly, choose your dates, and book. Your payment is protected in escrow until check-in.",
  },
  {
    icon: KeyRound,
    step: "03",
    title: "Move in stress-free",
    description: "Get keys, settle in, and enjoy. Our team is one tap away if anything needs attention.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="How it works"
          title="From search to keys in 3 steps."
          description="Designed to remove every awkward moment of renting abroad."
        />

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-16 hidden md:block">
            <div className="mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {steps.map((s, i) => (
            <div key={s.step} className="relative">
              <div className="relative flex flex-col items-start rounded-3xl border border-border/70 bg-card p-7 shadow-soft transition-base hover:-translate-y-1 hover:shadow-floating">
                <div className="flex w-full items-center justify-between mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="text-5xl font-display font-bold text-primary/15">{s.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{s.description}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-4 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-primary/40 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
