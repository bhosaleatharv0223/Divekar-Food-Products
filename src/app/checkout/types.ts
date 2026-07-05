export interface CartItem {
  id: string;
  name: string;
  weight: string;   // e.g. "500g", "1 kg"
  unitPrice: number; // price for this specific weight
  qty: number;
}

export interface CustomerDetails {
  name: string;
  mobile: string;
  address: string;
  pincode: string;
}

export type DeliveryMethod = "porter";

export interface OrderLocation {
  lat: number;
  lng: number;
  mapsLink: string;
}
