import type { Metadata } from "next";
import { ConteudoPublico, tituloConteudo } from "@/components/conteudo-publico";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: await tituloConteudo(id) };
}

export default async function ConteudoJuventudePage({ params }: Props) {
  const { id } = await params;
  return <ConteudoPublico slug="juventude" rawId={id} />;
}
