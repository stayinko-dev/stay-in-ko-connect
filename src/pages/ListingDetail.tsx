import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  CalendarDays,
  GraduationCap,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Train,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ListingRow, resolveImage } from "@/hooks/useListings";
import { toast } from "sonner";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<ListingRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [months, setMonths] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [savingFav, setSavingFav] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("listings").select("*").eq("id", id).maybeSingle();
      if (cancelled) return;
      if (error) toast.error(error.message);
      setListing((data as ListingRow) || null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!user || !id) {
      setIsFav(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", id)
        .maybeSingle();
      if (!cancelled) setIsFav(!!data);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please log in to save favorites.");
      navigate("/login");
      return;
    }
    if (!listing) return;
    setSavingFav(true);
    if (isFav) {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listing.id);
      if (error) toast.error(error.message);
      else setIsFav(false);
    } else {
      const { error } = await supabase.from("favorites").insert({ user_id: user.id, listing_id: listing.id });
      if (error) toast.error(error.message);
      else setIsFav(true);
    }
    setSavingFav(false);
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please log in to book.");
      navigate("/login");
      return;
    }
    if (!listing) return;
    const checkIn = new Date();
    const checkOut = new Date();
    checkOut.setMonth(checkOut.getMonth() + months);
    const { error } = await supabase.from("bookings").insert({
      listing_id: listing.id,
      guest_id: user.id,
      host_id: listing.host_id,
      check_in: checkIn.toISOString().split("T")[0],
      check_out: checkOut.toISOString().split("T")[0],
      total_amount: listing.price * months,
      status: "pending",
    });
    if (error) toast.error(error.message);
    else toast.success("Booking request sent to the host.");
  };

  const sendMessage = async () => {
    if (!user) {
      toast.error("Please log in to message the host.");
      navigate("/login");
      return;
    }
    if (!listing || !message.trim()) return;
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: listing.host_id,
      content: message.trim(),
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Message sent.");
      setMessage("");
      setShowMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Listing not found</h1>
          <Button asChild className="mt-6">
            <Link to="/search">Back to search</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = listing.images || [];
  const tags = listing.tags || [];
  const tagColors = listing.tag_colors || [];
  const amenities = listing.amenities || [];
  const totalPrice = listing.price * months;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-24 lg:pb-8">
        {/* Mobile: full-bleed image gallery with snap scroll */}
        <div className="relative lg:container lg:mx-auto lg:px-8 lg:py-8">
          <Link
            to="/search"
            className="absolute top-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow-soft lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="lg:hidden">
            <div className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide">
              {images.length > 0 ? (
                images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-screen shrink-0 snap-center"
                    onScroll={(e) => {
                      const el = e.currentTarget;
                      const idx = Math.round(el.scrollLeft / el.clientWidth);
                      setSelectedImage(idx);
                    }}
                  >
                    <img
                      src={resolveImage(img)}
                      alt={`${listing.title} ${i + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="w-screen shrink-0 snap-center">
                  <img
                    src="/placeholder.svg"
                    alt={listing.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              )}
            </div>
            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="flex justify-center gap-1.5 py-3">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === selectedImage ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop image gallery */}
          <div className="hidden lg:block">
            <Link
              to="/search"
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to search
            </Link>

            <div className="relative overflow-hidden rounded-2xl border border-border shadow-soft">
              <img
                src={resolveImage(images[selectedImage] || "")}
                alt={listing.title}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {tags.map((tag, i) => (
                  <Badge
                    key={`${listing.id}-${tag}-${i}`}
                    className={
                      tagColors[i]
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/90 text-foreground backdrop-blur-sm"
                    }
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <button
                onClick={toggleFavorite}
                disabled={savingFav}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm shadow-soft transition-base hover:scale-105"
              >
                <Heart className={`h-5 w-5 ${isFav ? "fill-primary text-primary" : "text-foreground"}`} />
              </button>
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-base ${
                      i === selectedImage ? "border-primary" : "border-transparent opacity-70"
                    }`}
                  >
                    <img src={resolveImage(img)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 pt-4 lg:grid lg:grid-cols-[1.4fr_0.9fr] lg:gap-8 lg:px-8 lg:pt-8">
          <div>
            {/* Mobile header info */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground lg:mt-8">
              <MapPin className="h-4 w-4" />
              {listing.location_label}
              {listing.university_area && <span>· {listing.university_area}</span>}
            </div>
            <h1 className="mt-2 text-2xl font-display font-bold text-foreground lg:text-3xl">
              {listing.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="flex items-center gap-1 font-semibold">
                <Star className="h-4 w-4 fill-star text-star" /> {Number(listing.rating).toFixed(1)}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" /> {listing.guests} guests
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <BedDouble className="h-4 w-4" /> {listing.beds} bed
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Bath className="h-4 w-4" /> {listing.baths} bath
              </span>
            </div>

            {/* Desktop tags (mobile tags shown on image) */}
            <div className="mt-3 hidden flex-wrap gap-2 lg:flex">
              {tags.map((tag, i) => (
                <Badge
                  key={`dt-${listing.id}-${tag}-${i}`}
                  className={
                    tagColors[i]
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/90 text-foreground backdrop-blur-sm"
                  }
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <p className="mt-5 leading-relaxed text-foreground/80">{listing.description}</p>

            {(listing.nearby_subway || listing.nearby_university) && (
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:gap-3">
                {listing.nearby_subway && (
                  <div className="flex items-center gap-3 rounded-xl bg-secondary p-3 lg:p-4">
                    <Train className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{listing.nearby_subway}</span>
                  </div>
                )}
                {listing.nearby_university && (
                  <div className="flex items-center gap-3 rounded-xl bg-secondary p-3 lg:p-4">
                    <GraduationCap className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{listing.nearby_university}</span>
                  </div>
                )}
              </div>
            )}

            {amenities.length > 0 && (
              <div className="mt-6 lg:mt-8">
                <h2 className="mb-2 text-base font-semibold lg:mb-3 lg:text-lg">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a) => (
                    <Badge key={a} variant="secondary">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-border bg-card p-4 lg:mt-8 lg:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hosted by</p>
                  <p className="font-semibold">{listing.host_name}</p>
                  {listing.host_response && (
                    <p className="mt-1 text-xs text-muted-foreground">{listing.host_response}</p>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowMessage((v) => !v)}>
                  <MessageCircle className="h-4 w-4" /> Message
                </Button>
              </div>
              {showMessage && (
                <div className="mt-4 space-y-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! I'm interested in your place..."
                    className="h-24 w-full resize-none rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-ring"
                  />
                  <Button size="sm" onClick={sendMessage} disabled={!message.trim()}>
                    Send message
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop booking sidebar */}
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-floating">
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  {listing.price_display || `${listing.price.toLocaleString("ko-KR")}원`}
                </span>
                <span className="text-muted-foreground"> / {listing.period}</span>
                {listing.deposit_display && !listing.no_deposit && (
                  <p className="mt-1 text-xs text-muted-foreground">{listing.deposit_display}</p>
                )}
              </div>

              <div className="mb-4 rounded-xl bg-secondary p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <CalendarDays className="h-4 w-4 text-primary" /> Rental period
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 6, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMonths(m)}
                      className={`rounded-lg py-2 text-sm font-medium transition-base ${
                        months === m
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground hover:bg-muted"
                      }`}
                    >
                      {m}mo
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold">{totalPrice.toLocaleString("ko-KR")}원</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleBooking}>
                {listing.no_deposit ? "Book with no deposit" : "Request booking"}
              </Button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Secure payment & verified host
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky bottom booking bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="shrink-0">
            <span className="text-xl font-bold">
              {listing.price_display || `${listing.price.toLocaleString("ko-KR")}원`}
            </span>
            <span className="text-sm text-muted-foreground"> / {listing.period}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              disabled={savingFav}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-soft"
            >
              <Heart className={`h-5 w-5 ${isFav ? "fill-primary text-primary" : "text-foreground"}`} />
            </button>
            <Button size="default" onClick={handleBooking} className="px-6">
              {listing.no_deposit ? "Book now" : "Request"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListingDetail;
