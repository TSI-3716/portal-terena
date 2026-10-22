"use client"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { randomBytes } from "crypto";
import { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function VillageMap({
  places,
  className,
}: {
  places: string[];
  className?: string;
}) {
  const position: LatLngExpression = [51.505, -0.09]

  return (
    <MapContainer className={cn(
      "min-h-[320px] rounded-xl border",
      className
    )} center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}