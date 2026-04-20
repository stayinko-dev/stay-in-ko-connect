import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoImg from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between py-3 px-4 lg:px-8">
        <a href="/" className="flex items-center">
          <img src={logoImg} alt="StayInKo" className="h-14" />
        </a>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          <a href="/" className="px-3 py-2 rounded-lg text-foreground/75 hover:text-foreground hover:bg-secondary transition-base">Find a Place</a>
          <a href="/host" className="px-3 py-2 rounded-lg text-foreground/75 hover:text-foreground hover:bg-secondary transition-base">Host Dashboard</a>
          <a href="#" className="px-3 py-2 rounded-lg text-foreground/75 hover:text-foreground hover:bg-secondary transition-base">Resources</a>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <a href="/login">Log In</a>
          </Button>
          <Button asChild variant="gradient" size="sm">
            <a href="/signup">Get Started</a>
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition-base"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-1 animate-fade-in-up">
          <a href="/" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-secondary">Find a Place</a>
          <a href="/host" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-secondary">Host Dashboard</a>
          <a href="#" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-secondary">Resources</a>
          <div className="flex gap-2 pt-3">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <a href="/login">Log In</a>
            </Button>
            <Button asChild variant="gradient" size="sm" className="flex-1">
              <a href="/signup">Get Started</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
