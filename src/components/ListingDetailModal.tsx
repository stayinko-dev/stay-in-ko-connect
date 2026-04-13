import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Users, BedDouble, Bath, ShieldCheck, MessageCircle, CalendarDays } from "lucide-react";
import { Listing } from "@/data/mockListings";

interface ListingDetailModalProps {
  listing: Listing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ListingDetailModal = ({ listing, open, onOpenChange }: ListingDetailModalProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [months, setMonths] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  if (!listing) return null;

  const totalPrice = listing.price * months;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Image gallery */}
        <div className="relative">
          <img
            src={listing.images[selectedImage]}
            alt={listing.title}
            className="w-full aspect-[16/9] object-cover rounded-t-lg"
          />
          <div className="absolute bottom-3 left-3 flex gap-2">
            {listing.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${
                  i === selectedImage ? "border-primary scale-105" : "border-card/60 opacity-70"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            {listing.tags.map((tag, j) => (
              <Badge
                key={j}
                className={
                  listing.tagColors[j]
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/90 text-foreground backdrop-blur-sm"
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-5">
          <DialogHeader>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <MapPin className="h-4 w-4" />
              {listing.location} · {listing.university}
            </div>
            <DialogTitle className="text-xl font-display font-bold text-foreground">
              {listing.title}
            </DialogTitle>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 text-star fill-star" />
              <span className="font-semibold text-sm">{listing.rating}</span>
            </div>
          </DialogHeader>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{listing.guests} guest(s)</span>
            <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" />{listing.beds} bed</span>
            <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{listing.baths} bath</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>

          <div className="flex flex-wrap gap-2">
            {listing.amenities.map((a) => (
              <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
            ))}
          </div>

          {/* Rental period selector */}
          <div className="bg-secondary rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Select Rental Period
            </div>
            <div className="flex items-center gap-3">
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setMonths(m)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    months === m
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {m} mo
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">Total ({months} month{months > 1 ? "s" : ""})</span>
              <span className="text-xl font-bold text-foreground">
                ₩{totalPrice.toLocaleString()}
              </span>
            </div>
            {listing.deposit && !listing.noDeposit && (
              <p className="text-xs text-muted-foreground">{listing.deposit}</p>
            )}
          </div>

          <Button className="w-full h-12 text-base font-semibold rounded-xl gap-2">
            {listing.noDeposit ? "🎉 Book with No Deposit" : "Request Booking"}
          </Button>

          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Secure payment guaranteed · Safe transactions</span>
          </div>

          {/* Host info & message */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Host: {listing.hostName}</p>
                <p className="text-xs text-muted-foreground">{listing.hostResponse}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setShowMessage(!showMessage)}
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            </div>
            {showMessage && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Send a message to the host..."
                  className="w-full bg-secondary rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none h-20 font-body"
                />
                <Button size="sm" className="w-full">Send Message</Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListingDetailModal;
