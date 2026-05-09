import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import ListingCard from "./ListingCard";

const FeaturedHomes = () => {
  const { listings, loading } = useListings();
  const featured = listings.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Featured Homes</h2>
            <p className="text-muted-foreground mt-2 font-body">Handpicked properties with verified hosts.</p>
          </div>
          <Link to="/search" className="hidden md:flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <Link to="/search" className="md:hidden flex items-center justify-center gap-1 text-sm font-semibold text-foreground hover:text-primary mt-8">
          View all properties <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedHomes;
