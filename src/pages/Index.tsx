import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedHomes from "@/components/FeaturedHomes";
import PopularCities from "@/components/PopularCities";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedHomes />
      <PopularCities />
      <StatsSection />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
