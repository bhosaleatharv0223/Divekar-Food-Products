import { forwardRef } from "react";
import type { CartItem, CustomerDetails, DeliveryMethod } from "./types";
import imgLogo from "@/imports/ChatGPT_Image_Jul_4__2026__04_42_01_PM.png";

interface Props {
  items: CartItem[];
  customer: CustomerDetails;
  deliveryMethod: DeliveryMethod;
  invoiceNo: string;
  date: string;
}

export const BillTemplate = forwardRef<HTMLDivElement, Props>(
  ({ items, customer, deliveryMethod, invoiceNo, date }, ref) => {
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
    const deliveryCharge = 0;
    const grandTotal = subtotal + deliveryCharge;

    const cell = (content: React.ReactNode, style?: React.CSSProperties) => (
      <td
        style={{
          padding: "9px 12px",
          fontSize: 13,
          borderBottom: "1px solid #E8E0D0",
          ...style,
        }}
      >
        {content}
      </td>
    );

    return (
      <div
        ref={ref}
        id="divekar-bill-template"
        style={{
          width: 720,
          background: "#FFFBF2",
          padding: "36px 40px",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#2A1A0F",
          boxSizing: "border-box",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            borderBottom: "3px solid #3E2410",
            paddingBottom: 20,
            marginBottom: 20,
          }}
        >
          <img
            src={imgLogo}
            alt="Divekar Foods"
            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            crossOrigin="anonymous"
          />
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 700,
                color: "#3E2410",
                fontFamily: "Georgia, serif",
              }}
            >
              Divekar Foods
            </h1>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#7B5E00", fontStyle: "italic" }}>
              Homely Food Is Good Food — &quot;Excellent Taste In Every Bite&quot;
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#6B6B6B" }}>
              Magarpatta City, Pune, Maharashtra &nbsp;|&nbsp; +91 95797 02008 &nbsp;|&nbsp; FSSAI: 21522048000259
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                background: "#3E2410",
                color: "#fff",
                padding: "6px 16px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              TAX INVOICE / BILL
            </div>
          </div>
        </div>

        {/* ── Invoice Meta + Bill To ── */}
        <div style={{ display: "flex", gap: 40, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: "#6B6B6B", margin: "0 0 8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Invoice Details
            </p>
            <table style={{ fontSize: 13, borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ paddingRight: 12, color: "#6B6B6B", paddingBottom: 4 }}>Invoice No.</td>
                  <td style={{ fontWeight: 700, paddingBottom: 4 }}>{invoiceNo}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 12, color: "#6B6B6B", paddingBottom: 4 }}>Date</td>
                  <td style={{ paddingBottom: 4 }}>{date}</td>
                </tr>
                <tr>
                  <td style={{ paddingRight: 12, color: "#6B6B6B" }}>Delivery</td>
                  <td style={{ fontWeight: 600, color: "#D97706" }}>
                    Porter
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: "#6B6B6B", margin: "0 0 8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Bill To / Delivery Details
            </p>
            <p style={{ fontSize: 13, margin: "0 0 3px", fontWeight: 700 }}>{customer.name}</p>
            <p style={{ fontSize: 13, margin: "0 0 3px", color: "#444" }}>📞 {customer.mobile}</p>
            <p style={{ fontSize: 13, margin: "0 0 3px", color: "#444" }}>
              📍 {customer.address}
            </p>
            <p style={{ fontSize: 13, color: "#444" }}>Pincode: {customer.pincode}</p>
          </div>
        </div>

        {/* ── Product Table ── */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 0,
          }}
        >
          <thead>
            <tr style={{ background: "#3E2410", color: "#fff" }}>
              <th style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, textAlign: "center", width: 36 }}>#</th>
              <th style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, textAlign: "left" }}>Product Name</th>
              <th style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, textAlign: "center" }}>Quantity</th>
              <th style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, textAlign: "right" }}>Unit Price</th>
              <th style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, textAlign: "right" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                style={{ background: idx % 2 === 0 ? "#FFFBF2" : "#FFF7E6" }}
              >
                {cell(idx + 1, { textAlign: "center", color: "#6B6B6B" })}
                {cell(
                  <span style={{ fontWeight: 600 }}>{item.name}</span>
                )}
                {cell(
                  <span style={{ color: "#444" }}>
                    {item.weight} × {item.qty}
                  </span>,
                  { textAlign: "center" }
                )}
                {cell(`₹${item.unitPrice.toFixed(2)}`, { textAlign: "right", color: "#444" })}
                {cell(
                  <strong style={{ color: "#3E2410" }}>₹{(item.unitPrice * item.qty).toFixed(2)}</strong>,
                  { textAlign: "right" }
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Totals ── */}
        <div
          style={{
            borderTop: "2px solid #3E2410",
            marginTop: 0,
            paddingTop: 16,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <table style={{ fontSize: 13, borderCollapse: "collapse", minWidth: 260 }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 12px", color: "#6B6B6B" }}>Subtotal</td>
                <td style={{ padding: "4px 12px", textAlign: "right" }}>₹{subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{ padding: "4px 12px", color: "#6B6B6B" }}>Delivery Charges</td>
                <td style={{ padding: "4px 12px", textAlign: "right", color: "#D97706" }}>
                  ₹0 (Porter — paid directly)
                </td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  style={{
                    padding: "0 12px 8px",
                    borderBottom: "1px solid #E8E0D0",
                  }}
                />
              </tr>
              <tr>
                <td style={{ padding: "10px 12px 4px", fontWeight: 700, fontSize: 15, color: "#3E2410" }}>
                  Grand Total
                </td>
                <td style={{ padding: "10px 12px 4px", textAlign: "right", fontWeight: 700, fontSize: 18, color: "#3E2410" }}>
                  ₹{grandTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Porter notice on bill */}
        {deliveryMethod === "porter" && (
          <div
            style={{
              marginTop: 16,
              background: "#FFFBEB",
              border: "1px solid #F59E0B",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 12,
              color: "#92400E",
            }}
          >
            ⚠️ <strong>Note:</strong> Porter charges are not included in this bill. The customer must pay Porter
            charges directly to the Porter delivery partner at the time of pickup/delivery.
          </div>
        )}

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 16,
            borderTop: "1px solid #E8E0D0",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 13, color: "#3E2410", fontWeight: 600, margin: 0 }}>
            Thank you for choosing Divekar Foods! 🙏
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", margin: "4px 0 0" }}>
            Homemade with Love, Delivered with Care &nbsp;·&nbsp; FSSAI Lic. No. 21522048000259
          </p>
        </div>
      </div>
    );
  }
);

BillTemplate.displayName = "BillTemplate";
