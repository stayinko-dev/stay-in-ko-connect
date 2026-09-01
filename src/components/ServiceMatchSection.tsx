import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, MapPin, Shield, Star, Clock, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useHelpers } from "@/hooks/useHelpers";
import {
  HELP_SERVICES,
  inferArea,
  matchHelpers,
  type ScoredHelper,
} from "@/data/serviceHelpers";

type Props = {
  /** Free-text search the user typed for their stay, e.g. "room near Hanyang University" */
  searchContext?: string;
  className?: string;
};

type ThreadMessage = {
  id: string;
  sender_role: string;
  body: string;
  created_at: string;
};

const ServiceMatchSection = ({ searchContext = "", className = "" }: Props) => {
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");
  const [selected, setSelected] = useState<ScoredHelper | null>(null);
  const [threadRequestId, setThreadRequestId] = useState<string | null>(null);
  const [threadHelper, setThreadHelper] = useState<ScoredHelper | null>(null);

  const { helpers, loading } = useHelpers();
  const area = useMemo(() => inferArea(searchContext), [searchContext]);
  const matches = useMemo(
    () => (serviceId ? matchHelpers(helpers, serviceId, area, language, 3) : []),
    [helpers, serviceId, area, language],
  );

  const service = HELP_SERVICES.find((s) => s.id === serviceId);
  const areaLabel = area?.district ?? "your area";

  return (
    <section className={`rounded-3xl border border-border bg-card p-5 shadow-soft md:p-8 ${className}`}>
      <header className="max-w-2xl">
        <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
          What do you need help with in Korea?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          {area
            ? `We detected ${area.district}, ${area.city} from your search. Pick a service and we'll match 3 verified ${language}-speaking helpers nearby.`
            : `Pick a service and we'll match 3 verified ${language}-speaking helpers near you.`}
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {HELP_SERVICES.map((s) => {
          const active = serviceId === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setServiceId(active ? null : s.id);
                setSelected(null);
              }}
              className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-base ${
                active
                  ? "border-primary bg-primary-soft/60 shadow-soft"
                  : "border-border bg-background hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
              }`}
            >
              <s.icon className={`h-5 w-5 ${s.accent}`} />
              <span className="text-sm font-semibold text-foreground">{s.name}</span>
              <span className="text-xs leading-snug text-muted-foreground">{s.description}</span>
            </button>
          );
        })}
      </div>

      {service && (
        <div className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                3 verified helpers for <span className="text-primary">{service.name}</span> in {areaLabel}
              </h3>
              <p className="text-xs text-muted-foreground">
                Matched by language · area · task fit · rating · identity verification · price
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="match-lang" className="text-xs text-muted-foreground">Language</Label>
              <select
                id="match-lang"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground"
              >
                {["English", "Chinese", "Japanese", "Korean"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {matches.map((h, i) => (
                <Card key={h.id} className="overflow-hidden transition-base hover:-translate-y-0.5 hover:shadow-glow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img src={h.avatar_url ?? ""} alt={h.name} loading="lazy" className="h-14 w-14 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="truncate text-base font-semibold text-foreground">{h.name}</h4>
                          {h.id_verified && <Shield className="h-3.5 w-3.5 shrink-0 text-primary" />}
                          {i === 0 && <Badge className="ml-auto text-[10px]">Best match</Badge>}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-foreground">{h.rating}</span>
                          <span>· {h.reviews_count} reviews · {h.jobs_done} jobs</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {h.district}, {h.city}
                          <span className="ml-1 flex items-center gap-1"><Clock className="h-3 w-3" /> ~{h.response_min}m</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{h.bio}</p>

                    <ul className="mt-3 space-y-1">
                      {h.reasons.map((r) => (
                        <li key={r} className="flex items-center gap-1.5 text-[11px] text-foreground">
                          <Check className="h-3 w-3 text-emerald-500" /> {r}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {h.languages.map((l) => (
                        <Badge key={l} variant="outline" className="text-[10px]">{l}</Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">₩{h.hourly_rate.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground"> / hr</span>
                      </div>
                      <Button size="sm" onClick={() => setSelected(h)}>
                        Choose <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmHelperDialog
        helper={selected}
        serviceId={serviceId}
        serviceName={service?.name}
        defaultArea={area?.district ?? ""}
        onClose={() => setSelected(null)}
        onSent={(requestId, helper) => {
          setSelected(null);
          setThreadHelper(helper);
          setThreadRequestId(requestId);
        }}
      />

      <RequestThreadDialog
        requestId={threadRequestId}
        helper={threadHelper}
        onClose={() => setThreadRequestId(null)}
      />
    </section>
  );
};

const ConfirmHelperDialog = ({
  helper,
  serviceId,
  serviceName,
  defaultArea,
  onClose,
  onSent,
}: {
  helper: ScoredHelper | null;
  serviceId: string | null;
  serviceName?: string;
  defaultArea: string;
  onClose: () => void;
  onSent: (requestId: string, helper: ScoredHelper) => void;
}) => {
  const [area, setArea] = useState(defaultArea);
  const [details, setDetails] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (helper) setArea(defaultArea);
  }, [helper, defaultArea]);

  const submit = async () => {
    if (!helper || !serviceId) return;
    const location = (area || defaultArea).trim();
    if (!location) {
      toast.error("Please enter your location.");
      return;
    }
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSubmitting(false);
      toast.error("Please sign in to send a request.");
      return;
    }
    const { data, error } = await supabase
      .from("help_requests")
      .insert({
        user_id: user.id,
        helper_id: helper.slug,
        helper_ref: helper.id,
        helper_name: helper.name,
        estimated_rate: helper.hourly_rate,
        service: serviceId,
        area: location,
        details: details.trim() || null,
        urgent,
      })
      .select("id")
      .single();
    setSubmitting(false);
    if (error || !data) {
      toast.error(error?.message ?? "Could not send the request.");
      return;
    }
    toast.success(`Request sent to ${helper.name}. Typical reply in ~${helper.response_min} minutes.`);
    setDetails("");
    setUrgent(false);
    onSent(data.id, helper);
  };

  return (
    <Dialog open={!!helper} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {helper ? `Request ${helper.name} · ${serviceName ?? "Help"}` : "Request helper"}
          </DialogTitle>
        </DialogHeader>
        {helper && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-secondary/40 p-3">
              <img src={helper.avatar_url ?? ""} alt={helper.name} className="h-12 w-12 rounded-lg object-cover" />
              <div className="text-xs text-muted-foreground">
                <p className="text-sm font-semibold text-foreground">{helper.name}</p>
                <p>{helper.district} · ₩{helper.hourly_rate.toLocaleString()}/hr · ★ {helper.rating}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="match-area" className="text-xs">Where do you need help?</Label>
              <Input
                id="match-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Seongdong-gu, near Hanyang University"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="match-details" className="text-xs">Details (optional)</Label>
              <Textarea
                id="match-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="When do you need help, and what exactly should they do?"
                rows={3}
                className="mt-1.5"
              />
            </div>
            <button
              type="button"
              onClick={() => setUrgent((v) => !v)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-base ${
                urgent ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              Mark as urgent
            </button>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RequestThreadDialog = ({
  requestId,
  helper,
  onClose,
}: {
  requestId: string | null;
  helper: ScoredHelper | null;
  onClose: () => void;
}) => {
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = async (id: string) => {
    const { data, error } = await supabase
      .from("help_request_messages")
      .select("id, sender_role, body, created_at")
      .eq("request_id", id)
      .order("created_at", { ascending: true });
    if (error) {
      toast.error(error.message);
      return;
    }
    setMessages((data ?? []) as ThreadMessage[]);
  };

  useEffect(() => {
    if (!requestId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    load(requestId).finally(() => setLoading(false));
  }, [requestId]);

  const send = async () => {
    const body = reply.trim();
    if (!requestId || !body) return;
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSending(false);
      toast.error("Please sign in again.");
      return;
    }
    const { error } = await supabase.from("help_request_messages").insert({
      request_id: requestId,
      sender_role: "user",
      sender_id: user.id,
      body,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setReply("");
    await load(requestId);
  };

  return (
    <Dialog open={!!requestId} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{helper ? `Conversation with ${helper.name}` : "Your request"}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[45vh] space-y-3 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            messages.map((m) => {
              const mine = m.sender_role === "user";
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${
                      mine
                        ? "bg-primary text-primary-foreground"
                        : m.sender_role === "helper"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {!mine && (
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-70">
                        {m.sender_role === "helper" ? (helper?.name ?? "Helper") : "StayInKo"}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-end gap-2 border-t border-border/60 pt-3">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={2}
            placeholder="Reply to your helper..."
            className="flex-1"
          />
          <Button onClick={send} disabled={sending || !reply.trim()} size="icon" aria-label="Send reply">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceMatchSection;
