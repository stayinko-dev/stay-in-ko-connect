import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import logoImg from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface pt-20 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-10">
          <div className="col-span-2">
            <Link to="/" className="mb-4 flex items-center">
              <img src={logoImg} alt="StayInKo" className="h-16" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your trusted home-finding platform for international students and business travelers in Korea.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a href="#" aria-label="Twitter" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-base hover:border-primary hover:text-primary">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-base hover:border-primary hover:text-primary">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-base hover:border-primary hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">Explore</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground">Seoul</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Busan</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Daejeon</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Short-term</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">Hosting</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/host" className="transition-colors hover:text-foreground">Become a Host</Link></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Host Resources</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Trust & Safety</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground">Help Center</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Contact</a></li>
              <li><Link to="/privacy" className="transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>&copy; 2026 StayInKo. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Seoul, Korea
            </span>
            <a href="mailto:hello@stayinko.com" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
              <Mail className="h-3.5 w-3.5" />
              hello@stayinko.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
