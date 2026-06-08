import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Terms = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="container mx-auto max-w-3xl flex-1 px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: June 2026</p>

      <section className="prose prose-sm max-w-none space-y-6 text-foreground/85">
        <div>
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>By accessing or using StayInKo ("the Service"), you agree to be bound by these Terms. If you do not agree, do not use the Service.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">2. Eligibility</h2>
          <p>You must be at least 18 years old and capable of forming a binding contract to use the Service. International students and business travelers are welcome.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">3. Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of unauthorized use.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">4. Listings and Bookings</h2>
          <p>Hosts are responsible for the accuracy of listings. Guests are responsible for adhering to house rules and payment obligations. StayInKo is an intermediary platform and is not a party to rental contracts.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">5. Prohibited Conduct</h2>
          <ul className="list-disc pl-5">
            <li>Fraudulent listings, fake reviews, or impersonation.</li>
            <li>Harassment, discrimination, or unlawful behavior.</li>
            <li>Circumventing the Service to evade fees.</li>
            <li>Scraping, reverse-engineering, or abusing APIs.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">6. Account Termination</h2>
          <p>You may delete your account at any time from <Link to="/mypage" className="text-primary underline">My Page</Link>. Deleted accounts enter a 30-day grace period during which recovery is possible; after that, personal data is permanently removed except where retention is legally required.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
          <p>The Service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, StayInKo shall not be liable for indirect, incidental, or consequential damages.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">8. Governing Law</h2>
          <p>These Terms are governed by the laws of the Republic of Korea. Disputes shall be resolved in the courts of Seoul.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">9. Contact</h2>
          <p>For questions, contact <a href="mailto:hello@stayinko.com" className="text-primary underline">hello@stayinko.com</a>.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Terms;