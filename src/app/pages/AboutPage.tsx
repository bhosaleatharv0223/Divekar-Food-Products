import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Sparkles,
  Droplet,
  MessageCircle,
  Mail,
  Phone,
  HandHeart,
  Leaf,
  ScrollText,
  MapPin,
} from "lucide-react";

import { Button } from "../components/ui/button";

const founderPhoto = "/WhatsApp%20Image%202026-07-05%20at%209.32.42%20AM.jpeg";

const CONTACT_NUMBER = "919579702008";
const EMAIL = "prarthanadivekar5@gmail.com";

interface AboutPageProps {
  readonly onNavigate: (page: "home" | "shop" | "about") => void;
}

const trustBadges = [
  { icon: Calendar, label: "Since 2015" },
  { icon: Sparkles, label: "100% Handmade" },
  { icon: Droplet, label: "Pure Desi Ghee" },
];

const values = [
  {
    Icon: HandHeart,
    title: "Handmade with Love",
    desc: "Every item is shaped and prepared by hand, never machine-mass-produced.",
  },
  {
    Icon: Leaf,
    title: "Zero Preservatives",
    desc: "Made fresh only after you order, nothing sits on a shelf.",
  },
  {
    Icon: ScrollText,
    title: "Traditional Recipes",
    desc: "Recipes passed down through generations, not shortcuts.",
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  const [imgError, setImgError] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const introRef = useRef<HTMLDivElement | null>(null);
  const showFounderPhoto = Boolean(founderPhoto) && !imgError;

  useEffect(() => {
    if (!introRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(introRef.current);
    return () => observer.disconnect();
  }, []);

  const fadeInStyles = (delay = 0) => ({
    opacity: introVisible ? 1 : 0,
    transform: introVisible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  });

  return (
    <main className="bg-[#FBF9F0] text-[#1B1B1B]">
      <section className="mx-auto max-w-4xl px-6 pb-14 pt-20 text-center" ref={introRef}>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#1B4332]" style={fadeInStyles(0)}>
          Our Story
        </p>
        <h1 className="mb-6 font-serif text-4xl font-bold leading-tight md:text-5xl" style={fadeInStyles(100)}>
          Homemade Since 2015
        </h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground" style={fadeInStyles(200)}>
          Divekar Foods started in a home kitchen in Magarpatta City, Pune, with one simple belief — that festive food tastes best when it&apos;s made the way it always has been: by hand, with pure ingredients, and a lot of care.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-8">
        <div className="relative overflow-hidden rounded-[28px] bg-white p-8 shadow-[0_28px_80px_rgba(0,0,0,0.08)] md:p-12">
          <div className="absolute -top-24 -left-24 h-[320px] w-[320px] rounded-full bg-[#C9E8A6] opacity-40 blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-12 md:grid-cols-2 md:items-center">
            <div className="relative flex flex-col items-center md:items-start">
              <div
                className="relative flex h-[240px] w-[240px] items-center justify-center overflow-hidden rounded-full shadow-[0_22px_60px_rgba(0,0,0,0.10)] md:h-[300px] md:w-[300px]"
                style={{ border: "3px solid #8BC34A", backgroundColor: "#E8F3DD" }}
              >
                {showFounderPhoto ? (
                  <img
                    src={founderPhoto}
                    alt="Prarthana Divekar, Founder of Divekar Foods"
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-center px-6">
                    <span className="font-serif text-6xl font-bold text-[#1B4332]">PD</span>
                    <span className="mt-3 text-xs text-muted-foreground">Photo coming soon</span>
                  </div>
                )}
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground md:text-left">
                Prarthana Divekar, Founder
              </p>
            </div>

            <div className="relative z-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#1B4332]">
                Meet the Founder
              </p>
              <h2 className="mb-2 font-serif text-3xl font-bold tracking-tight">
                Prarthana Divekar
              </h2>
              <p className="mb-5 font-medium text-[#8BC34A]">Founder, Divekar Foods</p>

              <p className="mb-4 leading-relaxed text-muted-foreground">
                Prarthana started Divekar Foods in 2015 from her home kitchen in Magarpatta City, driven by a love for traditional Maharashtrian recipes passed down through her family. What began as homemade ladoos and faral for friends and neighbors during Diwali has grown into a trusted name for authentic, preservative-free festive food across Pune.
              </p>
              <p className="mb-8 leading-relaxed text-muted-foreground">
                Every batch is still made the same way it always has been — in small quantities, with pure desi ghee, hand-rolled by hand, and packed fresh only after an order is placed.
              </p>

              <div className="mb-8 flex flex-wrap gap-3">
                {trustBadges.map((badge) => {
                  const BadgeIcon = badge.icon;
                  return (
                    <span
                      key={badge.label}
                      className="flex items-center gap-2 rounded-full bg-[#F1EDE0] px-4 py-2 text-sm font-medium text-[#1B4332] transition-transform duration-300 hover:scale-105"
                    >
                      <BadgeIcon size={16} strokeWidth={2} />
                      {badge.label}
                    </span>
                  );
                })}
              </div>

              <div className="grid gap-3 text-sm text-[#1B4332]">
                <a
                  href={`https://wa.me/${CONTACT_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-[18px] border border-[#E8F3DD] bg-[#FBFBF7] p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3DD] shadow-[0_12px_26px_rgba(139,195,74,0.14)]">
                    <MessageCircle size={18} strokeWidth={2} style={{ color: "#1B4332" }} />
                  </span>
                  <span className="font-medium">Message on WhatsApp</span>
                </a>

                <a
                  href={"https://www.google.com/maps?q=18.517639,73.932667"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-3 rounded-[18px] border border-[#E8F3DD] bg-[#FBFBF7] p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3DD] shadow-[0_12px_26px_rgba(139,195,74,0.14)]">
                    <MapPin size={18} strokeWidth={2} style={{ color: "#1B4332" }} />
                  </span>
                  <span className="font-medium">
                    📍 GW9M+333, Pune, Maharashtra
                    <br />
                    Coordinates: 18°31'03.5"N 73°55'57.6"E
                    <br />
                    <span style={{ textDecoration: "underline", color: "#1B4332", fontWeight: 700 }}>View on Google Maps →</span>
                  </span>
                </a>

                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="group flex items-center gap-3 rounded-[18px] border border-[#E8F3DD] bg-[#FBFBF7] p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3DD] shadow-[0_12px_26px_rgba(139,195,74,0.14)]">
                      <Mail size={18} strokeWidth={2} style={{ color: "#1B4332" }} />
                    </span>
                    <span className="font-medium break-all">{EMAIL}</span>
                  </a>
                  <div className="group flex items-center gap-3 rounded-[18px] border border-[#E8F3DD] bg-[#FBFBF7] p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F3DD] shadow-[0_12px_26px_rgba(139,195,74,0.14)]">
                      <Phone size={18} strokeWidth={2} style={{ color: "#1B4332" }} />
                    </span>
                    <span className="font-medium">+91 {CONTACT_NUMBER.slice(2, 7)} {CONTACT_NUMBER.slice(7)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {values.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-[28px] bg-white p-8 text-center shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
            >
              <div className="absolute left-1/2 top-6 h-1 w-16 -translate-x-1/2 rounded-full bg-[#8BC34A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#E8F3DD] to-[#D4EBB8] shadow-[0_14px_30px_rgba(139,195,74,0.16)] transition-transform duration-300 group-hover:scale-110">
                <item.Icon size={26} strokeWidth={2} style={{ color: "#1B4332" }} />
              </div>
              <h3 className="mb-3 font-serif text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-[28px] bg-[#F1EDE0] p-12 text-center shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <h2 className="mb-6 font-serif text-3xl font-bold tracking-tight">Taste the Tradition Yourself</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              onClick={() => onNavigate("shop")}
              className="inline-flex items-center gap-2 rounded-full bg-[#1B4332] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-[#14532d]"
            >
              <MessageCircle size={18} strokeWidth={2} />
              Shop Now
            </Button>
            <a
              href={`https://wa.me/${CONTACT_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-[#20bd5a]"
            >
              <MessageCircle size={18} strokeWidth={2} />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
