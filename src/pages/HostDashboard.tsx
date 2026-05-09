import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Plus,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingWizard, { ListingWizardValues } from "@/components/ListingWizard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { resolveImage } from "@/hooks/useListings";
import { toast } from "sonner";

type DashboardListing = {
  id: string;
  title: string;
  status: string | null;
  price_display: string | null;
  deposit_display: string | null;
  location_label: string | null;
  images: string[] | null;
  bookings_count: number | null;
  views_count: number | null;
  host_response: string | null;
};

type DashboardBooking = {
  id: string;
  check_in: string;
  check_out: string;
  status: string | null;
  total_amount: number | null;
  listing_id: string;
  guest_id: string;
  listings: { title: string } | { title: string }[] | null;
  profiles: { display_name: string | null } | { display_name: string | null }[] | null;
};

type DashboardMessage = {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean | null;
  profiles: { display_name: string | null } | { display_name: string | null }[] | null;
};

type SettlementForm = {
  bank_name: string;
  account_holder: string;
  account_number: string;
  business_number: string;
  settlement_day: string;
};

const emptySettlement: SettlementForm = {
  bank_name: "",
  account_holder: "",
  account_number: "",
  business_number: "",
  settlement_day: "25",
};

const HostDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardSubmitting, setWizardSubmitting] = useState(false);
  const [savingSettlement, setSavingSettlement] = useState(false);
  const [displayName, setDisplayName] = useState("Host");
  const [listings, setListings] = useState<DashboardListing[]>([]);
  const [bookings, setBookings] = useState<DashboardBooking[]>([]);
  const [messages, setMessages] = useState<DashboardMessage[]>([]);
  const [settlement, setSettlement] = useState<SettlementForm>(emptySettlement);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setShowWizard(true);
      const next = new URLSearchParams(searchParams);
      next.delete("new");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const loadDashboard = async () => {
      const [profileResult, listingsResult, bookingsResult, messagesResult, settlementResult] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("listings")
          .select("id, title, status, price_display, deposit_display, location_label, images, bookings_count, views_count, host_response")
          .eq("host_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("bookings")
          .select("id, check_in, check_out, status, total_amount, listing_id, guest_id")
          .eq("host_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("messages")
          .select("id, content, created_at, is_read, sender_id")
          .eq("receiver_id", user.id)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("settlements")
          .select("bank_name, account_holder, account_number, business_number, settlement_day")
          .eq("host_id", user.id)
          .maybeSingle(),
      ]);

      const bookingRows = bookingsResult.data || [];
      const listingIds = [...new Set(bookingRows.map((booking) => booking.listing_id))];
      const guestIds = [...new Set(bookingRows.map((booking) => booking.guest_id))];
      const messageSenderIds = [...new Set((messagesResult.data || []).map((message) => message.sender_id))];

      const [bookingListingTitles, guestProfiles, senderProfiles] = await Promise.all([
        listingIds.length
          ? supabase.from("listings").select("id, title").in("id", listingIds)
          : Promise.resolve({ data: [], error: null }),
        guestIds.length
          ? supabase.from("profiles").select("user_id, display_name").in("user_id", guestIds)
          : Promise.resolve({ data: [], error: null }),
        messageSenderIds.length
          ? supabase.from("profiles").select("user_id, display_name").in("user_id", messageSenderIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (!active) return;

      const listingTitleMap = new Map((bookingListingTitles.data || []).map((item) => [item.id, item.title]));
      const guestProfileMap = new Map((guestProfiles.data || []).map((item) => [item.user_id, item.display_name]));
      const senderProfileMap = new Map((senderProfiles.data || []).map((item) => [item.user_id, item.display_name]));

      setDisplayName(profileResult.data?.display_name || user.email?.split("@")[0] || "Host");
      setListings((listingsResult.data || []) as DashboardListing[]);
      setBookings(
        bookingRows.map((booking) => ({
          ...booking,
          listings: { title: listingTitleMap.get(booking.listing_id) || "Listing" },
          profiles: { display_name: guestProfileMap.get(booking.guest_id) || "Guest" },
        })),
      );
      setMessages(
        (messagesResult.data || []).map((message) => ({
          id: message.id,
          content: message.content,
          created_at: message.created_at,
          is_read: message.is_read,
          profiles: { display_name: senderProfileMap.get(message.sender_id) || "Inquirer" },
        })),
      );

      if (settlementResult.data) {
        setSettlement({
          bank_name: settlementResult.data.bank_name || "",
          account_holder: settlementResult.data.account_holder || "",
          account_number: settlementResult.data.account_number || "",
          business_number: settlementResult.data.business_number || "",
          settlement_day: String(settlementResult.data.settlement_day || 25),
        });
      }

      setLoading(false);
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [user]);

  const stats = useMemo(() => {
    const activeListings = listings.filter((listing) => listing.status === "available").length;
    const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
    const grossRevenue = bookings
      .filter((booking) => booking.status === "confirmed" || booking.status === "completed")
      .reduce((total, booking) => total + (booking.total_amount || 0), 0);
    const unreadMessages = messages.filter((message) => !message.is_read).length;

    return { activeListings, pendingBookings, grossRevenue, unreadMessages };
  }, [bookings, listings, messages]);

  const handleCreateListing = async (values: ListingWizardValues) => {
    if (!user) return;

    setWizardSubmitting(true);

    const monthlyPrice = Number(values.price || 0);
    const deposit = values.noDeposit ? 0 : Number(values.deposit || 0);

    const payload = {
      host_id: user.id,
      host_name: displayName,
      host_response: values.hostResponse,
      title: values.title,
      description: values.description,
      type: values.type,
      address: values.address,
      city: values.city,
      university_area: values.universityArea || null,
      location_label: values.locationLabel,
      nearby_subway: values.nearbySubway || null,
      nearby_university: values.nearbyUniversity || values.universityArea || null,
      price: monthlyPrice,
      price_display: `KRW ${monthlyPrice.toLocaleString("ko-KR")} / month`,
      deposit,
      deposit_display: values.noDeposit ? "No deposit" : `Deposit KRW ${deposit.toLocaleString("ko-KR")}`,
      no_deposit: values.noDeposit,
      beds: Number(values.beds || 1),
      baths: Number(values.baths || 1),
      guests: Number(values.guests || 1),
      area_sqm: values.area ? Number(values.area) : null,
      amenities: values.amenities,
      images: ["/src/assets/listing-1.jpg"],
      tags: values.noDeposit ? ["No Deposit", "New"] : ["New"],
      tag_colors: values.noDeposit ? [true, false] : [false],
      status: "available",
      rating: 5,
      bookings_count: 0,
      views_count: 0,
      period: "month",
    };

    const { data, error } = await supabase
      .from("listings")
      .insert(payload)
      .select("id, title, status, price_display, deposit_display, location_label, images, bookings_count, views_count, host_response")
      .single();

    setWizardSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setListings((current) => [data as DashboardListing, ...current]);
    setShowWizard(false);
    toast.success("Listing published.");
  };

  const saveSettlement = async () => {
    if (!user) return;

    setSavingSettlement(true);

    const payload = {
      host_id: user.id,
      bank_name: settlement.bank_name,
      account_holder: settlement.account_holder,
      account_number: settlement.account_number,
      business_number: settlement.business_number,
      settlement_day: Number(settlement.settlement_day || 25),
    };

    const { error } = await supabase.from("settlements").upsert(payload, { onConflict: "host_id" });

    setSavingSettlement(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Payout details saved.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-10 lg:px-8">
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <section className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-primary px-8 py-10 text-primary-foreground">
                    <Link to="/" className="inline-flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-primary-foreground">
                      <ArrowLeft className="h-4 w-4" />
                      Back to home
                    </Link>
                    <h1 className="mt-4 text-3xl font-bold">{displayName}'s host control room</h1>
                    <p className="mt-2 max-w-2xl text-sm text-primary-foreground/85">
                      Run listings, booking response, renter inquiries, and payout setup from one practical dashboard.
                    </p>
                  </div>
                  <div className="grid gap-4 px-8 py-8 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricCard icon={Building2} label="Active listings" value={`${stats.activeListings}`} />
                    <MetricCard icon={CalendarDays} label="Pending bookings" value={`${stats.pendingBookings}`} />
                    <MetricCard icon={TrendingUp} label="Gross revenue" value={`KRW ${stats.grossRevenue.toLocaleString("ko-KR")}`} />
                    <MetricCard icon={Mail} label="Unread inquiries" value={`${stats.unreadMessages}`} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">This week's actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ActionItem text="Clear pricing, deposit policy, and strong photos improve conversion." />
                  <ActionItem text="Fast replies on pending bookings are a key trust signal for international renters." />
                  <ActionItem text="Saving payout details now makes later operations much smoother." />
                  <Button className="mt-3 w-full" onClick={() => setShowWizard(true)}>
                    <Plus className="h-4 w-4" />
                    Publish new listing
                  </Button>
                </CardContent>
              </Card>
            </section>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="mb-6 h-auto flex-wrap gap-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="listings">Listings</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="settlement">Payouts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Listings ready to convert</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {listings.slice(0, 3).map((listing) => (
                        <div key={listing.id} className="flex items-center gap-4 rounded-2xl border border-border p-4">
                          <img
                            src={resolveImage(listing.images?.[0] || "/src/assets/listing-1.jpg")}
                            alt={listing.title}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{listing.title}</p>
                              <StatusBadge status={listing.status} />
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{listing.location_label || "Location details pending"}</p>
                            <p className="mt-1 text-sm text-foreground">{listing.price_display || "Pricing not set"}</p>
                          </div>
                        </div>
                      ))}
                      {!listings.length ? <EmptyText text="No listings yet. Publish your first property to begin host operations." /> : null}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Recent inquiries</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="rounded-2xl border border-border p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-foreground">{unwrapName(message.profiles)}</p>
                            {!message.is_read ? <Badge className="bg-primary/10 text-primary">New</Badge> : null}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{message.content}</p>
                        </div>
                      ))}
                      {!messages.length ? <EmptyText text="No messages yet." /> : null}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="listings">
                <div className="mb-4 flex justify-end">
                  <Button onClick={() => setShowWizard(true)}>
                    <Plus className="h-4 w-4" />
                    Publish listing
                  </Button>
                </div>
                <div className="grid gap-4">
                  {listings.map((listing) => (
                    <Card key={listing.id}>
                      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                        <img
                          src={resolveImage(listing.images?.[0] || "/src/assets/listing-1.jpg")}
                          alt={listing.title}
                          className="h-28 w-full rounded-xl object-cover sm:w-40"
                        />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-semibold text-foreground">{listing.title}</p>
                            <StatusBadge status={listing.status} />
                          </div>
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {listing.location_label || "Location details pending"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>{listing.price_display || "Pricing not set"}</span>
                            <span>{listing.deposit_display || "Deposit details missing"}</span>
                            <span>Views {listing.views_count || 0}</span>
                            <span>Bookings {listing.bookings_count || 0}</span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{listing.host_response || "Response promise not set yet"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {!listings.length ? <EmptyText text="Your host inventory is empty. Publish your first listing." /> : null}
                </div>
              </TabsContent>

              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Booking pipeline</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Guest</TableHead>
                          <TableHead>Listing</TableHead>
                          <TableHead>Check-in</TableHead>
                          <TableHead>Check-out</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>{unwrapName(booking.profiles)}</TableCell>
                            <TableCell>{unwrapTitle(booking.listings)}</TableCell>
                            <TableCell>{booking.check_in}</TableCell>
                            <TableCell>{booking.check_out}</TableCell>
                            <TableCell><StatusBadge status={booking.status} /></TableCell>
                            <TableCell className="text-right">KRW {(booking.total_amount || 0).toLocaleString("ko-KR")}</TableCell>
                          </TableRow>
                        ))}
                        {!bookings.length ? (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <EmptyText text="No booking activity yet." />
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <div className="grid gap-4">
                  {messages.map((message) => (
                    <Card key={message.id}>
                      <CardContent className="flex items-start gap-4 p-5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-foreground">{unwrapName(message.profiles)}</p>
                            {!message.is_read ? <Badge className="bg-primary/10 text-primary">Unread</Badge> : null}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{message.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {!messages.length ? <EmptyText text="No inquiries yet." /> : null}
                </div>
              </TabsContent>

              <TabsContent value="settlement">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Bank account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <LabeledInput label="Bank name" value={settlement.bank_name} onChange={(value) => setSettlement((current) => ({ ...current, bank_name: value }))} />
                      <LabeledInput label="Account holder" value={settlement.account_holder} onChange={(value) => setSettlement((current) => ({ ...current, account_holder: value }))} />
                      <LabeledInput label="Account number" value={settlement.account_number} onChange={(value) => setSettlement((current) => ({ ...current, account_number: value }))} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">Business details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <LabeledInput
                        label="Business registration number"
                        value={settlement.business_number}
                        onChange={(value) => setSettlement((current) => ({ ...current, business_number: value }))}
                      />
                      <LabeledInput
                        label="Payout day"
                        type="number"
                        value={settlement.settlement_day}
                        onChange={(value) => setSettlement((current) => ({ ...current, settlement_day: value }))}
                      />
                      <Button className="w-full" onClick={saveSettlement} disabled={savingSettlement}>
                        {savingSettlement ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                        Save payout details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Publish a new listing</DialogTitle>
          </DialogHeader>
          <ListingWizard onClose={() => setShowWizard(false)} onSubmit={handleCreateListing} submitting={wizardSubmitting} />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="rounded-2xl border border-primary-foreground/20 bg-white/10 p-4 backdrop-blur-sm">
    <div className="mb-2 flex items-center justify-between">
      <p className="text-sm text-primary-foreground/80">{label}</p>
      <Icon className="h-5 w-5 text-primary-foreground" />
    </div>
    <p className="text-2xl font-bold text-primary-foreground">{value}</p>
  </div>
);

const ActionItem = ({ text }: { text: string }) => (
  <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">{text}</div>
);

const EmptyText = ({ text }: { text: string }) => (
  <div className="py-8 text-center text-sm text-muted-foreground">{text}</div>
);

const StatusBadge = ({ status }: { status: string | null }) => {
  const palette: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-slate-100 text-slate-700",
    occupied: "bg-violet-100 text-violet-700",
  };

  return <Badge className={palette[status || ""] || "bg-secondary text-secondary-foreground"}>{status || "unknown"}</Badge>;
};

const unwrapName = (
  value: { display_name: string | null } | { display_name: string | null }[] | null,
) => (Array.isArray(value) ? value[0]?.display_name : value?.display_name) || "User";

const unwrapTitle = (value: { title: string } | { title: string }[] | null) =>
  (Array.isArray(value) ? value[0]?.title : value?.title) || "Listing";

const LabeledInput = ({
  label,
  onChange,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
  </div>
);

export default HostDashboard;
