import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Juventude | Inamaty Kaxé" };

export default function InamatyJuventudePage() {
  return (
    <PlaceholderPage
      title="Juventude"
      description="Protagonismo das novas gerações na Inamaty Kaxé."
    />
  );
}
