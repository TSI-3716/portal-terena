import type { Metadata } from "next";
import { ConteudoPublico, tituloConteudo } from "@/components/conteudo-publico";

type Props = { params: Promise<{ categoria: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: await tituloConteudo(id) };
}

export default async function ConteudoCulturaPage({ params }: Props) {
  const { categoria, id } = await params;
  return <ConteudoPublico slug="cultura" rawId={id} categoria={categoria} />;
}
