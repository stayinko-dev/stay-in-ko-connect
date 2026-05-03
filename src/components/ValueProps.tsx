import { Globe2, ShieldCheck, Wallet, Languages } from "lucide-react";
import SectionHeader from "@/components/ui/section-header";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Wallet,
    title: "No-deposit friendly",
    description: "Skip the lump-sum jeonse. Browse short and long-term homes with flexible payment terms designed for newcomers.",
  },
  {
    icon: Languages,
    title: "English-first experience",
    description: "Listings, messaging, contracts, and support — all in clear English. No Naver translate required.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & protected",
    description: "Every host is screened. Your payment is held safely until you check in and confirm everything's right.",
  },
  {
    icon: Globe2,
    title: "Built for global stays",
    description: "From semester abroad to a 2-year work contract, find a home that matches how long you'll be in Korea.",
  },
];

const ValueProps = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          align="center"
          eyebrow="Why StayInKo"
          title="Renting in Korea, finally on your terms."
          description="We rebuilt the housing experience around what international students and professionals actually need."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <Card
              key={v.title}
              className="group relative overflow-hidden border-border/70 transition-base hover:-translate-y-1 hover:shadow-floating"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary mb-5">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{v.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
