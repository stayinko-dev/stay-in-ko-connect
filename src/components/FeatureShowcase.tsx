import { Map, Heart, MessageSquare, CalendarRange, BadgeCheck, Train } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Map,
    title: "Map & list view",
    description: "Toggle between immersive map exploration and detailed list view to find homes near your campus or office.",
    tag: "Discovery",
  },
  {
    icon: Train,
    title: "Subway & university filters",
    description: "Filter by nearby subway lines or universities. See exact walking distance before you commit.",
    tag: "Filters",
  },
  {
    icon: Heart,
    title: "Save & compare",
    description: "Heart any place to revisit later. Build a shortlist and compare amenities side by side.",
    tag: "Favorites",
  },
  {
    icon: MessageSquare,
    title: "Direct host chat",
    description: "Ask anything in English before booking. Hosts typically respond within an hour.",
    tag: "Communication",
  },
  {
    icon: CalendarRange,
    title: "Flexible booking",
    description: "Pick exact check-in and check-out dates. See total price upfront — no hidden fees.",
    tag: "Booking",
  },
  {
    icon: BadgeCheck,
    title: "Verified reviews",
    description: "Read honest reviews from real guests who actually stayed. Submit your own after checkout.",
    tag: "Trust",
  },
];

const FeatureShowcase = () => {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="Everything you need"
          title="Powerful features, zero friction."
          description="A complete toolkit to find, evaluate, and book your home in Korea."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group h-full border-border/70 bg-card/80 backdrop-blur-sm transition-base hover:border-primary/40 hover:shadow-elevated"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow/40">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="muted" className="text-[10px] uppercase tracking-wider">
                    {f.tag}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
