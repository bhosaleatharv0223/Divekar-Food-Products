import { useEffect, useRef, useState } from "react";
import {
  ShoppingCart, Search, Menu, X, Star, ChevronRight, ChevronLeft, Minus, Plus,
  Clock, Leaf, Award, Check, MapPin, Package, PackageCheck, ShoppingBag,
  ClipboardCheck, CreditCard,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { FAQPage } from "./pages/FAQPage";
import { CheckoutPage } from "./checkout/CheckoutPage";
import type { CartItem as CheckoutCartItem } from "./checkout/types";

// ── Brand assets ──────────────────────────────────────────────────────────────
import imgLogo from "../imports/ChatGPT_Image_Jul_4__2026__04_42_01_PM.png";

// ── Real product photos ───────────────────────────────────────────────────────
const imgAlivLadoo = "/Aliv%20laddu.png";
const imgWheatMathriPublic = "/Anarase.png";
const imgBesanLadoo = "/Bessen%20laddo.png";
const imgBundiLadoo = "/boondi%20laddos.png";
const imgChakali = "/Chakali.png";
const imgTraditionalChivda = "/Chivada.png";
const imgCornPohaChivda = "/corn%20chivada.png";
const imgDinkLadoo = "/DINK%20LADU.png";
const imgJavasLadoo = "/JAVAS%20LADU.png";
const imgLasunShev = "/LASUN%20SHEV.png";
const imgMethiLadoo = "/METHI%20LADDU.png";
const imgNachniLadoo = "/NACHANI%20LADDU.png";
const imgPatalPohaChivda = "/POHA%20PETAL%20CHIWADA.png";
const imgPudachiKaranjiPublic = "/pudhachi%20kurrenjy.png";
const imgRawaLadoo = "/Rava%20LAddu.png";
const imgShankarpaliPublic = "/Shankarpali.png";
const imgPeanutLadoo = "/SHENGADANS.png";
const imgShevLadooPublic = "/Shev%20laddu.png";
const imgTilgudLadoo = "/Tilgul%20laddu.png";
const imgUradLadoo = "/uriddal%20ladu.png";
const imgWheatLadoo = "/wheat%20ladu.png";
const imgAnarsePublic = "/Anaraseee.png";
const imgDryFruitsLadoo = "/Dry fruits laddo.png";
const imgMoongDalLadoo = "/moog dal laddo.png";
const imgPaushtikLadoo = "/Paustik laddo.png";
const imgHirveMoongLadoo = "/Horvemoog laddo.png";
const imgBhadangChiwda = "/bhadang chiwada.png";
const imgNamkinShankarpali = "/1000324538.jpg";
const imgChirote = "/1000324543.jpg";

const HERO_IMAGES = [
  "/ChatGPT Image Jul 6, 2026, 06_17_04 PM.png",
  "/ChatGPT Image Jul 6, 2026, 06_15_19 PM.png",
  "/ChatGPT Image Jul 6, 2026, 06_11_32 PM.png",
  "/ChatGPT Image Jul 6, 2026, 06_05_06 PM.png",
];

// ── Types ──────────────────────────────────────────────────────────────────────

type Page = "home" | "shop" | "detail" | "about" | "contact" | "faq" | "checkout";
type FilterCategory = "all" | "ladoo" | "faral" | "chiwda" | "shev";
type Variant = "oil" | "ghee";
type Weight = number;

interface Product {
  id: number;
  name: string;
  category: "ladoo" | "faral" | "chiwda" | "shev";
  categoryLabel: string;
  shortDesc: string;
  ingredients: string;
  price: number;
  gheePrice?: number;
  /** Unsplash URL fallback for products without local photos */
  image: string;
  /** ES-module imported local photo — takes precedence over image */
  localImg?: string;
  featured?: boolean;
  hasVariant?: boolean;
}

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
}

type NavigateFn = (page: Page, product?: Product, filter?: FilterCategory) => void;

// ── Unsplash fallback URLs ────────────────────────────────────────────────────

const UNSUNS = {
  ladoo1: "https://images.unsplash.com/photo-1695568181558-034b7d3e49eb?w=700&h=500&fit=crop&auto=format",
  ladoo2: "https://images.unsplash.com/photo-1695568181440-aca4dac18650?w=700&h=500&fit=crop&auto=format",
  ladoo3: "https://images.unsplash.com/photo-1695568181747-f54dff1d4654?w=700&h=500&fit=crop&auto=format",
  ladoo4: "https://images.unsplash.com/photo-1635952346904-95f2ccfcd029?w=700&h=500&fit=crop&auto=format",
  snack1: "https://images.unsplash.com/photo-1709091052718-3cb8a990edfa?w=700&h=500&fit=crop&auto=format",
  snack2: "https://images.unsplash.com/photo-1632046320635-57b802bcd60e?w=700&h=500&fit=crop&auto=format",
  hero: "https://images.unsplash.com/photo-1695568181717-f54dff1d4654?w=900&h=800&fit=crop&auto=format",
  catLadoo: "https://images.unsplash.com/photo-1695568181558-034b7d3e49eb?w=900&h=620&fit=crop&auto=format",
};

