import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = {
  title: "Cultura e Tradições | Inamaty Kaxé",
};

export default function InamatyCulturaPage() {
  return (
    <PlaceholderPage
      title="Cultura e Tradições"
      description="Língua, dança, saberes e memória da Inamaty Kaxé."
    />
  );
}
