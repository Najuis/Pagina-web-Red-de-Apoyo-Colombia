"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { MapLocation } from "@prisma/client";
import { siteConfig } from "@/lib/site.config";
import { LOCATION_TYPE_LABELS } from "@/types";

const COLORS: Record<string, string> = {
  CENTRO_ACOPIO: "#1E3A8A",
  ALBERGUE: "#F59E0B",
  CENTRO_SALUD: "#10B981",
  PUNTO_ENCUENTRO: "#6366F1",
  PUNTO_INFORMACION: "#EF4444",
  OTRO: "#6B7280",
};

function makePin(color: string) {
  return L.divIcon({
    className: "leaflet-div-icon",
    html: `<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))"><path d="M14 0C6.27 0 0 6.27 0 14c0 9.8 14 26 14 26s14-16.2 14-26C28 6.27 21.73 0 14 0z" fill="${color}"/><circle cx="14" cy="14" r="5.5" fill="white"/></svg>`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -34],
  });
}

export function CommunityMap({
  locations,
  heightClass = "h-[420px]",
}: {
  locations: Pick<
    MapLocation,
    "id" | "name" | "type" | "latitude" | "longitude" | "address" | "hours" | "phone" | "description"
  >[];
  heightClass?: string;
}) {
  return (
    <div className={`w-full ${heightClass}`}>
      <MapContainer
        center={[siteConfig.map.center.lat, siteConfig.map.center.lng]}
        zoom={siteConfig.map.zoom}
        scrollWheelZoom={false}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution={siteConfig.map.attribution}
          url={siteConfig.map.tileUrl}
        />
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={makePin(COLORS[loc.type] ?? COLORS.OTRO)}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{loc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {LOCATION_TYPE_LABELS[loc.type as keyof typeof LOCATION_TYPE_LABELS] ?? loc.type}
                </p>
                {loc.address && <p className="mt-1 text-xs">{loc.address}</p>}
                {loc.hours && <p className="mt-1 text-xs">{loc.hours}</p>}
                {loc.phone && <p className="mt-1 text-xs">{loc.phone}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
