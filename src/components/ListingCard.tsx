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
      className="group grid grid-cols-[7.5rem_minmax(0,1fr)] overflow-hidden rounded-xl border border-border/60 bg-card text-left shadow-soft transition-base hover:shadow-floating sm:block sm:rounded-2xl sm:hover:-translate-y-1"
    >
      <div className="relative min-h-40 overflow-hidden sm:aspect-[4/3] sm:min-h-0">
        <img
          src={cover}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] gap-1 sm:left-3 sm:top-3 sm:flex-wrap sm:gap-2">
          {tags.slice(0, 2).map((tag, i) => (
            <span
              key={`${listing.id}-${tag}-${i}`}
              className={`max-w-full truncate rounded-full px-2 py-1 text-[10px] font-semibold sm:px-3 sm:text-xs ${
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
          <div className="absolute bottom-2 left-2 rounded-full bg-success px-2 py-1 text-[10px] font-bold text-success-foreground sm:bottom-auto sm:left-auto sm:right-3 sm:top-3 sm:px-3 sm:text-xs">
            No Deposit
          </div>
        ) : null}
      </div>

      <div className="min-w-0 p-3.5 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{listing.location_label}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-star text-star" />
            {Number(listing.rating).toFixed(1)}
          </div>
        </div>

        <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-5 text-foreground sm:text-base">{listing.title}</h3>

        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground sm:gap-4">
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{listing.guests}</span>
          <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{listing.beds} bed</span>
          <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" />{listing.baths} bath</span>
        </div>

        <div>
          <span className="text-base font-bold text-foreground sm:text-lg">
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
