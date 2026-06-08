import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="container mx-auto max-w-3xl flex-1 px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-8 text-sm text-muted-foreground">Last updated: June 2026</p>

      <section className="space-y-6 text-foreground/85">
        <div>
          <h2 className="text-xl font-semibold">1. Data We Collect</h2>
          <ul className="list-disc pl-5">
            <li>Account data: name, email, phone, profile photo.</li>
            <li>Listing & booking data: addresses, dates, payment metadata.</li>
            <li>Usage data: device info, IP, log data.</li>
            <li>Communications: messages between hosts and guests.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">2. How We Use Data</h2>
          <p>To operate the Service, match guests with hosts, process payments, prevent fraud, comply with legal obligations, and improve features.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">3. Sharing</h2>
          <p>We share data only with: (a) the booking counterparty, (b) payment & verification providers, (c) law enforcement when legally required. We never sell personal data.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">4. Data Retention & Deletion</h2>
          <p>You may request deletion at any time. After requesting deletion:</p>
          <ul className="list-disc pl-5">
            <li>Your profile becomes hidden immediately.</li>
            <li>Your data is held in a secure archive for <strong>30 days</strong> for recovery.</li>
            <li>After 30 days, personal identifiers are permanently erased.</li>
            <li>Anonymized transaction records may be retained for up to 5 years to comply with Korean Commercial Act and tax laws.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">5. Your Rights</h2>
          <p>You have the right to access, correct, export, and delete your data. Contact <a className="text-primary underline" href="mailto:privacy@stayinko.com">privacy@stayinko.com</a>.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">6. Security</h2>
          <p>We use encryption in transit and at rest, role-based access controls, and routine security audits. No system is 100% secure; report concerns to <a className="text-primary underline" href="mailto:security@stayinko.com">security@stayinko.com</a>.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">7. International Transfers</h2>
          <p>Data may be processed outside Korea by our infrastructure providers. We apply contractual safeguards consistent with Korean PIPA.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">8. Changes</h2>
          <p>We will notify users of material changes via email or in-app notice at least 7 days before they take effect.</p>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Privacy;