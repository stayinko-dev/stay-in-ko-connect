import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoImg from "@/assets/logo.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("로그아웃되었습니다.");
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src={logoImg} alt="StayInKo" className="h-14" />
        </Link>

        <div className="hidden items-center gap-1 text-sm font-medium md:flex">
          <Link to="/search" className="rounded-lg px-3 py-2 text-foreground/75 transition-base hover:bg-secondary hover:text-foreground">
            Find a Place
          </Link>
          <Link to="/host" className="rounded-lg px-3 py-2 text-foreground/75 transition-base hover:bg-secondary hover:text-foreground">
            Host Dashboard
          </Link>
          <Link to="/mypage" className="rounded-lg px-3 py-2 text-foreground/75 transition-base hover:bg-secondary hover:text-foreground">
            My Page
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/mypage">Account</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Log In</Link>
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 transition-base hover:bg-secondary md:hidden"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="space-y-1 border-b border-border bg-card px-4 pb-4 md:hidden">
          <Link to="/search" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary" onClick={() => setMobileOpen(false)}>
            Find a Place
          </Link>
          <Link to="/host" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary" onClick={() => setMobileOpen(false)}>
            Host Dashboard
          </Link>
          <Link to="/mypage" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary" onClick={() => setMobileOpen(false)}>
            My Page
          </Link>

          <div className="flex gap-2 pt-3">
            {user ? (
              <>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/mypage" onClick={() => setMobileOpen(false)}>Account</Link>
                </Button>
                <Button variant="gradient" size="sm" className="flex-1" onClick={handleSignOut}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Log In</Link>
                </Button>
                <Button asChild variant="gradient" size="sm" className="flex-1">
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
