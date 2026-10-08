import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Eventos | Inamaty Kaxé" };

export default function InamatyEventosPage() {
  return (
    <PlaceholderPage
      title="Eventos"
      description="Celebrações e encontros da Inamaty Kaxé."
    />
  );
}
