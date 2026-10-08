import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Localização | Inamaty Kaxé" };

export default function InamatyLocalizacaoPage() {
  return (
    <PlaceholderPage
      title="Localização"
      description="Onde fica a Aldeia Inamaty Kaxé."
    />
  );
}
