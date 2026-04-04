import { Star } from "lucide-react";

const reviews = [
  {
    name: "Lucas",
    initial: "L",
    property: "Enkoplex 1",
    text: "I had an amazing experience. The place was absolutely perfect — clean, comfortable, and thoughtfully designed. Everything felt well taken care of.",
    rating: 5,
  },
  {
    name: "Jessica",
    initial: "J",
    property: "Private Studio in Hongdae",
    text: "Amazing location, peaceful neighborhood, the host was very responsive! The apartment was brand new and had everything I needed. Thank you so much!",
    rating: 5,
  },
  {
    name: "Amit",
    initial: "A",
    property: "Hongdae BlueSky",
    text: "The location is great, 1 minute walk from Hongik Station. The host is very kind and helpful. Everything in the apartment is brand new!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">What Our Guests Say</h2>
          <p className="text-muted-foreground mt-3 font-body">Real reviews from international tenants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-star fill-star" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-6 font-body">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {review.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-body">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.property}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
