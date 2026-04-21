import { useState } from "react";
import {
  Bath,
  BedDouble,
  CalendarDays,
  GraduationCap,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Train,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListingRow, resolveImage } from "@/hooks/useListings";

interface ListingDetailModalProps {
  listing: ListingRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ListingDetailModal = ({ listing, open, onOpenChange }: ListingDetailModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [months, setMonths] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  if (!listing) {
    return null;
  }

  const images = listing.images || [];
  const tags = listing.tags || [];
  const tagColors = listing.tag_colors || [];
  const amenities = listing.amenities || [];
  const totalPrice = listing.price * months;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        <div className="relative">
          <img
            src={resolveImage(images[selectedImage] || "")}
            alt={listing.title}
            className="aspect-[16/9] w-full rounded-t-lg object-cover"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={`${listing.id}-${tag}-${index}`}
                className={
                  tagColors[index] ? "bg-primary text-primary-foreground" : "bg-card/90 text-foreground backdrop-blur-sm"
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {images.map((image, index) => (
              <button
                key={`${listing.id}-image-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`h-10 w-14 overflow-hidden rounded-md border-2 transition-all ${
                  index === selectedImage ? "scale-105 border-primary" : "border-card/60 opacity-70"
                }`}
              >
                <img src={resolveImage(image)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 p-6">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {listing.location_label}
              {listing.university_area ? <span>· {listing.university_area}</span> : null}
            </div>
            <DialogTitle className="text-xl font-bold text-foreground">{listing.title}</DialogTitle>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-4 w-4 fill-star text-star" />
              <span className="text-sm font-semibold">{Number(listing.rating).toFixed(1)}</span>
            </div>
          </DialogHeader>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{listing.guests} guests</span>
            <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{listing.beds} bed</span>
            <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{listing.baths} bath</span>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{listing.description}</p>

          {listing.nearby_subway || listing.nearby_university ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {listing.nearby_subway ? (
                <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                  <Train className="h-4 w-4 text-primary" />
                  <span className="text-xs text-foreground">{listing.nearby_subway}</span>
                </div>
              ) : null}
              {listing.nearby_university ? (
                <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span className="text-xs text-foreground">{listing.nearby_university}</span>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>

          <div className="space-y-3 rounded-xl bg-secondary p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Select rental period
            </div>
            <div className="flex items-center gap-3">
              {[1, 3, 6, 12].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMonths(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    months === value ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {value} mo
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm text-muted-foreground">Total ({months} month{months > 1 ? "s" : ""})</span>
              <span className="text-xl font-bold text-foreground">{totalPrice.toLocaleString("ko-KR")}원</span>
            </div>
            {listing.deposit_display && !listing.no_deposit ? (
              <p className="text-xs text-muted-foreground">{listing.deposit_display}</p>
            ) : null}
          </div>

          <Button className="h-12 w-full rounded-xl text-base font-semibold">
            {listing.no_deposit ? "Book with no deposit" : "Request booking"}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Secure payment workflow and verified host communication</span>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Host: {listing.host_name}</p>
                <p className="text-xs text-muted-foreground">{listing.host_response}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowMessage((value) => !value)}>
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            </div>

            {showMessage ? (
              <div className="mt-3 space-y-2">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Send a message to the host..."
                  className="h-20 w-full resize-none rounded-lg bg-secondary p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <Button size="sm" className="w-full">Send Message</Button>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListingDetailModal;
