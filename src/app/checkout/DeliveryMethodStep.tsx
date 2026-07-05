import type { DeliveryMethod } from "./types";

interface Props {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
}

export function DeliveryMethodStep({ value, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#8BC34A",
            marginBottom: 4,
          }}
        >
          Step 2 of 5
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
          Choose Delivery Method
        </h2>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          background: value === "porter" ? "#FFF8EE" : "#fff",
          border: `2px solid ${value === "porter" ? "#D97706" : "rgba(0,0,0,0.1)"}`,
          borderRadius: 16,
          padding: "18px 20px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <input
          type="radio"
          name="delivery"
          checked={value === "porter"}
          onChange={() => onChange("porter")}
          style={{ marginTop: 3, accentColor: "#D97706", width: 18, height: 18, flexShrink: 0 }}
        />
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: "#1C1C1C", margin: 0 }}>
            🚴 Porter (Self-Arranged Courier)
          </p>
          <p style={{ fontSize: 13, color: "#6B6B6B", margin: "4px 0 0" }}>
            We hand your order to a Porter courier. No delivery charge is added to your bill.
          </p>
        </div>
      </label>

      {value === "porter" && (
        <div
          style={{
            background: "#FFFBEB",
            border: "1.5px solid #F59E0B",
            borderRadius: 12,
            padding: "14px 18px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: 13, color: "#92400E", margin: 0, lineHeight: 1.6 }}>
            <strong>Important Porter Notice:</strong> Porter charges are not included in this
            bill. The customer must pay Porter charges directly to the Porter delivery partner
            at the time of pickup/delivery.
          </p>
        </div>
      )}
    </div>
  );
}
