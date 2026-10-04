import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Home, Loader2, Star, UserCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reviewSchema = z.object({
  rating: z.number().int().min(1, "Pick a star rating").max(5),
  comment: z.string().trim().max(2000, "Max 2000 characters"),
});

type StayItem = { id: string; check_in: string; check_out: string; status: string | null; payment_status: string; listing_title: string; reviewed: boolean };
type HelpItem = { id: string; service: string; area: string; status: string; helper_name: string | null; reviewed: boolean };

const isStayDone = (s: StayItem) => s.status === "confirmed" || s.status === "completed" || s.payment_status === "paid";

export const StarPicker = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1" role="radiogroup" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" aria-label={`${n} stars`} onClick={() => onChange(n)} className="p-1">
        <Star className={`h-7 w-7 ${n <= value ? "fill-star text-star" : "text-muted-foreground"}`} />
      </button>
    ))}
  </div>
);

const ReviewForm = ({ onSubmit }: { onSubmit: (rating: number, comment: string) => Promise<boolean> }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    const parsed = reviewSchema.safeParse({ rating, comment });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const ok = await onSubmit(parsed.data.rating, parsed.data.comment);
    setBusy(false);
    if (ok) { setRating(0); setComment(""); }
  };
  return (
    <div className="mt-3 space-y-2 rounded-xl bg-secondary/50 p-3">
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={comment}
        maxLength={2000}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share what went well and what could be better..."
        className="min-h-20 w-full rounded-lg border border-input bg-background p-3 text-sm outline-none"
      />
      <Button size="sm" className="w-full" onClick={submit} disabled={busy}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit review
      </Button>
    </div>
  );
};

const ReviewCenter = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(true);
  const [stays, setStays] = useState<StayItem[]>([]);
  const [helps, setHelps] = useState<HelpItem[]>([]);

  const load = useCallback(async () => {
    const [b, r, h, hr] = await Promise.all([
      supabase.from("bookings").select("id, check_in, check_out, status, payment_status, listings(title)").eq("guest_id", userId).order("check_in", { ascending: false }),
      supabase.from("reviews").select("booking_id").eq("reviewer_id", userId),
      supabase.from("help_requests").select("id, service, area, status, helper_name, helper_ref").eq("user_id", userId).not("helper_ref", "is", null).order("created_at", { ascending: false }),
      supabase.from("helper_reviews").select("request_id").eq("user_id", userId),
    ]);
    const reviewedB = new Set((r.data ?? []).map((x) => x.booking_id));
    const reviewedH = new Set((hr.data ?? []).map((x) => x.request_id));
    setStays(
      (b.data ?? [])
        .filter((x) => x.status !== "cancelled")
        .map((x) => ({
          id: x.id, check_in: x.check_in, check_out: x.check_out, status: x.status, payment_status: x.payment_status,
          listing_title: (x.listings as { title: string } | null)?.title ?? "Stay",
          reviewed: reviewedB.has(x.id),
        })),
    );
    setHelps((h.data ?? []).filter((x) => x.status !== "cancelled").map((x) => ({ ...x, reviewed: reviewedH.has(x.id) })));
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const reviewStay = async (bookingId: string, rating: number, comment: string) => {
    // listing_id / host_id are filled in server-side from the booking
    const { error } = await supabase.from("reviews").insert({ booking_id: bookingId, reviewer_id: userId, rating, comment: comment || null, listing_id: "00000000-0000-0000-0000-000000000000", host_id: userId });
    if (error) { toast.error(error.message); return false; }
    toast.success("Thanks! Your stay review is live.");
    load();
    return true;
  };

  const completeHelp = async (id: string) => {
    const { error } = await supabase.from("help_requests").update({ status: "completed" }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const reviewHelper = async (requestId: string, rating: number, comment: string) => {
    const { error } = await supabase.from("helper_reviews").insert({ request_id: requestId, user_id: userId, rating, comment: comment || null, helper_id: "00000000-0000-0000-0000-000000000000" });
    if (error) { toast.error(error.message); return false; }
    toast.success("Thanks! Your helper review is live.");
    load();
    return true;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Reviews</CardTitle>
        <p className="text-sm text-muted-foreground">Rate completed stays and helpers. Ratings shape search results for everyone.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
        ) : (
          <>
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><Home className="h-4 w-4 text-primary" /> My stays</p>
              {stays.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
              <div className="space-y-3">
                {stays.map((s) => (
                  <div key={s.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{s.listing_title}</p>
                        <p className="text-xs text-muted-foreground">{s.check_in} → {s.check_out}</p>
                      </div>
                      {s.reviewed ? (
                        <span className="flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-4 w-4" /> Reviewed</span>
                      ) : !isStayDone(s) ? (
                        <span className="text-xs text-muted-foreground">Review after booking is confirmed</span>
                      ) : null}
                    </div>
                    {!s.reviewed && isStayDone(s) && <ReviewForm onSubmit={(r, c) => reviewStay(s.id, r, c)} />}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold"><UserCheck className="h-4 w-4 text-primary" /> My helpers</p>
              {helps.length === 0 && <p className="text-sm text-muted-foreground">No helper requests yet.</p>}
              <div className="space-y-3">
                {helps.map((h) => (
                  <div key={h.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{h.helper_name ?? "Helper"}</p>
                        <p className="text-xs text-muted-foreground">{h.service} · {h.area}</p>
                      </div>
                      {h.reviewed ? (
                        <span className="flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-4 w-4" /> Reviewed</span>
                      ) : h.status !== "completed" ? (
                        <Button size="sm" variant="outline" onClick={() => completeHelp(h.id)}>Mark as done</Button>
                      ) : null}
                    </div>
                    {!h.reviewed && h.status === "completed" && <ReviewForm onSubmit={(r, c) => reviewHelper(h.id, r, c)} />}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCenter;
