import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Artesanato | Inamaty Kaxé" };

export default function InamatyArtesanatoPage() {
  return (
    <PlaceholderPage
      title="Produção & Artesanato"
      description="Peças, saberes e trabalho artesanal da comunidade."
    />
  );
}
