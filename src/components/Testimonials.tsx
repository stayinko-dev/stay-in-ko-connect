import { Star, Quote } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const reviews = [
  {
    name: "Lucas",
    role: "Exchange student · France",
    initial: "L",
    property: "Enkoplex 1, Seoul",
    text: "I had an amazing experience. The place was absolutely perfect — clean, comfortable, and thoughtfully designed. Everything felt well taken care of from day one.",
    rating: 5,
  },
  {
    name: "Jessica",
    role: "Researcher · USA",
    initial: "J",
    property: "Private Studio in Hongdae",
    text: "Amazing location, peaceful neighborhood, and the host was incredibly responsive. The apartment was brand new and had everything I needed.",
    rating: 5,
  },
  {
    name: "Amit",
    role: "Engineer · India",
    initial: "A",
    property: "Hongdae BlueSky",
    text: "1 minute walk from Hongik Station. The host is very kind and helpful. Booking was the smoothest part of my move to Korea.",
    rating: 5,
  },
];

const trustLogos = ["Yonsei Univ.", "SNU", "Hanyang", "KAIST", "Samsung", "LG"];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="Loved by global guests"
          title="Real stories, real homes."
          description="Thousands of international students and professionals have made StayInKo their first stop in Korea."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <Card
              key={i}
              className="group relative h-full border-border/70 transition-base hover:-translate-y-1 hover:shadow-floating"
            >
              <CardContent className="p-7">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-star fill-star" />
                  ))}
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                  <div className="h-11 w-11 rounded-full bg-gradient-primary flex items-center justify-center text-base font-bold text-primary-foreground shadow-glow">
                    {review.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{review.role}</p>
                    <p className="text-[11px] text-primary mt-0.5 truncate">{review.property}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-16 rounded-2xl border border-border/60 bg-surface/60 p-6 md:p-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <Badge variant="muted" className="text-[11px] uppercase tracking-wider">
              Trusted by guests from
            </Badge>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {trustLogos.map((logo) => (
                <span key={logo} className="text-sm font-semibold text-muted-foreground/80 tracking-tight">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
