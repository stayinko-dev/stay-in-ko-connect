import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useListings } from "@/hooks/useListings";
import ListingCard from "./ListingCard";

const FeaturedHomes = () => {
  const { listings, loading } = useListings();
  const featured = listings.slice(0, 3);

  return (
    <section className="bg-background py-12 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-6 flex items-end justify-between md:mb-10">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground md:text-4xl">Featured Homes</h2>
            <p className="mt-1 text-sm text-muted-foreground md:mt-2 md:text-base">Handpicked stays with verified hosts.</p>
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
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        <Link to="/search" className="mt-6 flex min-h-11 items-center justify-center gap-1 rounded-lg border border-border text-sm font-semibold text-foreground hover:text-primary md:hidden">
          View all properties <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default FeaturedHomes;
