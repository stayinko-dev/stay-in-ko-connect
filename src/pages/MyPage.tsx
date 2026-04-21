import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, Heart, Loader2, LogOut, Mail, MapPin, Phone, Settings, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type ProfileForm = {
  display_name: string;
  phone: string;
  bio: string;
};

const defaultProfile: ProfileForm = {
  display_name: "",
  phone: "",
  bio: "",
};

const MyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileForm>(defaultProfile);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    const loadProfile = async () => {
      const [profileResult, favoritesResult, bookingsResult] = await Promise.all([
        supabase.from("profiles").select("display_name, phone, bio").eq("user_id", user.id).maybeSingle(),
        supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("guest_id", user.id),
      ]);

      if (!active) {
        return;
      }

      if (profileResult.data) {
        setProfile({
          display_name: profileResult.data.display_name || "",
          phone: profileResult.data.phone || "",
          bio: profileResult.data.bio || "",
        });
      }

      setFavoritesCount(favoritesResult.count || 0);
      setBookingsCount(bookingsResult.count || 0);
      setLoading(false);
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [user]);

  const saveProfile = async () => {
    if (!user) {
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("profiles").update(profile).eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setIsEditing(false);
    toast.success("Profile saved.");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged out.");
    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="container mx-auto flex-1 max-w-5xl px-4 py-10">
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-primary px-8 py-10 text-primary-foreground">
                    <p className="text-sm uppercase tracking-[0.2em] text-primary-foreground/80">Account</p>
                    <h1 className="mt-3 text-3xl font-bold">{profile.display_name || "New member"}</h1>
                    <p className="mt-2 max-w-xl text-sm text-primary-foreground/85">
                      Manage bookings, saved homes, and your host readiness from a single account area.
                    </p>
                  </div>

                  <div className="grid gap-4 px-8 py-8 sm:grid-cols-2">
                    <InfoRow icon={Mail} label="Email" value={user?.email || "-"} />
                    <InfoRow icon={Phone} label="Phone" value={profile.phone || "Not added yet"} />
                    <InfoRow icon={MapPin} label="Status" value="Global renter profile active" />
                    <InfoRow icon={User} label="Bio" value={profile.bio || "Add a short intro to build trust with hosts."} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                <StatCard label="My bookings" value={`${bookingsCount}`} hint="Track your stay schedule and booking progress." />
                <StatCard label="Saved homes" value={`${favoritesCount}`} hint="Keep your short list ready for final comparison." />
                <StatCard label="Next step" value="Become a host" hint="If you manage a space, the host dashboard is ready for operations." />
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Profile settings</CardTitle>
                    <p className="text-sm text-muted-foreground">Keep your basic identity and trust details up to date.</p>
                  </div>
                  <Button variant={isEditing ? "default" : "outline"} onClick={isEditing ? saveProfile : () => setIsEditing(true)} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {isEditing ? "Save" : "Edit"}
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    disabled={!isEditing}
                    label="Display name"
                    value={profile.display_name}
                    onChange={(value) => setProfile((current) => ({ ...current, display_name: value }))}
                  />
                  <FormField
                    disabled={!isEditing}
                    label="Phone"
                    value={profile.phone}
                    onChange={(value) => setProfile((current) => ({ ...current, phone: value }))}
                  />
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      disabled={!isEditing}
                      value={profile.bio}
                      onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))}
                      className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                      placeholder="Share your school, work, or stay purpose to improve response rates."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quick access</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <QuickLink icon={CalendarDays} title="Booking view" description="Review your active and upcoming stays." to="/" />
                  <QuickLink icon={Heart} title="Saved homes" description="Return to homes you want to compare." to="/" />
                  <QuickLink icon={Settings} title="Host dashboard" description="Open listing operations and payout setup." to="/host" />
                  <Button variant="outline" className="mt-4 w-full text-destructive hover:text-destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
  <Card>
    <CardContent className="space-y-2 p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{hint}</p>
    </CardContent>
  </Card>
);

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="rounded-xl border border-border bg-secondary/40 p-4">
    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <p className="text-sm font-medium text-foreground">{value}</p>
  </div>
);

const FormField = ({
  disabled,
  label,
  onChange,
  value,
}: {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} />
  </div>
);

const QuickLink = ({
  icon: Icon,
  title,
  description,
  to,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
}) => (
  <Link
    to={to}
    className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/60"
  >
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </Link>
);

export default MyPage;
