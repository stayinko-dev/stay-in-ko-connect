import { ArrowRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary px-8 py-14 md:px-14 md:py-20 shadow-overlay">
          {/* Decorative pattern */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-2xl" />

          <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground text-balance leading-tight">
                Your Korea chapter starts here.
              </h2>
              <p className="mt-4 text-base md:text-lg text-primary-foreground/85 max-w-xl text-pretty">
                Join thousands of students and professionals who found their home with StayInKo — no deposits, no headaches.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <Button asChild size="xl" variant="secondary" className="bg-card text-foreground hover:bg-card/90">
                <Link to="/signup">
                  Get started free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/host">
                  <Building2 className="h-5 w-5" />
                  Become a host
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
