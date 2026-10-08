import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Notícias | Inamaty Kaxé" };

export default function InamatyNoticiasPage() {
  return (
    <PlaceholderPage
      title="Notícias da Aldeia"
      description="Acompanhe as novidades da Inamaty Kaxé."
    />
  );
}