// ── Product Data ───────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  // ── Immunity Ladoos ────────────────────────────────────────────────────────
  {
    id: 1, name: "Dink Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Gum resin & dry fruits — warming winter immunity boost",
    ingredients: "Gum resin (dink), jaggery, wheat flour, dry fruits, pure ghee, cardamom",
    price: 650, image: UNSUNS.ladoo1, localImg: imgDinkLadoo
  },
  {
    id: 2, name: "Khajur Dryfruit Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Premium Medjool dates blended with mixed dry fruits, no sugar added",
    ingredients: "Medjool dates, almonds, cashews, pistachios, walnuts, cardamom",
    price: 1200, image: UNSUNS.ladoo2, localImg: imgDryFruitsLadoo
  },
  {
    id: 3, name: "Peanut Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Roasted peanuts & jaggery — simple, wholesome, protein-packed",
    ingredients: "Peanuts, jaggery, cardamom, dry coconut",
    price: 480, image: UNSUNS.ladoo3, localImg: imgPeanutLadoo
  },
  {
    id: 4, name: "Methi Dink Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Fenugreek seeds & gum resin — traditional post-delivery nourishment",
    ingredients: "Fenugreek seeds, gum resin, jaggery, wheat flour, ghee",
    price: 700, image: UNSUNS.ladoo4, localImg: imgMethiLadoo
  },
  {
    id: 5, name: "Aliv Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Garden cress seeds — iron-rich, powerful immunity booster",
    ingredients: "Aliv seeds, jaggery, dry coconut, ghee, cardamom",
    price: 750, image: UNSUNS.ladoo1, localImg: imgAlivLadoo
  },
  {
    id: 6, name: "Moong Dal Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Yellow moong dal roasted with pure ghee",
    ingredients: "Yellow moong dal, jaggery, ghee, cardamom, dry coconut",
    price: 550, image: UNSUNS.ladoo2, localImg: imgMoongDalLadoo
  },
  {
    id: 7, name: "Hirve Moong Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Green moong dal — protein-rich, light on the stomach",
    ingredients: "Green moong dal, jaggery, ghee, cardamom",
    price: 580, image: UNSUNS.ladoo3, localImg: imgHirveMoongLadoo
  },
  {
    id: 8, name: "Urad Dal Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Black gram with ghee — traditionally served for bone health",
    ingredients: "Urad dal, jaggery, ghee, cardamom, edible gum",
    price: 520, image: UNSUNS.ladoo4, localImg: imgUradLadoo
  },
  {
    id: 9, name: "Javas Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Flaxseeds — omega-3 rich, heart-healthy snack",
    ingredients: "Flaxseeds (javas), jaggery, dry coconut, cardamom",
    price: 620, image: UNSUNS.ladoo1, localImg: imgJavasLadoo
  },
  {
    id: 10, name: "Nachni (Ragi) Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Finger millet with jaggery — calcium-rich, bone-strengthening",
    ingredients: "Ragi flour, jaggery, ghee, dry coconut, cardamom",
    price: 500, image: UNSUNS.ladoo2, localImg: imgNachniLadoo
  },
  {
    id: 11, name: "Tilgud Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Sesame & jaggery — Makar Sankranti special, warming & nutritious",
    ingredients: "Sesame seeds, jaggery, ghee, cardamom",
    price: 580, image: UNSUNS.ladoo3, localImg: imgTilgudLadoo
  },
  {
    id: 12, name: "Paushtik Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Multi-grain nutritious blend — the ultimate health ladoo",
    ingredients: "Mixed grains, dry fruits, jaggery, ghee, cardamom",
    price: 650, image: UNSUNS.ladoo4, localImg: imgPaushtikLadoo
  },
  {
    id: 13, name: "Wheat Ladoo", category: "ladoo", categoryLabel: "LADOO",
    shortDesc: "Whole wheat flour with pure ghee — classic Maharashtrian",
    ingredients: "Whole wheat flour, jaggery, ghee, cardamom",
    price: 480, image: UNSUNS.ladoo1, localImg: imgWheatLadoo
  },


  // ── Faral & Sweets ────────────────────────────────────────────────────────
  {
    id: 14, name: "Bhajni Chakli", category: "faral", categoryLabel: "FARAL",
    shortDesc: "Crispy spiral snack from mixed flour — Diwali essential",
    ingredients: "Mixed flour blend, sesame seeds, cumin, carom seeds, butter",
    price: 580, image: UNSUNS.snack1, localImg: imgChakali, featured: true
  },
  {
    id: 15, name: "Rawa Ladoo", category: "faral", categoryLabel: "LADOO",
    shortDesc: "Semolina & coconut ladoo — a quick-prep festive classic",
    ingredients: "Semolina, coconut, sugar, ghee, cardamom, cashews",
    price: 520, image: UNSUNS.ladoo3, localImg: imgRawaLadoo
  },
  {
    id: 16, name: "Bundi Ladoo", category: "faral", categoryLabel: "LADOO",
    shortDesc: "Tiny besan boondi spheres rolled in sugar syrup with saffron",
    ingredients: "Besan, sugar, ghee, saffron, cardamom, cloves",
    price: 580, image: UNSUNS.ladoo4, localImg: imgBundiLadoo
  },
  {
    id: 17, name: "Shev Che Ladoo", category: "faral", categoryLabel: "LADOO",
    shortDesc: "Crispy sev bound with pure ghee — uniquely textured & satisfying",
    ingredients: "Besan sev, jaggery, ghee, sesame, cardamom",
    price: 550, image: UNSUNS.snack2, localImg: imgShevLadooPublic, featured: true
  },
  {
    id: 18, name: "Besan Ladoo", category: "faral", categoryLabel: "LADOO",
    shortDesc: "Slow-roasted chickpea flour with ghee & sugar — melt-in-mouth",
    ingredients: "Besan, sugar, pure ghee, cardamom, almonds",
    price: 520, image: UNSUNS.ladoo2, localImg: imgBesanLadoo
  },
  {
    id: 19, name: "Sweet Shankarpali", category: "faral", categoryLabel: "FARAL",
    shortDesc: "Diamond-cut pastry, subtly sweet & melt-in-your-mouth crispy",
    ingredients: "Wheat flour, sugar, ghee, cardamom, milk",
    price: 500, image: UNSUNS.snack1, localImg: imgShankarpaliPublic, featured: true
  },
  {
    id: 20, name: "Namkin Shankarpali", category: "faral", categoryLabel: "FARAL",
    shortDesc: "Savory crispy diamond pastry — perfect with a hot cup of chai",
    ingredients: "Wheat flour, butter, carom seeds, sesame, salt, chilli",
    price: 480, image: UNSUNS.snack2, localImg: imgNamkinShankarpali
  },
  {
    id: 21, name: "Wheat Mathri", category: "faral", categoryLabel: "FARAL",
    shortDesc: "Whole wheat crispy crackers — healthier, rustic, flaky",
    ingredients: "Whole wheat flour, carom seeds, ghee, salt, pepper",
    price: 480, image: UNSUNS.snack1, localImg: imgWheatMathriPublic
  },
  {
    id: 22, name: "Pudachi Karanji", category: "faral", categoryLabel: "FARAL",
    shortDesc: "Coconut-filled crescent pastry — Diwali favourite, price varies by medium",
    ingredients: "Wheat flour, dry coconut, sugar, cardamom, sesame",
    price: 580, gheePrice: 750, image: UNSUNS.snack2, localImg: imgPudachiKaranjiPublic, hasVariant: true
  },
  {
    id: 23, name: "Chirote", category: "faral", categoryLabel: "FARAL",
    shortDesc: "Layered sweet puff pastry, dusted with powdered sugar",
    ingredients: "All-purpose flour, ghee, sugar, cardamom, saffron",
    price: 620, image: UNSUNS.snack2, localImg: imgChirote
  },
  {
    id: 24, name: "Anarse", category: "faral", categoryLabel: "FARAL",
    shortDesc: "Traditional Diwali sesame rice cookies — delicate, melt-away",
    ingredients: "Rice flour, sesame seeds, jaggery, ghee or refined oil",
    price: 650, gheePrice: 850, image: UNSUNS.snack1, localImg: imgAnarsePublic, hasVariant: true
  },


  // ── Chiwda ─────────────────────────────────────────────────────────────────
  {
    id: 25, name: "Patal Poha Chiwda", category: "chiwda", categoryLabel: "CHIWDA",
    shortDesc: "Thin flattened rice mixture — light, crunchy & addictive",
    ingredients: "Thin poha, peanuts, curry leaves, mustard seeds, turmeric, sugar",
    price: 520, image: UNSUNS.snack2, localImg: imgPatalPohaChivda
  },
  {
    id: 26, name: "Corn Poha Chivda", category: "chiwda", categoryLabel: "CHIWDA",
    shortDesc: "Corn puffs mixture — light, crunchy everyday snack",
    ingredients: "Corn puffs, peanuts, dry coconut, curry leaves, spices",
    price: 500, image: UNSUNS.snack1, localImg: imgCornPohaChivda
  },
  {
    id: 27, name: "Bhadang Chiwda", category: "chiwda", categoryLabel: "CHIWDA",
    shortDesc: "Spiced puffed rice — Kolhapur-style street food crunch",
    ingredients: "Puffed rice, peanuts, dried onion, spices, curry leaves",
    price: 480, image: UNSUNS.snack2, localImg: imgBhadangChiwda
  },


  {
    id: 29, name: "Traditional Chivda", category: "chiwda", categoryLabel: "CHIWDA",
    shortDesc: "Classic Maharashtrian festive chivda with a crisp, savoury and gently spiced finish",
    ingredients: "Flattened rice, peanuts, roasted gram, curry leaves, mustard seeds, turmeric and spices",
    price: 500, image: UNSUNS.snack1, localImg: imgTraditionalChivda
  },

  // ── Shev ───────────────────────────────────────────────────────────────────
  {
    id: 28, name: "Lasun Shev", category: "shev", categoryLabel: "SHEV",
    shortDesc: "Garlic-flavored crispy sev — bold, aromatic, utterly moreish",
    ingredients: "Besan flour, garlic, carom seeds, red chilli, oil",
    price: 500, image: UNSUNS.snack2, localImg: imgLasunShev
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Joshi", location: "Kothrud, Pune", rating: 5,
    text: "The Dink Ladoos are exactly like my mother-in-law used to make. Pure jaggery, no shortcuts. We order every winter without fail."
  },
  {
    name: "Meera Kulkarni", location: "Wakad, Pune", rating: 5,
    text: "Sent a box of Bhajni Chakli and Bundi Ladoos to my sister in the US. She said it tasted like home. That says everything!"
  },
  {
    name: "Rahul Deshpande", location: "Viman Nagar, Pune", rating: 5,
    text: "Order every Diwali for the past 4 years. The Pudachi Karanji in pure ghee is exceptional. Fresh, hygienic, right on time."
  },
  {
    name: "Sunita Pawar", location: "Magarpatta, Pune", rating: 5,
    text: "Khajur Dryfruit Ladoos are my go-to for gifting. No preservatives, and the taste is absolutely genuine home-made."
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function computePrice(product: Product, variant: Variant): number {
  if (product.hasVariant && variant === "ghee" && product.gheePrice) return product.gheePrice;
  return product.price;
}

function categoryDisplayName(cat: Product["category"]): string {
  if (cat === "ladoo") return "Immunity Ladoo";
  if (cat === "faral") return "Festival Faral";
  if (cat === "chiwda") return "Chiwda";
  return "Shev";
}

// ── Micro-components ──────────────────────────────────────────────────────────

function VegDot() {
  return (
    <div className="w-5 h-5 bg-white border-2 border-green-600 rounded-sm flex items-center justify-center shadow-sm flex-shrink-0">
      <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />
    </div>
  );
}

function StarRow({ rating }: Readonly<{ rating: number }>) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star key={value} size={14} fill={value <= rating ? "#FDD835" : "none"} stroke="#FDD835" />
      ))}
    </div>
  );
}

