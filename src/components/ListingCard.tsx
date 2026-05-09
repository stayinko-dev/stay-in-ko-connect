import { Bath, BedDouble, MapPin, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { ListingRow, resolveImage } from "@/hooks/useListings";

const ListingCard = ({ listing }: { listing: ListingRow }) => {
  const cover = listing.images?.[0] ? resolveImage(listing.images[0]) : "";
  const tags = listing.tags || [];
  const tagColors = listing.tag_colors || [];

  return (
    <Link
      to={`/properties/${listing.id}`}
      className="group block overflow-hidden rounded-2xl bg-card text-left shadow-soft border border-border/60 transition-base hover:-translate-y-1 hover:shadow-floating"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={cover}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={`${listing.id}-${tag}-${i}`}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                tagColors[i]
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/90 text-foreground backdrop-blur-sm"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        {listing.no_deposit ? (
          <div className="absolute top-3 right-3 rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground">
            No Deposit
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {listing.location_label}
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-star text-star" />
            {Number(listing.rating).toFixed(1)}
          </div>
        </div>

        <h3 className="mb-2 font-semibold text-foreground line-clamp-1">{listing.title}</h3>

        <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{listing.guests}</span>
          <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{listing.beds} bed</span>
          <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{listing.baths} bath</span>
        </div>

        <div>
          <span className="text-lg font-bold text-foreground">
            {listing.price_display || `${listing.price.toLocaleString("ko-KR")}원`}
          </span>
          <span className="text-sm text-muted-foreground"> / {listing.period}</span>
          {listing.deposit_display && !listing.no_deposit ? (
            <p className="text-xs text-muted-foreground mt-0.5">{listing.deposit_display}</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
