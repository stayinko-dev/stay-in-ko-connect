import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import logoImg from "@/assets/logo.jpg";

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: { message: string } | null }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

const SCOPE_LABELS: Record<string, string> = {
  openid: "Confirm your identity",
  profile: "Share your basic profile",
  email: "Share your email address",
};

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const { user, loading } = useAuth();
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("This authorization request is missing its authorization ID.");
        return;
      }
      if (!user) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error: err } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (err) {
        setError(err.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId, user, loading]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error: err } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  };

  const clientName: string = details?.client?.name ?? details?.client?.client_name ?? "an app";
  const scopes: string[] = (details?.scope ?? "").split(" ").filter(Boolean);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-surface px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/">
            <img src={logoImg} alt="StayInKo" className="mx-auto mb-6 h-14" />
          </Link>
        </div>

        <Card className="shadow-floating">
          <CardContent className="space-y-5 p-8">
            {error ? (
              <div className="space-y-4 text-center">
                <h1 className="text-xl font-bold text-foreground">Connection request unavailable</h1>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Back to StayInKo</Link>
                </Button>
              </div>
            ) : !details ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading connection request…
              </div>
            ) : (
              <>
                <div className="space-y-1 text-center">
                  <ShieldCheck className="mx-auto h-8 w-8 text-primary" />
                  <h1 className="text-xl font-bold text-foreground">Connect {clientName} to StayInKo Connect</h1>
                  <p className="text-sm text-muted-foreground">
                    This lets {clientName} use this app as you.
                  </p>
                </div>

                <div className="rounded-xl bg-secondary p-4 text-sm">
                  <p className="font-medium text-foreground">Signed in as</p>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>

                {scopes.length > 0 && (
                  <div className="space-y-1.5 text-sm">
                    <p className="font-medium text-foreground">{clientName} will be able to:</p>
                    <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                      {scopes.map((s) => (
                        <li key={s}>{SCOPE_LABELS[s] ?? `Additional permission requested: ${s}`}</li>
                      ))}
                      <li>Call this app's enabled tools while you are signed in</li>
                    </ul>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  This does not bypass this app's permissions or backend policies.
                </p>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" disabled={busy} onClick={() => decide(false)}>
                    Cancel connection
                  </Button>
                  <Button variant="gradient" className="flex-1" disabled={busy} onClick={() => decide(true)}>
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Approve
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OAuthConsent;