// Real circular badge from the uploaded brand asset
function LogoBadge({ size = 44 }: Readonly<{ size?: number }>) {
  return (
    <ImageWithFallback
      src={imgLogo}
      alt="Divekar Foods logo"
      className="rounded-full object-cover flex-shrink-0"
      style={{ width: size, height: size, display: "block" }}
    />
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product, variant, onVariantChange, onNavigate,
}: Readonly<{
  product: Product; variant: Variant; onVariantChange: (v: Variant) => void;
  onNavigate: NavigateFn;
}>) {
  const price = computePrice(product, variant);
  const imageSrc = product.localImg ?? product.image;

  return (
    <div
      className="bg-card rounded-[20px] overflow-hidden flex flex-col group md:min-h-[460px] shadow-[0_2px_14px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_rgba(0,0,0,0.12)]"
    >
      {/* Image — ~65% of card height */}
      <button
        type="button"
        onClick={() => onNavigate("detail", product)}
        className="relative overflow-hidden bg-[#E8E2D0] h-[240px] sm:h-[300px] md:h-[360px] flex-shrink-0"
      >
        <ImageWithFallback
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={product.localImg
            ? { objectPosition: "center center" }
            : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
        {/* Veg dot + category pill — top-left */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <VegDot />
          <span className="text-[#1C1C1C] text-[10px] font-bold px-3 py-1 rounded-full tracking-widest leading-none" style={{ backgroundColor: "#FDD835" }}>
            {product.categoryLabel}
          </span>
        </div>
      </button>

      {/* Content body */}
      <div className="p-6 flex flex-col flex-1 gap-2">
        <p className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">{categoryDisplayName(product.category)}</p>
        <button
          type="button"
          onClick={() => onNavigate("detail", product)}
          className="font-bold text-foreground leading-snug text-left cursor-pointer hover:text-[#1B4332] transition-colors"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 21 }}
        >
          {product.name}
        </button>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{product.shortDesc}</p>

        {/* Oil / Ghee toggle — Karanji & Anarse only */}
        {product.hasVariant && (
          <div className="flex gap-2 mt-1">
            {(["oil", "ghee"] as Variant[]).map(v => (
              <button
                key={v}
                onClick={() => onVariantChange(v)}
                className="flex-1 py-2 text-xs font-semibold rounded-full border transition-all"
                style={{ backgroundColor: variant === v ? "#1B4332" : "transparent", color: variant === v ? "#fff" : "#1C1C1C", borderColor: variant === v ? "#1B4332" : "rgba(0,0,0,0.12)" }}
              >
                {v === "oil" ? "Refined Oil" : "Pure Ghee"}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold" style={{ color: "#1B4332" }}>₹{price}</span>
          <span className="text-sm text-muted-foreground">/ kg</span>
        </div>
        <p className="text-xs font-semibold text-muted-foreground">Minimum order: 500g (0.5 kg)</p>

        <button
          onClick={() => onNavigate("detail", product)}
          className="w-full text-white font-semibold rounded-full flex items-center justify-center gap-2 active:scale-[0.97] mt-1 transition-colors"
          style={{ height: 50, fontSize: 15, backgroundColor: "#1B4332" }}
        >
          <ShoppingCart size={17} /> Order Now
        </button>
      </div>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

function Header({ cartCount, onNavigate, mobileOpen, setMobileOpen }: {
  cartCount: number; onNavigate: NavigateFn; mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-background/96 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-5 py-2.5 flex flex-wrap items-center gap-4">
        {/* Brand — real badge + wordmark */}
        <button className="flex items-center gap-3 mr-4" type="button" onClick={() => onNavigate("home")}> 
          <LogoBadge size={52} />
          <div className="leading-none text-left hidden sm:block">
            <div className="text-[19px] font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Divekar Foods
            </div>
            <div className="text-[9px] tracking-[0.18em] text-muted-foreground uppercase">Homely Food is Good Food</div>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-6 flex-1">
          {[
            { label: "Home", p: "home" as Page },
            { label: "Shop", p: "shop" as Page },
            { label: "Categories", p: "shop" as Page },
            { label: "About", p: "about" as Page },
            { label: "FAQ", p: "faq" as Page },
            { label: "Contact", p: "contact" as Page },
          ].map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => onNavigate(link.p)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <button type="button" className="hidden md:flex text-muted-foreground hover:text-foreground transition-colors p-1">
            <Search size={20} />
          </button>
          <button type="button" onClick={() => onNavigate(cartCount > 0 ? "checkout" : "shop")} className="relative p-1">
            <ShoppingCart size={22} className="text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: "#8BC34A" }}>
                {cartCount}
              </span>
            )}
          </button>
          <button type="button" className="lg:hidden text-foreground p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border px-5 py-4 flex flex-col gap-1">
          {['Home', 'Shop', 'Categories', 'About', 'FAQ', 'Contact'].map((item) => {
            const dest: Page =
              item === 'Shop' || item === 'Categories' ? 'shop'
                : item === 'About' ? 'about'
                  : item === 'FAQ' ? 'faq'
                    : item === 'Contact' ? 'contact'
                      : 'home';

            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onNavigate(dest);
                  setMobileOpen(false);
                }}
                className="text-left text-[15px] font-medium text-foreground py-2.5 border-b border-border/40 last:border-0"
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

// ── Homepage ──────────────────────────────────────────────────────────────────

function HomePage({ onNavigate, variantSelections, setVariantSelections, testimonialIndex, setTestimonialIndex }: {
  onNavigate: NavigateFn;
  variantSelections: Record<number, Variant>;
  setVariantSelections: React.Dispatch<React.SetStateAction<Record<number, Variant>>>;
  testimonialIndex: number; setTestimonialIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const productRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = globalThis.setInterval(() => {
      setActiveHeroIndex((currentIndex) => (currentIndex + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => globalThis.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = globalThis.setInterval(() => {
      setTestimonialIndex((currentIndex) => (currentIndex + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => globalThis.clearInterval(intervalId);
  }, [setTestimonialIndex]);

  // Feature the three products we have authentic photos for
  const featured = [
    PRODUCTS.find(p => p.id === 14) ?? PRODUCTS[0], // Bhajni Chakli
    PRODUCTS.find(p => p.id === 19) ?? PRODUCTS[0], // Sweet Shankarpali
    PRODUCTS.find(p => p.id === 17) ?? PRODUCTS[0], // Shev Che Ladoo
  ];
  const quickShopProducts = [
    PRODUCTS.find(p => p.id === 14) ?? PRODUCTS[0],
    PRODUCTS.find(p => p.id === 29) ?? PRODUCTS[0],
    PRODUCTS.find(p => p.id === 19) ?? PRODUCTS[0],
    PRODUCTS.find(p => p.id === 1) ?? PRODUCTS[0],
  ];

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-background py-6 px-5 md:py-10">
        <div className="absolute inset-0">
          {HERO_IMAGES.map((image, index) => (
            <img
              key={image}
              src={image}
              loading="lazy"
              alt="Homemade Maharashtrian festive sweets and faral platter"
              aria-hidden={index !== activeHeroIndex}
              className={`absolute inset-0 h-full w-full object-cover object-[center_30%] transition-opacity duration-1000 ease-in-out motion-reduce:transition-none md:object-center lg:object-right ${index === activeHeroIndex ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.12) 100%)" }}
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[360px] max-w-7xl flex-col justify-start gap-8 pt-8 pb-10 sm:min-h-[420px] md:min-h-[460px] lg:min-h-[520px] lg:pt-12 lg:pb-14">
          <div className="max-w-2xl">
            <h1 className="mb-5 text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-[3.4rem]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Traditional Maharashtrian <span style={{ color: "#E8F5E9" }}>Diwali Faral, Ladoo &amp; Snacks</span>
            </h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-white/90 md:text-lg">
              Experience authentic Maharashtrian Faral handcrafted in Pune since 2015. Fresh Ladoo, Karanji, Chakli, Chivda, and festive sweets made using traditional family recipes with no preservatives.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
              <button
                type="button"
                onClick={() => onNavigate("shop")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-white font-semibold transition-colors bg-[#1B4332] hover:bg-[#14532d]"
              >
                Shop Now <ChevronRight size={18} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-white font-semibold bg-[#25D366] hover:bg-[#1DA851]"
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="absolute right-4 top-1 z-20 text-white text-xs font-bold px-4 py-2 rounded-full tracking-widest shadow-lg" style={{ backgroundColor: "#1B4332" }}>
            ★ FEATURED TODAY
          </div>
        </div>

        <div className="mx-auto mt-1 max-w-7xl md:mt-2">
          <div className="mb-2 flex items-center justify-center text-center">
            <div className="relative z-10 inline-flex items-center gap-3 rounded-full bg-black/70 px-6 py-2 text-[11px] uppercase tracking-widest text-white font-semibold shadow-sm shadow-black/20">
              <span className="h-px w-6 bg-[#D4AF37]" aria-hidden="true" />
              <span className="font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: '#D4AF37' }}>Explore the Collection</span>
              <span className="h-px w-6 bg-[#D4AF37]" aria-hidden="true" />
            </div>
          </div>
          <div className="mb-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#8BC34A" }}>Quick Shop</p>
            <h3 className="text-lg font-bold text-foreground sm:text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>Popular picks</h3>
          </div>
          <style>{`
            @keyframes scroll {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            .quick-shop-track {
              animation: scroll 60s linear infinite;
            }
            .quick-shop-track:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-3 shadow-sm sm:p-4">
            <div className="quick-shop-track flex w-max gap-3" aria-label="All products">
              {[...PRODUCTS, ...PRODUCTS].map((product, index) => (
                <button
                  key={`${product.id}-${index}`}
                  type="button"
                  onClick={() => onNavigate("detail", product)}
                  className="group relative w-64 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1B4332]/30 hover:shadow-md"
                >
                  <div className="relative h-28 overflow-hidden sm:h-32">
                    <ImageWithFallback src={product.localImg ?? product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-2 right-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#1B4332] shadow-sm">
                      ₹{product.price}/kg
                    </div>
                  </div>
                  <div className="p-3 text-left">
                    <p className="truncate text-sm font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{product.categoryLabel}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto -mt-2 md:-mt-10">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#8BC34A" }}>Explore the collection</p>
              <h2 className="text-lg font-bold text-foreground sm:text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>Our Products</h2>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => productRailRef.current?.scrollBy({ left: -520, behavior: "smooth" })}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-[#E8F5E9]"
                aria-label="Scroll products left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => productRailRef.current?.scrollBy({ left: 520, behavior: "smooth" })}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-[#E8F5E9]"
                aria-label="Scroll products right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={productRailRef}
            className="-mx-5 flex touch-pan-x snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto overscroll-x-contain px-5 pb-4 sm:mx-0 sm:scroll-px-0 sm:px-0"
            aria-label="All products"
          >
            {PRODUCTS.map(product => (
              <button
                key={product.id}
                type="button"
                onClick={() => onNavigate("detail", product)}
                className="group flex min-w-[178px] snap-start items-center gap-2.5 rounded-xl border border-border bg-card p-2.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1B4332]/30 hover:shadow-md sm:min-w-[220px] sm:gap-3 sm:rounded-2xl sm:p-3"
              >
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-[#E8E2D0] sm:h-16 sm:w-16 sm:rounded-xl">
                  <ImageWithFallback src={product.localImg ?? product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="min-w-0">
                  <p className="max-w-[88px] truncate text-xs font-bold text-foreground sm:max-w-[120px] sm:text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{product.categoryLabel}</p>
                  <p className="mt-1 text-xs font-bold sm:text-sm" style={{ color: "#1B4332" }}>&#8377;{product.price} / kg</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Min. 500g</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Tiles ── */}
      <section className="py-16 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#8BC34A" }}>Browse by Category</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>What Are You Craving?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Faral tile � real Bhajni Chakli photo */}
            <button
              onClick={() => onNavigate("shop", undefined, "faral")}
              className="relative rounded-2xl overflow-hidden group text-left bg-[#3A2A1A] cursor-pointer h-[280px] sm:h-[290px]"
            >
              <ImageWithFallback
                src={imgChakali}
                alt="Festival Faral and Sweets"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                style={{ opacity: 0.85 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-[#1C1C1C] text-[10px] font-bold px-3 py-1 rounded-full tracking-widest mb-3 inline-block" style={{ backgroundColor: "#FDD835" }}>FARAL</span>
                <h3 className="text-white text-2xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Festival Faral & Sweets</h3>
                <p className="text-white/75 text-sm mt-1">Chakli, Chiwda, Karanji & more � 15 varieties</p>
              </div>
              <div className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/35 transition-all"><ChevronRight size={18} color="white" /></div>
            </button>

            {/* Ladoo tile � Unsplash */}
            <button
              onClick={() => onNavigate("shop", undefined, "ladoo")}
              className="relative rounded-2xl overflow-hidden group text-left bg-[#E8E2D0] cursor-pointer h-[280px] sm:h-[290px]"
            >
              <img
                src={imgDryFruitsLadoo}
                alt="Immunity Ladoos"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <span className="text-[#1C1C1C] text-[10px] font-bold px-3 py-1 rounded-full tracking-widest mb-3 inline-block" style={{ backgroundColor: "#FDD835" }}>
                  LADOO
                </span>
                <h3 className="text-white text-2xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Healthy Immunity Ladoos
                </h3>
                <p className="text-white/75 text-sm mt-1">No sugar � 13 varieties</p>
              </div>
              <div className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/35 transition-all"><ChevronRight size={18} color="white" /></div>
            </button>
          </div>
        </div>
      </section>
      <section className="py-16 px-5" style={{ backgroundColor: "#F5F3E8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#8BC34A" }}>Bestsellers</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Customer Favourites</h2>
            </div>
            <button onClick={() => onNavigate("shop")} className="hidden md:flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: "#1B4332" }}>
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} variant={variantSelections[product.id] ?? "oil"}
                onVariantChange={v => setVariantSelections(prev => ({ ...prev, [product.id]: v }))}
                onNavigate={onNavigate} />
            ))}
          </div>
          <div className="flex md:hidden justify-center mt-8">
            <button onClick={() => onNavigate("shop")} className="flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full" style={{ backgroundColor: "#1B4332" }}>
              View All Products <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── How to Order ── */}
      <section className="relative py-20 px-5 overflow-hidden" style={{ backgroundColor: "#1B4332" }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(139,195,74,0.18),transparent_22%),radial-gradient(circle_at_right_bottom,rgba(255,255,255,0.08),transparent_22%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#8BC34A" }}>How to Order</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>A premium ordering experience, from discovery to delivery.</h2>
            <p className="text-white/70 mt-3 max-w-2xl mx-auto text-sm md:text-base">Browse our handcrafted ladoos, faral, and chiwda, add favorites to your cart, then confirm delivery and payment online for fresh preparation.</p>
          </div>

          <div className="relative grid gap-6 lg:grid-cols-3">
            <div className="hidden lg:block absolute inset-x-0 top-1/2 h-px bg-white/10" />

            {[
              {
                step: "01",
                Icon: ShoppingBag,
                title: "Explore Our Collection",
                desc: "Browse ladoos, faral, and chiwda and add your favorites to the cart.",
              },
              {
                step: "02",
                Icon: ClipboardCheck,
                title: "Place Your Order",
                desc: "Review your cart, choose delivery method, and confirm your details.",
              },
              {
                step: "03",
                Icon: CreditCard,
                title: "Complete Payment",
                desc: "Pay securely online or via UPI, and we’ll prepare your order fresh.",
              },
            ].map(step => (
              <div key={step.step} className="relative rounded-[20px] border border-white/15 bg-white/95 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-sm">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#E9F9D7] via-[#DBF7CD] to-[#F5FFEB] shadow-[0_18px_48px_rgba(139,195,74,0.16)]">
                  <step.Icon size={28} strokeWidth={1.8} style={{ color: "#1B4332" }} />
                </div>
                <div className="mb-3 text-xs font-semibold tracking-[0.3em] uppercase text-[#1B4332]/70">Step {step.step}</div>
                <h3 className="text-2xl font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button onClick={() => onNavigate("contact")} className="min-w-[200px] rounded-full bg-[#8BC34A] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#7FBF3C]">
                Contact Us
              </button>
              <button onClick={() => onNavigate("shop")} className="min-w-[200px] rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#1B4332] transition hover:bg-[#f5f5f0]">
                Shop Now
              </button>
            </div>
            <p className="mt-4 text-sm text-white/70">or call us at <a href="tel:9579702008" className="font-semibold text-white/90 hover:text-white">95797 02008</a></p>
          </div>
        </div>
      </section>

      {/* ── Trust Row ── */}
      <section className="border-y border-[#1B4332]/10 bg-[#F8F6EE] px-5 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Leaf, title: "Pure Ingredients", desc: "No artificial colors, flavors or preservatives. Ever." },
            { Icon: Package, title: "Made-to-Order Freshness", desc: "Your order is made on the day we prepare it, not days before." },
            { Icon: Award, title: "Hygienic Handmade Process", desc: "Prepared in a clean home kitchen with love and care since 2015." },
            { Icon: PackageCheck, title: "Secure Box Packaging", desc: "Every order is carefully packed in sturdy boxes to keep your sweets and faral fresh and safe during transit." },
          ].map(({ Icon, title, desc }) => (
            <article
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-[#1B4332]/10 bg-white p-6 shadow-[0_12px_35px_rgba(27,67,50,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1B4332]/25 hover:shadow-[0_18px_45px_rgba(27,67,50,0.14)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1B4332] via-[#8BC34A] to-[#FDD835]" aria-hidden="true" />
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1B4332]/10 bg-[#E8F5E9] shadow-inner transition-transform duration-300 group-hover:scale-105">
                <Icon size={24} strokeWidth={1.8} style={{ color: "#1B4332" }} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 px-5 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#8BC34A" }}>Customer Love</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>What Our Customers Say</h2>
          </div>
          <div key={testimonialIndex} className="bg-card rounded-2xl p-8 md:p-10" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }} aria-live="polite">
            <StarRow rating={TESTIMONIALS[testimonialIndex].rating} />
            <blockquote className="text-xl md:text-2xl text-foreground mt-5 mb-7 leading-relaxed italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              "{TESTIMONIALS[testimonialIndex].text}"
            </blockquote>
            <div>
              <p className="font-bold text-foreground">{TESTIMONIALS[testimonialIndex].name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin size={12} /> {TESTIMONIALS[testimonialIndex].location}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() => setTestimonialIndex(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-[#1B4332] hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            {TESTIMONIALS.map((testimonial, index) => (
              <button
                key={`testimonial-dot-${testimonial.name}-${index}`}
                type="button"
                onClick={() => setTestimonialIndex(index)}
                className={`rounded-full transition-all self-center ${index === testimonialIndex ? "w-6 h-6 bg-[#1B4332]" : "w-2 h-2 bg-[rgba(0,0,0,0.15)]"}`}
              />
            ))}
            <button
              type="button"
              onClick={() => setTestimonialIndex(i => (i + 1) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center transition-colors hover:bg-[#1B4332] hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA Banner ── */}
      <section className="py-16 px-5" style={{ backgroundColor: "#FDD835" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C1C1C] mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Give Something That Feels Homemade and Festive
          </h2>
          <p className="text-[#1C1C1C]/70 mb-8 text-base md:text-lg">Perfect for Diwali, weddings, housewarming, or simply a thoughtful gift from the heart.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate("shop")} className="text-white font-bold px-8 py-4 rounded-full text-base" style={{ backgroundColor: "#1B4332" }}>
              Shop Now
            </button>
            <button onClick={() => onNavigate("contact")} className="flex items-center gap-2 font-bold px-8 py-4 rounded-full text-base bg-white text-[#1C1C1C]">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Shop Page ─────────────────────────────────────────────────────────────────

function ShopPage({ filterCategory, setFilterCategory, variantSelections, setVariantSelections, onNavigate, searchQuery, setSearchQuery }: {
  filterCategory: FilterCategory; setFilterCategory: (c: FilterCategory) => void;
  variantSelections: Record<number, Variant>; setVariantSelections: React.Dispatch<React.SetStateAction<Record<number, Variant>>>;
  onNavigate: NavigateFn;
  searchQuery: string; setSearchQuery: (q: string) => void;
}) {
  const filters: { label: string; value: FilterCategory }[] = [
    { label: "All Products", value: "all" }, { label: "Immunity Ladoos", value: "ladoo" },
    { label: "Faral & Sweets", value: "faral" }, { label: "Chiwda", value: "chiwda" }, { label: "Shev", value: "shev" },
  ];

  const filtered = PRODUCTS.filter(p => {
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    const q = searchQuery.toLowerCase();
    return matchCat && (!q || p.name.toLowerCase().includes(q) || p.shortDesc);
  });

  return (
    <main className="pb-24">
      <div className="bg-background border-b border-border py-12 px-5">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#8BC34A" }}>Our Collection</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Homemade Ladoo & Faral Collection</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">Authentic homemade Maharashtrian snacks and sweets, freshly prepared after your order using premium ingredients.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row gap-3 py-6 border-b border-border">
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search ladoo, chakli, chiwda…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-full bg-card focus:outline-none focus:border-[#1B4332] transition-colors" />
          </div>
          <select className="sm:ml-auto text-sm border border-border rounded-full px-5 py-2.5 bg-card focus:outline-none text-foreground cursor-pointer">
            <option>Sort: Default</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Name: A to Z</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2 py-5">
          {filters.map(f => (
            <button key={f.value} onClick={() => setFilterCategory(f.value)} className="px-5 py-2 rounded-full text-sm font-semibold transition-all border"
              style={{ backgroundColor: filterCategory === f.value ? "#1B4332" : "#fff", color: filterCategory === f.value ? "#fff" : "#6B6B6B", borderColor: filterCategory === f.value ? "#1B4332" : "rgba(0,0,0,0.1)" }}>
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground font-medium">{filtered.length} {filtered.length === 1 ? "product" : "products"}</span>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} variant={variantSelections[product.id] ?? "oil"}
                onVariantChange={v => setVariantSelections(prev => ({ ...prev, [product.id]: v }))}
                onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-lg text-muted-foreground mb-3">No products found</p>
            <button onClick={() => { setFilterCategory("all"); setSearchQuery(""); }} className="text-sm font-semibold underline" style={{ color: "#1B4332" }}>Clear filters</button>
          </div>
        )}
      </div>
    </main>
  );
}

// ── Product Detail Page ───────────────────────────────────────────────────────

function ProductDetailPage({ product, variant, setVariant, weight, setWeight, onAddToCart, onNavigate, variantSelections, setVariantSelections, addedToCart }: {
  product: Product; variant: Variant; setVariant: (v: Variant) => void;
  weight: Weight; setWeight: React.Dispatch<React.SetStateAction<Weight>>;
  onAddToCart: (id: number) => void; onNavigate: NavigateFn;
  variantSelections: Record<number, Variant>; setVariantSelections: React.Dispatch<React.SetStateAction<Record<number, Variant>>>;
  addedToCart: number | null;
}) {
  const price = computePrice(product, variant);
  const unitPrice = (price * weight) / 1000;
  const formattedUnitPrice = unitPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  const isAdded = addedToCart === product.id;
  const imageSrc = product.localImg ?? product.image;
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  const waMsg = `Hello! I'd like to order ${weight}g of ${product.name}${product.hasVariant ? ` (${variant === "oil" ? "Refined Oil" : "Pure Ghee"})` : ""} from Divekar Foods. Approx. total: Rs. ${formattedUnitPrice}. Please confirm availability.`;

  return (
    <main className="pb-24">
      <div className="max-w-7xl mx-auto px-5 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => onNavigate("home")} className="hover:text-foreground transition-colors">Home</button>
          <ChevronRight size={14} />
          <button onClick={() => onNavigate("shop")} className="hover:text-foreground transition-colors">Shop</button>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image gallery */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-[#E8E2D0]" style={{ height: 500 }}>
              <ImageWithFallback src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {/* Thumbnail strip � show related photos if available */}
            {related.some(p => p.localImg) && (
              <div className="flex gap-3 mt-3">
                {related.filter(p => p.localImg).slice(0, 4).map(p => (
                  <button
                    key={p.id}
                    onClick={() => onNavigate("detail", p)}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-[#E8E2D0] flex-shrink-0 border-2 border-transparent hover:border-[#1B4332] transition-colors"
                  >
                    <ImageWithFallback src={p.localImg!} alt={p.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="py-2">
            <div className="flex items-center gap-2 mb-3">
              <VegDot />
              <span className="text-[#1C1C1C] text-[10px] font-bold px-3 py-1 rounded-full tracking-widest" style={{ backgroundColor: "#FDD835" }}>{product.categoryLabel}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h1>
            <div className="flex items-center gap-2 mb-4"><StarRow rating={5} /><span className="text-xs text-muted-foreground">(Verified purchases)</span></div>
            <p className="text-muted-foreground mb-5 leading-relaxed">{product.shortDesc}</p>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold" style={{ color: "#1B4332" }}>₹{price}</span>
              <span className="text-muted-foreground">/ kg</span>
              <span className="text-sm text-muted-foreground ml-2 font-medium">= &#8377;{formattedUnitPrice} for {weight}g</span>
            </div>

            {product.hasVariant && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-foreground mb-2">Cooking Medium</p>
                <div className="flex gap-3">
                  {(["oil", "ghee"] as Variant[]).map(v => (
                    <button key={v} onClick={() => setVariant(v)} className="flex-1 py-3 text-sm font-semibold rounded-full border-2 transition-all"
                      style={{ backgroundColor: variant === v ? "#1B4332" : "#fff", color: variant === v ? "#fff" : "#1C1C1C", borderColor: variant === v ? "#1B4332" : "rgba(0,0,0,0.12)" }}>
                      {v === "oil" ? `Refined Oil — ₹${product.price}/kg` : `Pure Ghee — ₹${product.gheePrice}/kg`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">Quantity</p>
                <p className="text-xs font-medium text-muted-foreground">Minimum order: 500g (0.5 kg)</p>
              </div>
              <div className="flex items-center rounded-full border-2 border-[#1B4332]/20 bg-white p-1.5">
                <button
                  type="button"
                  onClick={() => setWeight(current => Math.max(500, current - 100))}
                  disabled={weight <= 500}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[#1B4332] transition-colors hover:bg-[#E8F5E9] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Decrease quantity by 100 grams"
                >
                  <Minus size={18} />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-lg font-bold text-[#1B4332]">
                    {weight >= 1000 ? `${(weight / 1000).toFixed(weight % 1000 === 0 ? 0 : 1)} kg` : `${weight}g`}
                  </p>
                  <p className="text-xs text-muted-foreground">&#8377;{formattedUnitPrice} total</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWeight(current => current + 100)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1B4332] text-white transition-colors hover:bg-[#14532d]"
                  aria-label="Increase quantity by 100 grams"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: "#F5F3E8" }}>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1" style={{ color: "#8BC34A" }}>Ingredients</p>
              <p className="text-sm text-muted-foreground">{product.ingredients}</p>
            </div>

        <div className="flex items-start gap-3 rounded-xl p-4 mb-6" style={{ backgroundColor: "#FFF8DC" }}>
          <Clock size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#7B5E00" }} />
          <p className="text-sm" style={{ color: "#7B5E00" }}>
            <span className="font-semibold">2-3 day lead time:</span> All items are made fresh to order. We will confirm your delivery date once you place the order.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => onAddToCart(product.id)} className="flex-1 flex items-center justify-center gap-2 text-white font-bold rounded-full py-4 transition-colors"
            style={{ backgroundColor: isAdded ? "#166534" : "#1B4332" }}>
            {isAdded ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add {weight}g to Cart</>}
          </button>
          <button
            onClick={() => onNavigate("checkout")}
            className="flex-1 flex items-center justify-center gap-2 text-white font-bold rounded-full py-4"
            style={{ backgroundColor: "#1B4332" }}
          >
            <Check size={18} /> Checkout Now
          </button>
        </div>
      </div>
    </div>

        {
    related.length > 0 && (
      <div className="mt-20">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {related.map(p => (
            <ProductCard key={p.id} product={p} variant={variantSelections[p.id] ?? "oil"}
              onVariantChange={v => setVariantSelections(prev => ({ ...prev, [p.id]: v }))}
              onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    )
  }
      </div >
    </main >
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <footer className="bg-[#1C1C1C] text-white">
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <LogoBadge size={56} />
              <div className="leading-none">
                <div className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Divekar Foods</div><div className="text-[10px] tracking-wider text-white/45 uppercase mt-0.5">Homely Food is Good Food</div></div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-4">Homemade Maharashtrian faral, ladoos and festive sweets. Established 2015, Magarpatta City, Pune.</p>
            <p className="text-xs text-white/30 italic">"Excellent Taste In Every Bite"</p>
          </div>

          <div>
            <h4 className="font-bold text-xs tracking-[0.15em] uppercase text-white/45 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              {["All Products", "Immunity Ladoos", "Faral & Sweets", "Chiwda", "Shev", "Gift Boxes"].map(link => (
                <li key={link}><button onClick={() => onNavigate("shop")} className="text-white/65 hover:text-white transition-colors">{link}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs tracking-[0.15em] uppercase text-white/45 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "How to Order", "FAQ", "Contact Us", "Shipping Info", "Return Policy"].map(link => (
                <li key={link}>
                  <button
                    onClick={() => {
                      if (link === "About Us") onNavigate("about");
                      else if (link === "How to Order") onNavigate("faq");
                      else if (link === "FAQ") onNavigate("faq");
                      else if (link === "Contact Us") onNavigate("contact");
                      else if (link === "Shipping Info") onNavigate("faq");
                      else if (link === "Return Policy") onNavigate("contact");
                    }}
                    className="text-white/65 hover:text-white transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs tracking-[0.15em] uppercase text-white/45 mb-3">Newsletter</h4>
            <div className="flex gap-2">
              <input type="email" placeholder="your@email.com" className="flex-1 rounded-full px-4 py-2.5 text-sm text-white placeholder-white/35 focus:outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }} />
              <button className="text-white text-sm font-semibold px-4 py-2.5 rounded-full" style={{ backgroundColor: "#8BC34A" }}>Go</button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" }}>
          <p>© 2024 Divekar Foods. All rights reserved. Established 2015, Magarpatta City, Pune.</p>
          <p>Made with ❤️ in Pune, Maharashtra</p>
        </div>
      </div>
    </footer>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  // ── Cart: full item array so CheckoutPage has name/price/weight data ─────────
  const [cartItems, setCartItems] = useState<CheckoutCartItem[]>([]);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  // ─────────────────────────────────────────────────────────────────────────────
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [variantSelections, setVariantSelections] = useState<Record<number, Variant>>({});
  const [detailVariant, setDetailVariant] = useState<Variant>("oil");
  const [detailWeight, setDetailWeight] = useState<Weight>(500);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigateTo: NavigateFn = (p, product, filter) => {
    setPage(p);
    if (product) { setSelectedProduct(product); setDetailVariant("oil"); setDetailWeight(500); }
    if (filter !== undefined) setFilterCategory(filter);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Adds or increments a cart item.
   * @param id          - PRODUCTS array id
   * @param weightGrams - weight chosen by user (defaults to 500g for cards)
   */
  const handleAddToCart = (id: number, weightGrams: number = 500) => {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    const variant = variantSelections[id] ?? "oil";
    const pricePerKg = computePrice(product, variant);
    const unitPrice = parseFloat(((pricePerKg * weightGrams) / 1000).toFixed(2));
    const weightLabel = weightGrams >= 1000
      ? `${(weightGrams / 1000).toFixed(weightGrams % 1000 === 0 ? 0 : 1)} kg`
      : `${weightGrams}g`;
    const itemId = `${id}-${weightGrams}-${variant}`;

    setCartItems(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing) return prev.map(i => i.id === itemId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: itemId, name: product.name, weight: weightLabel, unitPrice, qty: 1 }];
    });

    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 1600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Header cartCount={cartCount} onNavigate={navigateTo} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {page === "home" && (
        <HomePage onNavigate={navigateTo} variantSelections={variantSelections} setVariantSelections={setVariantSelections}
          testimonialIndex={testimonialIndex} setTestimonialIndex={setTestimonialIndex} />
      )}
      {page === "shop" && (
        <ShopPage filterCategory={filterCategory} setFilterCategory={setFilterCategory}
          variantSelections={variantSelections} setVariantSelections={setVariantSelections}
          onNavigate={navigateTo}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}
      {page === "about" && <AboutPage onNavigate={navigateTo} />}
      {page === "contact" && <ContactPage onNavigate={navigateTo} />}
      {page === "faq" && <FAQPage onNavigate={navigateTo} />}
      {page === "detail" && selectedProduct && (
        <ProductDetailPage product={selectedProduct} variant={detailVariant} setVariant={setDetailVariant}
          weight={detailWeight} setWeight={setDetailWeight} onAddToCart={handleAddToCart} onNavigate={navigateTo}
          variantSelections={variantSelections} setVariantSelections={setVariantSelections} addedToCart={addedToCart} />
      )}
      {page === "checkout" && (
        <CheckoutPage
          cartItems={cartItems}
          onNavigateBack={() => navigateTo("shop")}
        />
      )}

      {/* Skip footer on checkout — it has its own bottom padding */}
      {page !== "checkout" && <Footer onNavigate={navigateTo} />}
    </div>
  );
}
