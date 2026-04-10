import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoImg from "@/assets/logo.jpg";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <a href="/" className="flex items-center">
          <img src={logoImg} alt="StayInKo" className="h-12" />
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="text-foreground/70 hover:text-primary transition-colors">Find a Place</a>
          <a href="/host" className="text-foreground/70 hover:text-primary transition-colors">Host Dashboard</a>
          <a href="#" className="text-foreground/70 hover:text-primary transition-colors">Blog</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="/login" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors px-4 py-2">
            Log In
          </a>
          <a href="/signup" className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            Sign Up
          </a>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3">
          <a href="#" className="block text-sm font-medium text-foreground/70 py-2">Find a Place</a>
          <a href="/host" className="block text-sm font-medium text-foreground/70 py-2">Host Dashboard</a>
          <a href="#" className="block text-sm font-medium text-foreground/70 py-2">Blog</a>
          <div className="flex gap-3 pt-2">
            <a href="/login" className="text-sm font-medium text-foreground/70 px-4 py-2">Log In</a>
            <a href="/signup" className="text-sm font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-lg">Sign Up</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
