import { Search, CreditCard, UserCheck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "Step 1",
    title: "Explore stays",
    description: "Check photos and details. If you have questions, feel free to contact the host.",
  },
  {
    icon: CreditCard,
    step: "Step 2",
    title: "Payment completed",
    description: "Payment is made upon request agreement. Your money is protected until move-in.",
  },
  {
    icon: UserCheck,
    step: "Step 3",
    title: "Host confirmation",
    description: "The host will respond within 24 hours to confirm your booking.",
  },
  {
    icon: CheckCircle,
    step: "Step 4",
    title: "Agreement confirmed",
    description: "Your agreement will either be confirmed or fully refunded.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">How StayInKo Works</h2>
          <p className="text-muted-foreground mt-3 font-body">Simple, safe, and designed for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{s.step}</span>
              <h3 className="text-lg font-semibold text-foreground mt-2 mb-2 font-body">{s.title}</h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
