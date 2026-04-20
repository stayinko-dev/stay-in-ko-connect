import logoImg from "@/assets/logo.jpg";
import { Mail, MapPin, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border pt-20 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 mb-12">
          <div className="col-span-2">
            <a href="/" className="flex items-center mb-4">
              <img src={logoImg} alt="StayInKo" className="h-16" />
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed font-body max-w-xs">
              Your trusted home-finding platform for international students and business travelers in Korea.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:border-primary hover:text-primary transition-base">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:border-primary hover:text-primary transition-base">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:border-primary hover:text-primary transition-base">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 font-body">Explore</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-body">
              <li><a href="#" className="hover:text-foreground transition-colors">Seoul</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Busan</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Daejeon</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Short-term</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 font-body">Hosting</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-body">
              <li><a href="/host" className="hover:text-foreground transition-colors">Become a Host</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Host Resources</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 font-body">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground font-body">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-body">
          <p>© 2026 StayInKo. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Seoul, Korea</span>
            <a href="mailto:hello@stayinko.com" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Mail className="h-3.5 w-3.5" /> hello@stayinko.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
