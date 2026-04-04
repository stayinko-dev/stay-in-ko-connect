import citySeoul from "@/assets/city-seoul.jpg";
import cityBusan from "@/assets/city-busan.jpg";
import cityDaejeon from "@/assets/city-daejeon.jpg";
import cityGwangju from "@/assets/city-gwangju.jpg";

const cities = [
  { name: "Seoul", properties: 6, image: citySeoul },
  { name: "Busan", properties: 1, image: cityBusan },
  { name: "Daejeon", properties: 1, image: cityDaejeon },
  { name: "Gwangju", properties: 1, image: cityGwangju },
];

const PopularCities = () => {
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
            <a
              key={city.name}
              href="#"
              className="group relative aspect-square rounded-2xl overflow-hidden"
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
                <p className="text-sm text-primary-foreground/80">{city.properties} properties</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
