import { useState, FormEvent } from "react";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { MessageCircle, Phone, Mail, MapPin, Clock, CheckCircle2, Send } from "lucide-react";

const CONTACT_NUMBER = "919579702008";
const EMAIL = "prarthanadivekar5@gmail.com";
const PHONE_DISPLAY = "+91 95797 02008";
const ADDRESS = "Magarpatta City, Pune, Maharashtra, India";

// Aligns with the project-wide NavigateFn defined in App.tsx:
//   (page: "home"|"shop"|"detail"|"about"|"contact", product?, filter?) => void
interface ContactPageProps {
  onNavigate: (...args: any[]) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // TODO: Replace this with a real backend/email API call once one is
    // set up (e.g. Formspree, EmailJS, or a serverless function).
    const text = encodeURIComponent(
      `Hi Divekar Foods, my name is ${name || "___"}.\n\n${message}\n\nContact number: ${phone || "___"}`
    );
    setSubmitted(true);
  }

  return (
    <main className="bg-[#FBF9F0] text-[#1B1B1B]">
      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-sm font-semibold tracking-[0.35em] text-[#1B4332] uppercase mb-4">Get In Touch</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">We'd Love to Hear From You</h1>
        <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
          Questions about an order, bulk festive requests, or just want to say hello? Reach out and we’ll respond quickly with warm, personal service.
        </p>
      </section>

      {/* CONTACT GRID */}
      <section className="max-w-5xl mx-auto px-6 py-8 grid gap-12 md:grid-cols-2">
        {/* LEFT: Contact Info Cards */}
        <div className="flex flex-col gap-5">
          <div className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E9F9D7] shadow-[0_14px_30px_rgba(139,195,74,0.16)]">
              <MessageCircle size={22} strokeWidth={1.8} style={{ color: "#1B4332" }} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1B4332]/80 mb-2">Send a Message</p>
            <p className="text-sm leading-relaxed text-muted-foreground">Use the form to share your order details, questions, or custom requests — we’ll reply as soon as possible.</p>
          </div>

          <a
            href={`tel:+${CONTACT_NUMBER}`}
            className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F3DD] shadow-[0_14px_30px_rgba(139,195,74,0.16)]">
              <Phone size={22} strokeWidth={1.8} style={{ color: "#1B4332" }} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1B4332]/80 mb-2">Call Us</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{PHONE_DISPLAY}</p>
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FDECC8] shadow-[0_14px_30px_rgba(255,204,102,0.16)]">
              <Mail size={22} strokeWidth={1.8} style={{ color: "#1B4332" }} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1B4332]/80 mb-2">Email</p>
            <p className="text-sm leading-relaxed text-muted-foreground break-all">{EMAIL}</p>
          </a>

          <a
            href={"https://www.google.com/maps?q=18.517639,73.932667"}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F3DD] shadow-[0_14px_30px_rgba(139,195,74,0.16)]">
              <MapPin size={22} strokeWidth={1.8} style={{ color: "#1B4332" }} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1B4332]/80 mb-2">Location</p>
            <div className="text-sm leading-relaxed text-muted-foreground">
              <div style={{ fontWeight: 700, color: "#1B4332" }}>GW9M+333, Pune, Maharashtra</div>
              <div style={{ marginTop: 4 }}>18°31'03.5"N 73°55'57.6"E</div>
              <div style={{ marginTop: 8, textDecoration: "underline", color: "#1B4332", fontWeight: 700 }}>Tap to open in Google Maps</div>
            </div>
          </a>

          <div className="rounded-[28px] bg-[#F1EDE0] p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F9F1E5] shadow-[0_10px_24px_rgba(27,67,50,0.08)]">
              <Clock size={18} strokeWidth={1.8} style={{ color: "#1B4332" }} />
            </div>
            <p className="text-sm leading-relaxed text-[#1B1B1B]">
              <span className="font-semibold">Please note:</span> all items are made fresh to order. Place your order at least 2–3 days in advance for festive or bulk requests.
            </p>
          </div>
        </div>

        {/* RIGHT: Contact Form */}
        <div className="bg-white rounded-[28px] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
          {!submitted ? (
            <form id="contact-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#1B4332] mb-3">Send Us a Message</p>
                <h2 className="font-serif text-3xl font-bold leading-tight text-foreground">We’re here to help with every order.</h2>
              </div>

              <div className="grid gap-5">
                <div>
                  <Label htmlFor="contact-name" className="mb-2 block text-sm font-medium tracking-[0.15em] text-[#1B4332]/90 uppercase">
                    Your Name
                  </Label>
                  <Input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    required
                    className="w-full rounded-[18px] border border-[#DCE3D4] bg-[#FBFBF7] px-4 py-3 text-sm text-[#1B1B1B] outline-none transition focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/30"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-phone" className="mb-2 block text-sm font-medium tracking-[0.15em] text-[#1B4332]/90 uppercase">
                    Phone Number
                  </Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98765 43210"
                    required
                    className="w-full rounded-[18px] border border-[#DCE3D4] bg-[#FBFBF7] px-4 py-3 text-sm text-[#1B1B1B] outline-none transition focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/30"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-message" className="mb-2 block text-sm font-medium tracking-[0.15em] text-[#1B4332]/90 uppercase">
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you'd like to order, or ask us anything..."
                    required
                    rows={6}
                    className="w-full rounded-[18px] border border-[#DCE3D4] bg-[#FBFBF7] px-4 py-3 text-sm text-[#1B1B1B] outline-none transition focus:border-[#8BC34A] focus:ring-2 focus:ring-[#8BC34A]/30"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1B4332] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#143724]"
              >
                <Send size={18} strokeWidth={1.8} />
                Send Message
              </Button>

              <p className="text-sm leading-relaxed text-muted-foreground">We’ll notify you once we receive your message and begin preparing your fresh order.</p>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center py-14">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E9F9D7] shadow-[0_14px_30px_rgba(139,195,74,0.16)]">
                <CheckCircle2 size={28} strokeWidth={1.8} style={{ color: "#1B4332" }} />
              </div>
              <h2 className="font-serif text-3xl font-bold text-foreground">Message Sent!</h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Thank you — your request is with us now. We’ll reach out shortly to confirm the details and fresh preparation timeline.
              </p>
              <Button
                variant="outline"
                onClick={() => setSubmitted(false)}
                className="rounded-full border border-[#1B4332] px-8 py-3 text-sm font-semibold text-[#1B4332] transition hover:bg-[#EFF7E5]"
              >
                Send Another Message
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-5xl mx-auto px-6 pb-20 pt-8">
        <div className="rounded-[28px] bg-[#F1EDE0] p-12 text-center shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Prefer to Browse First?</h2>
          <Button
            onClick={() => onNavigate("shop")}
            className="rounded-full bg-[#1B4332] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#143724]"
          >
            Explore Our Products
          </Button>
        </div>
      </section>
    </main>
  );
}
