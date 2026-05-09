import { Link } from "react-router-dom";
import citySeoul from "@/assets/city-seoul.jpg";
import cityBusan from "@/assets/city-busan.jpg";
import cityDaejeon from "@/assets/city-daejeon.jpg";
import cityGwangju from "@/assets/city-gwangju.jpg";
import { useListings } from "@/hooks/useListings";

const cityImages: Record<string, string> = {
  Seoul: citySeoul,
  Busan: cityBusan,
  Daejeon: cityDaejeon,
  Gwangju: cityGwangju,
};

const PopularCities = () => {
  const { listings } = useListings();
  const cities = ["Seoul", "Busan", "Daejeon", "Gwangju"].map((name) => ({
    name,
    image: cityImages[name],
    properties: listings.filter((l) => (l.city || "").toLowerCase() === name.toLowerCase()).length,
  }));

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Explore Popular Cities</h2>
          <p className="text-muted-foreground mt-3 font-body max-w-lg mx-auto">
            From the bustling streets of Seoul to the beautiful beaches of Busan.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cities.map((city) => (
            <Link
              key={city.name}
              to={`/search?city=${city.name}`}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-soft transition-base hover:-translate-y-1 hover:shadow-floating"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                width={640}
                height={640}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="text-xl font-display font-bold text-primary-foreground">{city.name}</h3>
                <p className="text-sm text-primary-foreground/80">
                  {city.properties} {city.properties === 1 ? "property" : "properties"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
