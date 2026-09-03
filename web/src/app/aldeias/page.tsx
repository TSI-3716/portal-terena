import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { SiteCard } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { VillageMap } from "@/components/village-map";
import { Field, FieldLabel } from "@/components/ui/field";

export const metadata: Metadata = { title: "Nossas Aldeias" };

export default function AldeiasPage() {
  return (
    <>
      <Hero
        eyebrow="Território e comunidade"
        title="Nossas Aldeias"
        description="O povo Terena vive em diferentes aldeias localizadas em Mato Grosso do Sul. Conheça onde estamos."
      />
      <PageSection>
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <VillageMap
            places={["Aquidauana", "Miranda", "Nioaque", "Campo Grande"]}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Filtre no mapa</CardTitle>
              <CardDescription>
                Explore as localidades e encontre informações sobre as aldeias.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Município</FieldLabel>
                <NativeSelect className="w-full">
                  <NativeSelectOption>Todos os municípios</NativeSelectOption>
                  <NativeSelectOption>Aquidauana</NativeSelectOption>
                  <NativeSelectOption>Miranda</NativeSelectOption>
                  <NativeSelectOption>Nioaque</NativeSelectOption>
                  <NativeSelectOption>Sidrolândia</NativeSelectOption>
                </NativeSelect>
              </Field>
              <p className="rounded-lg border bg-accent px-4 py-3 text-sm font-medium text-primary">
                + de 30 aldeias espalhadas pelo estado de Mato Grosso do Sul.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>
      <PageSection muted>
        <SectionHeader title="Destaques das Aldeias" />
        <div className="grid gap-4 md:grid-cols-3">
          <SiteCard
            search="bananal sidrolandia"
            meta="Sidrolândia - MS"
            title="Aldeia Bananal"
            description="Tradição cultural, atividades comunitárias e valorização das tradições ancestrais."
            hrefLabel="Ver detalhes"
          />
          <SiteCard
            search="buriti aquidauana"
            meta="Aquidauana - MS"
            title="Aldeia Buriti"
            description="Conhecida pela produção de artesanato e preservação da língua e costumes Terena."
            hrefLabel="Ver detalhes"
          />
          <SiteCard
            search="lagoinha nioaque"
            meta="Nioaque - MS"
            title="Aldeia Lagoinha"
            description="Aldeia com forte ligação com a natureza e celebrações culturais."
            hrefLabel="Ver detalhes"
          />
        </div>
      </PageSection>
      <PageSection className="bg-secondary">
        <SectionHeader
          title="Aldeia Inamaty Kaxé"
          description="Conheça a área dedicada à história, cultura, juventude, projetos, eventos, localização, galeria e contato da aldeia."
          action={
            <Button asChild>
              <Link href="/aldeias/inamaty-kaxe">Conhecer Inamaty Kaxé</Link>
            </Button>
          }
        />
        <Card className="pt-0">
          <MediaPlaceholder className="h-52" />
          <CardHeader>
            <CardTitle className="text-primary">
              Portal da Aldeia Inamaty Kaxé
            </CardTitle>
            <CardDescription>
              Seção interna do Portal Terena, com as telas da aldeia.
            </CardDescription>
          </CardHeader>
        </Card>
      </PageSection>
    </>
  );
}
