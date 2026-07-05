import { useCallback, useRef, useState } from "react";
import type React from "react";
import html2canvas from "html2canvas";
import type { CartItem, CustomerDetails, DeliveryMethod, OrderLocation } from "./types";
import { DeliveryMethodStep } from "./DeliveryMethodStep";
import { LocationPicker } from "./LocationPicker";
import { BillTemplate } from "./BillTemplate";
import { uploadBillToCloudinary } from "./cloudinary";

// ── Config ────────────────────────────────────────────────────────────────────
// Checkout currently generates the bill and uploads it for review.

// ── Step indicator ────────────────────────────────────────────────────────────
const STEP_LABELS = [
  "Cart",
  "Delivery",
  "Your Details",
  "Location",
  "Confirm Bill",
];

function StepBar({ current }: { current: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: 32,
        overflowX: "auto",
        paddingBottom: 4,
      }}
    >
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const done = current > stepNum;
        const active = current === stepNum;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  background: done ? "#1B4332" : active ? "#5C3620" : "#E8E0D0",
                  color: done || active ? "#fff" : "#9CA3AF",
                  transition: "all 0.3s",
                  flexShrink: 0,
                }}
              >
                {done ? "✓" : stepNum}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#5C3620" : done ? "#1B4332" : "#9CA3AF",
                  marginTop: 4,
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  maxWidth: 60,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: done ? "#1B4332" : "#E8E0D0",
                  margin: "0 4px",
                  marginBottom: 18,
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Brown CTA button ──────────────────────────────────────────────────────────
function BrownButton({
  onClick,
  disabled,
  children,
  fullWidth = true,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : undefined,
        padding: "15px 24px",
        borderRadius: 999,
        background: disabled ? "#C4B5A5" : "#5C3620",
        color: "#fff",
        fontWeight: 700,
        fontSize: 16,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s, transform 0.1s",
        letterSpacing: "0.01em",
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "#7A4A2E";
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = "#5C3620";
      }}
    >
      {children}
    </button>
  );
}

// ── Back button ───────────────────────────────────────────────────────────────
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "#6B6B6B",
        fontSize: 14,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 0",
        marginBottom: 8,
      }}
    >
      ← Back
    </button>
  );
}

// ── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {children}
    </div>
  );
}

// ── Form input ───────────────────────────────────────────────────────────────
function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
  maxLength,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const sharedStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1.5px solid rgba(0,0,0,0.12)",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    background: "#FAFAF8",
    boxSizing: "border-box",
    resize: "none",
    color: "#1C1C1C",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#444" }}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          maxLength={maxLength}
          style={sharedStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#5C3620")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
          style={sharedStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#5C3620")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)")}
        />
      )}
    </div>
  );
}

// ── Main CheckoutPage ─────────────────────────────────────────────────────────

interface Props {
  cartItems: CartItem[];
  onNavigateBack: () => void;
}

