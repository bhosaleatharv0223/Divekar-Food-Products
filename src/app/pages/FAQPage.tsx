import { useState } from "react";

import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Ordering",
    question: "How do I place an order?",
    answer:
      "You can order directly through our website by adding items to your cart, or contact us with the items and quantity you'd like. We'll confirm your order as quickly as possible.",
  },
  {
    category: "Ordering",
    question: "How much advance notice do you need?",
    answer:
      "Everything is made fresh to order, so we request at least 2–3 days advance notice — especially during Diwali and other festive seasons when demand is high.",
  },
  {
    category: "Ordering",
    question: "Can I customize my order (weight, mix of items, gifting box)?",
    answer:
      "Yes! Most items can be ordered in custom weights (250g, 500g, 1kg, or in bulk for events). We also do mixed festive hampers on request — just let us know what you have in mind.",
  },
  {
    category: "Products",
    question: "What's the difference between the 'oil' and 'ghee' pricing on Karanji and Anarse?",
    answer:
      "Some items like Pudachi Karanji and Anarse can be made using refined oil (lower price) or pure desi ghee (higher price, richer taste). You can choose either option when ordering — the ghee version costs more because of the ingredient cost.",
  },
  {
    category: "Products",
    question: "Do your ladoos contain added sugar?",
    answer:
      "Our 'Healthy & Immunity' ladoo range (Dink, Aliv, Methi Dink, Nachni, Wheat, etc.) is made with jaggery instead of sugar — no refined sugar is added to these. Our festive sweets like Besan Ladoo and Rawa Ladoo do use sugar as part of the traditional recipe.",
  },
  {
    category: "Products",
    question: "Are your products vegetarian?",
    answer:
      "Yes, all our products are 100% vegetarian and made in a pure vegetarian kitchen.",
  },
  {
    category: "Products",
    question: "Do you use any preservatives?",
    answer:
      "No. Everything is made fresh only after an order is placed, so there are zero preservatives or artificial shelf-life extenders in any of our products.",
  },
  {
    category: "Shipping & Delivery",
    question: "Where do you deliver?",
    answer:
      "We currently deliver across Pune, with wider Maharashtra delivery available for select bulk/festive orders. Contact us with your pin code to confirm delivery to your area.",
  },
  {
    category: "Shipping & Delivery",
    question: "How long does delivery take?",
    answer:
      "Since everything is made fresh, delivery typically happens within 2–3 days of order confirmation — sooner if you're placing a smaller, non-festive order.",
  },
  {
    category: "Shipping & Delivery",
    question: "Is there a minimum order amount?",
    answer:
      "There's no strict minimum for pickup orders. We currently offer only porter-based delivery, so contact us if you need help arranging the best courier option for your order.",
  },
  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, bank transfer, and cash on delivery/pickup for local orders. Payment details are shared once your order is confirmed through checkout on the website.",
  },
  {
    category: "Storage",
    question: "How long do the products stay fresh, and how should I store them?",
    answer:
      "Most ladoos and faral stay fresh for 10–15 days at room temperature in an airtight container, and longer if refrigerated. Since we don't use preservatives, we recommend consuming items within 2 weeks for the best taste and texture.",
  },
];

const categories = Array.from(new Set(faqData.map((f) => f.category)));

// Aligns with the project-wide NavigateFn defined in App.tsx
interface FAQPageProps {
  onNavigate: (...args: any[]) => void;
}

export function FAQPage({ onNavigate }: FAQPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredFAQs =
    activeCategory === "All"
      ? faqData
      : faqData.filter((f) => f.category === activeCategory);

  return (
    <main className="bg-[#FBF9F0] text-[#1B1B1B]">
      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-sm font-semibold tracking-widest text-[#1B4332] uppercase mb-4">
          Frequently Asked Questions
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Got Questions? We've Got Answers.
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
          Everything you need to know about ordering, ingredients, delivery,
          and more. Can't find what you're looking for? Reach out through our
          contact page.
        </p>
      </section>

      {/* CATEGORY FILTER */}
      <section className="max-w-4xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "All"
                ? "text-white"
                : "bg-white text-[#1B1B1B] border border-gray-200"
            }`}
            style={activeCategory === "All" ? { backgroundColor: "#1B4332" } : {}}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "text-white"
                  : "bg-white text-[#1B1B1B] border border-gray-200"
              }`}
              style={activeCategory === cat ? { backgroundColor: "#1B4332" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION — uses the project's shadcn Accordion (Radix-based) */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        {/*
          `type="single"` + `collapsible` lets one item be open at a time,
          matching the original single-open behaviour.
          `defaultValue="item-0"` opens the first question by default.
        */}
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="flex flex-col gap-3"
        >
          {filteredFAQs.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`item-${index}`}
              className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden px-6"
            >
              <AccordionTrigger className="py-5 text-sm font-medium text-[#1B1B1B] hover:no-underline [&>svg]:text-[#1B4332]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div
          className="rounded-2xl p-12 text-center"
          style={{ backgroundColor: "#F1EDE0" }}
        >
          <h2 className="font-serif text-3xl font-bold mb-3">
            Still Have a Question?
          </h2>
          <p className="text-muted-foreground mb-6">
            We're happy to help — just send us a message.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => onNavigate("contact")}
              className="rounded-full font-medium text-white transition-transform hover:scale-105 px-6 h-11"
              style={{ backgroundColor: "#25D366" }}
            >
              Contact Us
            </Button>
            <Button
              onClick={() => onNavigate("contact")}
              className="rounded-full font-medium text-white transition-transform hover:scale-105 px-6 h-11"
              style={{ backgroundColor: "#1B4332" }}
            >
              Contact Us →
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
