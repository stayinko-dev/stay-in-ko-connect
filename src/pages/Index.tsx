import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedHomes from "@/components/FeaturedHomes";
import SearchListings from "@/components/SearchListings";
import PopularCities from "@/components/PopularCities";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import BusinessMomentum from "@/components/BusinessMomentum";
import ValueProps from "@/components/ValueProps";
import FeatureShowcase from "@/components/FeatureShowcase";
import FAQ from "@/components/FAQ";
import CtaSection from "@/components/CtaSection";
import ConciergeSection from "@/components/ConciergeSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ValueProps />
      <FeatureShowcase />
      <FeaturedHomes />
      <SearchListings />
      <PopularCities />
      <ConciergeSection />
      <StatsSection />
      <HowItWorks />
      <BusinessMomentum />
      <Testimonials />
      <FAQ />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
