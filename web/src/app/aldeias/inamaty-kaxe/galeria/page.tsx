import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Galeria | Inamaty Kaxé" };

export default function InamatyGaleriaPage() {
  return (
    <PlaceholderPage
      title="Galeria"
      description="Imagens da vida comunitária na Inamaty Kaxé."
    />
  );
}
