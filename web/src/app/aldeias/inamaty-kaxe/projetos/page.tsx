import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Projetos | Inamaty Kaxé" };

export default function InamatyProjetosPage() {
  return (
    <PlaceholderPage
      title="Projetos da Aldeia"
      description="Iniciativas desenvolvidas na Inamaty Kaxé."
    />
  );
}
