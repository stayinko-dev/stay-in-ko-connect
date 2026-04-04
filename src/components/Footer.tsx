import { MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <a href="/" className="flex items-center gap-1.5 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-lg font-display font-bold text-foreground">
                Stay<span className="text-primary">InKo</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed font-body">
              Your trusted home-finding platform for international students and business travelers in Korea.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 font-body">Explore</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-body">
              <li><a href="#" className="hover:text-primary transition-colors">Seoul</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Busan</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Daejeon</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Short-term Stays</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 font-body">Hosting</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-body">
              <li><a href="#" className="hover:text-primary transition-colors">List your property</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Host Resources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trust & Safety</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4 font-body">Support</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground font-body">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cancellation Options</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground font-body">
          © 2026 StayInKo. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
