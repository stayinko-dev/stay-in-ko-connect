import { CircleUserRound, Home, Search, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const items = [
    { label: "Home", to: "/", icon: Home, active: pathname === "/" },
    { label: "Search", to: "/search", icon: Search, active: pathname === "/search" || pathname.startsWith("/properties/") },
    { label: "Concierge", to: "/concierge", icon: Sparkles, active: pathname === "/concierge" },
    { label: user ? "My Page" : "Log in", to: user ? "/mypage" : "/login", icon: CircleUserRound, active: pathname === "/mypage" || pathname === "/login" },
  ];

  if (pathname.startsWith("/properties/")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-floating backdrop-blur-xl md:hidden" aria-label="Main navigation">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold text-muted-foreground transition-base",
              item.active && "bg-primary-soft text-primary",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;