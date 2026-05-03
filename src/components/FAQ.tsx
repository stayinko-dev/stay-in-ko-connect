import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionHeader from "@/components/ui/section-header";

const faqs = [
  {
    q: "Do I need to pay a Korean-style deposit (jeonse)?",
    a: "No. Most StayInKo listings are no-deposit or low-deposit and clearly marked. You'll see the exact upfront cost before you book.",
  },
  {
    q: "How long can I stay?",
    a: "From a few weeks to over a year. Use the date picker to set your move-in and move-out, and we'll only show homes that fit.",
  },
  {
    q: "Is my payment safe?",
    a: "Yes. Payments are held in escrow until you check in and confirm the property matches the listing. Full refund if anything's off.",
  },
  {
    q: "Are hosts verified?",
    a: "Every host is identity-verified and their listings are reviewed before going live. You'll see a verified badge on their profile.",
  },
  {
    q: "Can I communicate in English?",
    a: "Absolutely. The entire platform — listings, chat, contracts, and support — is built English-first.",
  },
  {
    q: "What if I need help during my stay?",
    a: "Our support team is available 7 days a week via in-app chat in English, Korean, and several other languages.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            eyebrow="FAQ"
            title="Questions, answered."
            description="Everything you need to know before booking your home in Korea. Still curious? Reach out anytime."
            className="mb-0"
          />

          <Accordion type="single" collapsible className="w-full divide-y divide-border rounded-2xl border border-border/70 bg-card shadow-soft">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-0 px-6">
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