export function CheckoutPage({ cartItems, onNavigateBack }: Props) {
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("porter");
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    mobile: "",
    address: "",
    pincode: "",
  });
  const [location, setLocation] = useState<OrderLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const billRef = useRef<HTMLDivElement>(null);

  // Stable invoice number for this session
  const [invoiceNo] = useState(
    `DF/${new Date().getFullYear()}/${Math.floor(Math.random() * 90000 + 10000)}`
  );
  const [invoiceDate] = useState(
    new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
  );

  const subtotal = cartItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const deliveryCharge = 0;
  const grandTotal = subtotal + deliveryCharge;

  // Validation
  function validateStep3(): string | null {
    if (!customer.name.trim()) return "Please enter your full name.";
    if (!/^[6-9]\d{9}$/.test(customer.mobile.trim())) return "Please enter a valid 10-digit Indian mobile number.";
    if (!customer.address.trim()) return "Please enter your delivery address.";
    if (!/^\d{6}$/.test(customer.pincode.trim())) return "Please enter a valid 6-digit pincode.";
    return null;
  }

  const handleLocationSet = useCallback((loc: OrderLocation) => {
    setLocation(loc);
  }, []);

  async function handlePlaceOrder() {
    if (!billRef.current || !location) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Stage 1: capture bill image
      setSubmitStage("Generating bill image…");
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#FFFBF2",
        logging: false,
      });

      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas toBlob returned null"));
        }, "image/png");
      });

      // Stage 2: upload to Cloudinary
      setSubmitStage("Uploading bill to Cloudinary…");
      const billUrl = await uploadBillToCloudinary(blob);

      // Stage 3: finalize order
      setSubmitStage("Finalizing order…");
      const itemsText = cartItems
        .map(
          (i) =>
            `• ${i.name} (${i.weight} × ${i.qty}) — ₹${(i.unitPrice * i.qty).toFixed(2)}`
        )
        .join("\n");

      const porterNote =
        deliveryMethod === "porter"
          ? "\n⚠️ *Porter selected* — Customer pays Porter charges directly (NOT included in bill)."
          : "";

      const message = `🧾 *New Order — ${invoiceNo}*

*Customer:* ${customer.name}
*Mobile:* ${customer.mobile}
*Address:* ${customer.address}, ${customer.pincode}
*Delivery:* Porter${porterNote}
*Location:* ${location.mapsLink}

*Items:*
${itemsText}

*Subtotal:* ₹${subtotal.toFixed(2)}
*Delivery:* ₹0 (Porter)
*Grand Total:* ₹${grandTotal.toFixed(2)}

📄 *Bill:* ${billUrl}`;

      console.log(message);
      // TODO: submit the bill data to a backend or customer service workflow.
      setSubmitStage("Order submitted successfully.");
      setStep(6);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
      setSubmitStage("");
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main
      style={{
        background: "#FBF9F0",
        minHeight: "100vh",
        paddingTop: 32,
        paddingBottom: 80,
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
        {/* Header */}
        {step < 6 && (
          <div style={{ marginBottom: 8 }}>
            <button
              onClick={step === 1 ? onNavigateBack : () => setStep((s) => s - 1)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#6B6B6B",
                fontSize: 14,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 0",
                marginBottom: 16,
              }}
            >
              ← {step === 1 ? "Back to Shop" : "Back"}
            </button>
            {step < 6 && <StepBar current={step} />}
          </div>
        )}

        {/* ── STEP 1: Cart Summary ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8BC34A", marginBottom: 4 }}>
                Step 1 of 5
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#1C1C1C",
                  margin: 0,
                }}
              >
                Your Order Summary
              </h2>
            </div>

            {cartItems.length === 0 ? (
              <Card>
                <div style={{ textAlign: "center", padding: "32px 0", color: "#9CA3AF" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                  <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Your cart is empty</p>
                  <p style={{ fontSize: 13 }}>Add some products from the shop to get started.</p>
                  <button
                    onClick={onNavigateBack}
                    style={{
                      marginTop: 16,
                      padding: "10px 24px",
                      borderRadius: 999,
                      background: "#1B4332",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 14,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Browse Products
                  </button>
                </div>
              </Card>
            ) : (
              <>
                <Card>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {/* Column headers */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto auto auto",
                        gap: 12,
                        padding: "8px 0 10px",
                        borderBottom: "2px solid #E8E0D0",
                        marginBottom: 8,
                      }}
                    >
                      {["Item", "Qty", "Unit Price", "Total"].map((h) => (
                        <span key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: h !== "Item" ? "right" : "left" }}>
                          {h}
                        </span>
                      ))}
                    </div>

                    {cartItems.map((item, idx) => (
                      <div
                        key={item.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto auto auto",
                          gap: 12,
                          padding: "12px 0",
                          borderBottom: idx < cartItems.length - 1 ? "1px solid #F0EBE0" : "none",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 15, color: "#1C1C1C", margin: 0 }}>{item.name}</p>
                          <p style={{ fontSize: 12, color: "#9CA3AF", margin: "2px 0 0" }}>{item.weight}</p>
                        </div>
                        <span style={{ fontSize: 14, color: "#444", textAlign: "right", fontWeight: 600 }}>×{item.qty}</span>
                        <span style={{ fontSize: 14, color: "#6B6B6B", textAlign: "right" }}>₹{item.unitPrice.toFixed(2)}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#3E2410", textAlign: "right" }}>
                          ₹{(item.unitPrice * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    {/* Subtotal row */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: "2px solid #E8E0D0",
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 16, color: "#1C1C1C" }}>Subtotal</span>
                      <span style={{ fontWeight: 700, fontSize: 18, color: "#3E2410" }}>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#9CA3AF", margin: "4px 0 0" }}>
                      Delivery charge will be calculated in the next step.
                    </p>
                  </div>
                </Card>

                <BrownButton onClick={() => setStep(2)}>
                  Proceed to Order →
                </BrownButton>
              </>
            )}
          </div>
        )}

        {/* ── STEP 2: Delivery Method ── */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <DeliveryMethodStep value={deliveryMethod} onChange={setDeliveryMethod} />
            <BrownButton onClick={() => setStep(3)}>Continue →</BrownButton>
          </div>
        )}

        {/* ── STEP 3: Customer Details ── */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8BC34A", marginBottom: 4 }}>
                Step 3 of 5
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1C1C1C", margin: 0 }}>
                Your Details
              </h2>
              <p style={{ fontSize: 13, color: "#6B6B6B", margin: "6px 0 0" }}>
                These details will appear on your bill and be sent to Divekar Foods.
              </p>
            </div>
            <Card>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <FormInput
                  label="Full Name *"
                  value={customer.name}
                  onChange={(v) => setCustomer({ ...customer, name: v })}
                  placeholder="e.g. Priya Joshi"
                />
                <FormInput
                  label="Mobile Number *"
                  value={customer.mobile}
                  onChange={(v) => setCustomer({ ...customer, mobile: v.replace(/\D/g, "").slice(0, 10) })}
                  placeholder="10-digit mobile number"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                />
                <FormInput
                  label="Delivery Address *"
                  value={customer.address}
                  onChange={(v) => setCustomer({ ...customer, address: v })}
                  placeholder="Flat no., building, street, area, city"
                  multiline
                />
                <FormInput
                  label="Pincode *"
                  value={customer.pincode}
                  onChange={(v) => setCustomer({ ...customer, pincode: v.replace(/\D/g, "").slice(0, 6) })}
                  placeholder="6-digit pincode"
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                />
              </div>
            </Card>
            <BrownButton
              onClick={() => {
                const err = validateStep3();
                if (err) { alert(err); return; }
                setStep(4);
              }}
            >
              Continue →
            </BrownButton>
          </div>
        )}

        {/* ── STEP 4: Location Picker ── */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <LocationPicker onLocationSet={handleLocationSet} initialLocation={location} />
            <BrownButton
              onClick={() => {
                if (!location) { alert("Please pin your delivery location on the map first."); return; }
                setStep(5);
              }}
              disabled={!location}
            >
              Continue →
            </BrownButton>
          </div>
        )}

        {/* ── STEP 5: Bill Preview + Confirm ── */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8BC34A", marginBottom: 4 }}>
                Step 5 of 5
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#1C1C1C", margin: 0 }}>
                Confirm & Send Order
              </h2>
              <p style={{ fontSize: 13, color: "#6B6B6B", margin: "6px 0 0" }}>
                Review your bill below, then tap the confirm button to complete your order.
              </p>
            </div>

            {/* Order summary card */}
            <Card>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#6B6B6B" }}>Customer</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{customer.name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#6B6B6B" }}>Mobile</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{customer.mobile}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#6B6B6B" }}>Delivery</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: deliveryMethod === "porter" ? "#D97706" : "#1B4332" }}>
                    {"🚴 Porter (no charge)"}
                  </span>
                </div>
                {location && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#6B6B6B" }}>Location</span>
                    <a href={location.mapsLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#1B4332", fontWeight: 600 }}>
                      📍 View on Maps
                    </a>
                  </div>
                )}
                <div style={{ height: 1, background: "#E8E0D0", margin: "6px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, color: "#6B6B6B" }}>Subtotal</span>
                  <span style={{ fontSize: 14 }}>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, color: "#6B6B6B" }}>Delivery</span>
                  <span style={{ fontSize: 14, color: "#D97706" }}>
                    ₹0 (Porter)
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "2px solid #E8E0D0" }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#3E2410" }}>Grand Total</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#3E2410" }}>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {submitError && (
              <div
                style={{
                  background: "#FEE2E2",
                  border: "1px solid #FCA5A5",
                  borderRadius: 12,
                  padding: "12px 16px",
                  fontSize: 13,
                  color: "#991B1B",
                }}
              >
                ❌ {submitError}
              </div>
            )}

            <button
              disabled={submitting}
              onClick={handlePlaceOrder}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 999,
                background: submitting ? "#6B6B6B" : "#1B4332",
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "background 0.2s",
              }}
            >
              {submitting ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
                  {submitStage || "Processing…"}
                </>
              ) : (
                <>Confirm Order</>
              )}
            </button>

            <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", margin: 0 }}>
              This will generate your bill and upload it for our team to review.
            </p>
          </div>
        )}

        {/* ── STEP 6: Success ── */}
        {step === 6 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              paddingTop: 60,
              paddingBottom: 60,
              gap: 16,
            }}
          >
            <div style={{ fontSize: 72 }}>✅</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 30,
                fontWeight: 700,
                color: "#1B4332",
                margin: 0,
              }}
            >
              Order Sent!
            </h2>
            <p style={{ fontSize: 15, color: "#6B6B6B", maxWidth: 400, lineHeight: 1.6 }}>
              Your bill and order details have been submitted. We'll confirm your order within 24 hours.
            </p>
            <div
              style={{
                background: "#F0F7F1",
                border: "1px solid #1B4332",
                borderRadius: 12,
                padding: "14px 20px",
                fontSize: 13,
                color: "#1B4332",
                maxWidth: 360,
              }}
            >
              🕐 All orders are <strong>made fresh to order</strong>. Expect a 2–3 day preparation
              time before delivery.
            </div>
            <button
              onClick={onNavigateBack}
              style={{
                marginTop: 8,
                padding: "12px 32px",
                borderRadius: 999,
                background: "#1B4332",
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* ── Off-screen Bill for html2canvas capture ─────────────────────────── */}
      {/* Positioned off-screen but still rendered (not display:none) so html2canvas can capture it */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        <BillTemplate
          ref={billRef}
          items={cartItems}
          customer={customer}
          deliveryMethod={deliveryMethod}
          invoiceNo={invoiceNo}
          date={invoiceDate}
        />
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}
