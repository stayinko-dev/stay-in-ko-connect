import { MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <a href="/" className="flex items-center gap-1.5">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-display font-bold text-foreground tracking-tight">
            Stay<span className="text-primary">InKo</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="text-foreground/70 hover:text-primary transition-colors">Find a Place</a>
          <a href="#" className="text-foreground/70 hover:text-primary transition-colors">Host Dashboard</a>
          <a href="#" className="text-foreground/70 hover:text-primary transition-colors">Blog</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-4 py-2">
            Log In
          </button>
          <button className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            Sign Up
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3">
          <a href="#" className="block text-sm font-medium text-foreground/70 py-2">Find a Place</a>
          <a href="#" className="block text-sm font-medium text-foreground/70 py-2">Host Dashboard</a>
          <a href="#" className="block text-sm font-medium text-foreground/70 py-2">Blog</a>
          <div className="flex gap-3 pt-2">
            <button className="text-sm font-medium text-foreground/70 px-4 py-2">Log In</button>
            <button className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-lg">Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
