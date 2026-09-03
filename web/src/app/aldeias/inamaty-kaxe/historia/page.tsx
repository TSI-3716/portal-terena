import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "História | Inamaty Kaxé" };

export default function InamatyHistoriaPage() {
  return (
    <PlaceholderPage
      title="História"
      description="Memória e trajetória da Inamaty Kaxé."
    />
  );
}
