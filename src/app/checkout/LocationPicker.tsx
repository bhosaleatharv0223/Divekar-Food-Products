import { useState, useCallback, useEffect } from "react";
import type { OrderLocation } from "./types";

// Fix Leaflet default marker icon broken in Webpack/Vite bundles
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Patch Leaflet default icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Dynamic import of react-leaflet to avoid SSR issues in Vite
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";

const DEFAULT_CENTER: [number, number] = [18.5204, 73.8567]; // Pune, Maharashtra

function buildMapsLink(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/** Invisible component — re-centers map when position changes */
function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
}

/** Listens for map clicks and fires callback */
function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface Props {
  onLocationSet: (location: OrderLocation) => void;
  initialLocation?: OrderLocation | null;
}

export function LocationPicker({ onLocationSet, initialLocation }: Props) {
  const [position, setPosition] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : DEFAULT_CENTER
  );
  const [loadingGPS, setLoadingGPS] = useState(false);
  const [mapsLink, setMapsLink] = useState<string | null>(initialLocation?.mapsLink ?? null);
  const [locationSet, setLocationSet] = useState(!!initialLocation);

  const applyPosition = useCallback(
    (lat: number, lng: number) => {
      const pos: [number, number] = [lat, lng];
      setPosition(pos);
      const link = buildMapsLink(lat, lng);
      setMapsLink(link);
      setLocationSet(true);
      onLocationSet({ lat, lng, mapsLink: link });
    },
    [onLocationSet]
  );

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported on this browser.");
      return;
    }
    setLoadingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyPosition(pos.coords.latitude, pos.coords.longitude);
        setLoadingGPS(false);
      },
      () => {
        alert("Could not fetch your location. Please tap the map to pin your delivery address.");
        setLoadingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

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
          Step 4 of 5
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
          Set Delivery Location
        </h2>
        <p style={{ fontSize: 13, color: "#6B6B6B", margin: "6px 0 0" }}>
          Use the button to detect your location, or tap anywhere on the map to place your pin.
        </p>
      </div>

      <button
        type="button"
        onClick={useCurrentLocation}
        disabled={loadingGPS}
        style={{
          alignSelf: "flex-start",
          padding: "10px 22px",
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 600,
          color: "#fff",
          backgroundColor: loadingGPS ? "#6B6B6B" : "#1B4332",
          border: "none",
          cursor: loadingGPS ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          transition: "background 0.2s",
        }}
      >
        📍 {loadingGPS ? "Locating…" : "Use My Current Location"}
      </button>

      {/* Map container */}
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          height: 340,
          border: "2px solid rgba(27,67,50,0.15)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <MapContainer
          center={position}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={position}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const marker = event.target;
                const latLng = marker.getLatLng();
                applyPosition(latLng.lat, latLng.lng);
              },
            }}
          />
          <MapUpdater position={position} />
          <ClickHandler onPick={applyPosition} />
        </MapContainer>
      </div>

      <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
        Tap anywhere on the map to fine-tune the exact delivery pin.
      </p>

      {locationSet && mapsLink && (
        <div
          style={{
            background: "#F0F7F1",
            border: "1.5px solid #1B4332",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: "#1B4332", margin: 0 }}>
            ✅ Location pinned!
          </p>
          <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>
            Coordinates: {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1B4332",
              textDecoration: "underline",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            🔗 View & confirm this location on Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
