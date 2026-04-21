import { ArrowRight, BadgeDollarSign, Building2, Globe2, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const pillars = [
  {
    icon: Globe2,
    title: "Global demand fit",
    description: "Built for international students, visiting researchers, and project-based residents looking for a smooth Korea landing.",
  },
  {
    icon: ShieldCheck,
    title: "Trust-driven workflow",
    description: "Profiles, messaging, bookings, and payout setup now sit in one connected product flow instead of isolated mock screens.",
  },
  {
    icon: BadgeDollarSign,
    title: "Host monetization",
    description: "Hosts can test no-deposit offers, improve response speed, and manage inventory with a clearer path to revenue.",
  },
];

const BusinessMomentum = () => {
  return (
    <section className="bg-surface py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Business Ready
            </span>
            <h2 className="mt-6 text-3xl font-bold text-foreground md:text-4xl">
              This is no longer just a landing page. It is becoming an operating system for Korea stays.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              StayInKo now starts to connect renter acquisition, host operations, and early monetization in a single product flow.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/signup">
                  Start renter acquisition
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/host">
                  Open host dashboard
                  <Building2 className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="border-border/70 bg-background/80">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <pillar.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{pillar.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessMomentum;
