import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UrlFilter } from "@/components/url-filter";
import { VillageMap } from "@/components/village-map";
import {
  aldeiaHref,
  listAldeias,
  listLocalizacoes,
  municipio,
} from "@/lib/conteudo";
import { staticImage } from "@/lib/images";
import { resolveImageUrl } from "@/lib/storage";

export const metadata: Metadata = { title: "Nossas Aldeias" };

export default async function AldeiasPage({
  searchParams,
}: {
  searchParams: Promise<{ local?: string }>;
}) {
  const { local } = await searchParams;
  const localizacoes = await listLocalizacoes();
  const filtro = local && localizacoes.includes(local) ? local : undefined;
  const aldeias = await listAldeias(filtro);

  return (
    <>
      <Hero
        eyebrow="Território e comunidade"
        title="Nossas Aldeias"
        description="O povo Terena vive em diferentes aldeias localizadas em Mato Grosso do Sul. Conheça onde estamos."
        imageSrc={staticImage("aldeias_hero")}
      />
      <PageSection>
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <VillageMap
            places={(filtro ? [filtro] : localizacoes).map(municipio)}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Filtre no mapa</CardTitle>
              <CardDescription>
                Explore as localidades e encontre informações sobre as aldeias.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <UrlFilter
                label="Município"
                param="local"
                value={filtro}
                allLabel="Todos os municípios"
                options={localizacoes.map((value) => ({ value, label: municipio(value) }))}
              />
              <p className="rounded-xl border bg-accent px-5 py-5 text-sm font-bold text-primary">
                + de 30 aldeias espalhadas pelo estado de Mato Grosso do Sul.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>
      <PageSection muted>
        <SectionHeader
          title={filtro ? `Aldeias em ${municipio(filtro)}` : "Destaques das Aldeias"}
        />
        {aldeias.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma aldeia cadastrada{filtro ? " neste município" : ""}.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {aldeias.map((aldeia) => (
              <SiteCard
                key={aldeia.id_aldeia}
                search={`${aldeia.nome} ${aldeia.localizacao ?? ""}`}
                meta={aldeia.localizacao ?? undefined}
                title={aldeia.nome}
                description={aldeia.descricao ?? ""}
                href={aldeiaHref(aldeia)}
                hrefLabel="Ver detalhes"
                imageSrc={resolveImageUrl(aldeia.imagem)}
                imageAlt={aldeia.nome}
              />
            ))}
          </div>
        )}
      </PageSection>
    </>
  );
}
