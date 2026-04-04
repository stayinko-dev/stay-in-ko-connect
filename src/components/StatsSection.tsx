import { Building2, Users, CalendarCheck, MapPinned } from "lucide-react";

const stats = [
  { icon: Building2, value: "9", label: "Verified Properties" },
  { icon: Users, value: "5", label: "Happy Guests" },
  { icon: CalendarCheck, value: "5", label: "Successful Bookings" },
  { icon: MapPinned, value: "4", label: "Cities in Korea" },
];

const StatsSection = () => {
  return (
    <section className="bg-stats-bg py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-stats-foreground/80" />
              <div className="text-4xl font-display font-bold text-stats-foreground">{stat.value}</div>
              <p className="text-sm text-stats-foreground/80 mt-1 font-body">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
