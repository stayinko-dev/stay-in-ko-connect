import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, MapPin, Search, Star, Shield, MessageCircle, Zap, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import TranslatableText from "@/components/TranslatableText";
import { SUPPORTED_TARGETS, type TargetLang } from "@/hooks/useTranslate";
import {
  SERVICE_CATEGORIES,
  HELPERS,
  LIVE_REQUESTS,
  COMMUNITY_POSTS,
  type Helper,
} from "@/data/concierge";

const Concierge = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeService = searchParams.get("service") || "all";
  const [query, setQuery] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [presetHelper, setPresetHelper] = useState<Helper | null>(null);
  const [targetLang, setTargetLang] = useState<TargetLang>("en");

  const filteredHelpers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HELPERS.filter((h) => {
      if (activeService !== "all") {
        const cat = SERVICE_CATEGORIES.find((s) => s.id === activeService);
        if (cat && !h.specialties.includes(cat.name)) return false;
      }
      if (!q) return true;
      return (
        h.name.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.specialties.some((s) => s.toLowerCase().includes(q)) ||
        h.languages.some((l) => l.toLowerCase().includes(q))
      );
    });
  }, [activeService, query]);

  const setService = (id: string) => {
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("service");
    else next.set("service", id);
    setSearchParams(next, { replace: true });
  };

  const openRequest = (helper?: Helper) => {
    setPresetHelper(helper ?? null);
    setRequestOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary to-primary/80 py-12 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <MapPin className="h-3.5 w-3.5" /> Seoul · Busan · Incheon · Daegu
            </div>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">
              We've got <span className="italic">a local for that.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/90 md:text-lg">
              Verified bilingual helpers for hospital visits, paperwork, airport pickup, and daily life in Korea.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="secondary" onClick={() => openRequest()} className="shadow-soft">
                Request Help <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
                <a href="#helpers">Browse helpers</a>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-primary-foreground/90 sm:max-w-md">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> ID verified</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> 15 min match</div>
              <div className="flex items-center gap-2"><Star className="h-4 w-4" /> 4.9 avg rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick services */}
      <section className="border-b border-border/60 bg-card/50 py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Quick services</h2>
            <button
              onClick={() => setService("all")}
              className="text-xs font-medium text-primary hover:underline"
            >
              {activeService === "all" ? "All shown" : "Clear filter"}
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible lg:grid-cols-8">
            {SERVICE_CATEGORIES.map((s) => {
              const active = activeService === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setService(active ? "all" : s.id)}
                  className={`flex min-w-[110px] flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-base ${
                    active
                      ? "border-primary bg-primary-soft/60 shadow-soft"
                      : "border-border bg-card hover:border-primary/40 hover:bg-secondary"
                  }`}
                >
                  <s.icon className={`h-5 w-5 ${s.accent}`} />
                  <span className="text-xs font-semibold text-foreground">{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-3 lg:px-8">
        {/* Main column: helpers */}
        <div className="lg:col-span-2">
          <div id="helpers" className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">Top helpers near you</h2>
              <p className="text-sm text-muted-foreground">
                {filteredHelpers.length} verified {filteredHelpers.length === 1 ? "helper" : "helpers"} available now
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, area, language"
                className="pl-9"
              />
            </div>
          </div>

          {filteredHelpers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-sm text-muted-foreground">No helpers match your filters.</p>
                <Button variant="link" onClick={() => { setQuery(""); setService("all"); }}>
                  Reset filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredHelpers.map((h) => (
                <Card key={h.id} className="overflow-hidden transition-base hover:-translate-y-0.5 hover:shadow-glow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={h.avatar}
                        alt={h.name}
                        loading="lazy"
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-base font-semibold text-foreground">{h.name}</h3>
                          {h.verified && <Shield className="h-3.5 w-3.5 text-primary" />}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-foreground">{h.rating}</span>
                          <span>· {h.reviews} reviews</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {h.area}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {h.specialties.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                      {h.languages.map((l) => (
                        <Badge key={l} variant="outline" className="text-xs">{l}</Badge>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">₩{h.hourlyRate.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground"> / hr</span>
                      </div>
                      <Button size="sm" onClick={() => openRequest(h)}>
                        Request <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Live in your area</h3>
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>
              <ul className="space-y-2">
                {LIVE_REQUESTS.map((r) => {
                  const cat = SERVICE_CATEGORIES.find((s) => s.id === r.category);
                  if (!cat) return null;
                  return (
                    <li
                      key={r.id}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                        <cat.icon className={`h-4 w-4 ${cat.accent}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">
                          Someone needs <span className="text-primary">{cat.name}</span> help
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> {r.area} · {r.ago}
                        </p>
                      </div>
                      {r.urgent && (
                        <Badge variant="destructive" className="text-[10px]">
                          <Zap className="mr-0.5 h-2.5 w-2.5" /> Urgent
                        </Badge>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Trending in community</h3>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value as TargetLang)}
                  className="rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground"
                  aria-label="Translate target language"
                >
                  {SUPPORTED_TARGETS.map((l) => (
                    <option key={l.code} value={l.code}>
                      Translate → {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <ul className="space-y-3">
                {COMMUNITY_POSTS.map((p) => (
                  <li key={p.id} className="rounded-xl border border-border/60 bg-card p-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span className="text-sm">{p.flag}</span>
                      <span className="font-medium text-foreground">{p.author}</span>
                      <span>· {p.ago}</span>
                      <span>· {p.area}</span>
                      <Badge variant="outline" className="ml-auto text-[10px]">{p.tag}</Badge>
                    </div>
                    <h4 className="mt-1.5 text-sm font-semibold text-foreground">{p.title}</h4>
                    <TranslatableText
                      text={p.excerpt}
                      target={targetLang}
                      className="mt-1"
                    />
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>♥ {p.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {p.comments}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Footer />

      <RequestHelpDialog
        open={requestOpen}
        onOpenChange={setRequestOpen}
        helper={presetHelper}
        presetService={activeService !== "all" ? activeService : undefined}
      />
    </div>
  );
};

const RequestHelpDialog = ({
  open,
  onOpenChange,
  helper,
  presetService,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  helper: Helper | null;
  presetService?: string;
}) => {
  const [service, setService] = useState(presetService || "hospital");
  const [area, setArea] = useState("");
  const [details, setDetails] = useState("");
  const [urgent, setUrgent] = useState(false);

  const handleSubmit = () => {
    if (!area.trim()) {
      toast.error("Please enter your location.");
      return;
    }
    toast.success(
      helper
        ? `Request sent to ${helper.name}. They'll respond shortly.`
        : "Request posted — matching you with a nearby helper.",
    );
    onOpenChange(false);
    setDetails("");
    setArea("");
    setUrgent(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{helper ? `Request ${helper.name}` : "Request a local helper"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Service</Label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {SERVICE_CATEGORIES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setService(s.id)}
                  className={`rounded-full border px-3 py-1 text-xs transition-base ${
                    service === s.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="area" className="text-xs">Location / area</Label>
            <Input
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Hongdae, Mapo-gu"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="details" className="text-xs">Details (optional)</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="When do you need help, what language, anything important…"
              rows={3}
              className="mt-1.5"
            />
            {details.trim().length > 0 && (
              <div className="mt-2 rounded-lg border border-dashed border-border/70 bg-secondary/40 p-2">
                <TranslatableText text={details} target="en" sourceHint={undefined} />
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Helpers usually read in English — translate before sending for faster matches.
                </p>
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border"
            />
            Mark as urgent (extra fee may apply)
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Send request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Concierge;