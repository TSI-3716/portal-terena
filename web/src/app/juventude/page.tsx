import type { Metadata } from "next";
import { BuscaForm } from "@/components/busca-form";
import { ConteudoCard, escolherDestaques } from "@/components/conteudo-card";
import { Hero } from "@/components/hero";
import { Listagem, Vazio } from "@/components/listagem";
import { CardGrid } from "@/components/site-card";
import { getSecao, listConteudos, tiposDaSecao } from "@/lib/conteudo";
import { staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Juventude Terena" };

export default async function JuventudePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const busca = q.trim();
  const secao = await getSecao("juventude");
  const conteudos = secao ? await listConteudos({ tipos: tiposDaSecao(secao), busca }) : [];
  const destaques = busca ? [] : escolherDestaques(conteudos, 3);

  return (
    <>
      <Hero
        eyebrow="Protagonismo • aprendizado • participação"
        title="Juventude Terena"
        description="A força que mantém nossa cultura viva e constrói o futuro do nosso povo."
        imageSrc={staticImage("juventude_hero")}
      />
      <Listagem
        destaquesTitulo="Destaques da Juventude"
        destaques={
          secao && destaques.length > 0 ? (
            <CardGrid>
              {destaques.map((item) => (
                <ConteudoCard key={item.id_conteudo} conteudo={item} secao={secao} slug="juventude" />
              ))}
            </CardGrid>
          ) : undefined
        }
        titulo={busca ? `Resultados para “${busca}”` : "Todas as publicações"}
        busca={<BuscaForm action="/juventude" q={busca} label="Buscar na Juventude" />}
      >
        {secao && conteudos.length > 0 ? (
          <CardGrid>
            {conteudos.map((item) => (
              <ConteudoCard key={item.id_conteudo} conteudo={item} secao={secao} slug="juventude" />
            ))}
          </CardGrid>
        ) : (
          <Vazio>
            {busca
              ? "Nenhuma publicação encontrada. Tente outra palavra-chave."
              : "Ainda não há publicações da Juventude. Volte em breve."}
          </Vazio>
        )}
      </Listagem>
    </>
  );
}
