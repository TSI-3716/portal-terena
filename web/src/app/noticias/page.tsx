import type { Metadata } from "next";
import { FilterBar, FilterSelect } from "@/components/filter-bar";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelectOption } from "@/components/ui/native-select";

export const metadata: Metadata = { title: "Notícias" };

export default function NoticiasPage() {
  return (
    <>
      <Hero
        eyebrow="Informação e comunidade"
        title="Notícias"
        description="Acompanhe as notícias do povo Terena, informações, cultura e acontecimentos das aldeias e de Mato Grosso do Sul."
      />
      <PageSection>
        <SectionHeader title="Últimas notícias em destaque" />
        <div className="grid gap-4 md:grid-cols-2">
          <SiteCard
            search="kopenoti festa cultura"
            meta="Cultura • 20 de maio de 2024"
            title="Festa do Kopenoti reúne aldeias Terena"
            description="Evento marca o início do novo ciclo e fortalece os laços entre as comunidades."
            hrefLabel="Ler notícia"
          />
          <SiteCard
            search="nascente meio ambiente projeto"
            meta="Meio ambiente • 18 de maio de 2024"
            title="Projeto de proteção de nascentes avança nas aldeias"
            description="Iniciativa preserva recursos hídricos e promove educação ambiental entre os jovens."
            hrefLabel="Ler notícia"
          />
        </div>
      </PageSection>
      <PageSection muted>
        <FilterBar>
          <FilterSelect label="Aldeia">
            <NativeSelectOption>Todas as aldeias</NativeSelectOption>
          </FilterSelect>
          <FilterSelect label="Município">
            <NativeSelectOption>Todos os municípios</NativeSelectOption>
          </FilterSelect>
          <FilterSelect label="Ordenar">
            <NativeSelectOption>Mais recentes</NativeSelectOption>
          </FilterSelect>
          <Field>
            <FieldLabel htmlFor="buscar-noticia">Buscar notícia</FieldLabel>
            <Input id="buscar-noticia" placeholder="Palavra-chave" />
          </Field>
        </FilterBar>
        <div className="grid gap-4 md:grid-cols-3">
          <SiteCard
            search="jovens comunicação mídias digitais"
            meta="Juventude • 17 de maio de 2024"
            title="Jovens Terena participam de oficina"
            description="Atividade fortalece a comunicação comunitária e valoriza as vozes da juventude."
            hrefLabel="Ler notícia"
          />
          <SiteCard
            search="artesanato feira"
            meta="Artesanato • 15 de maio de 2024"
            title="Artesãs Terena expõem trabalhos na feira"
            description="Peças de cerâmica, bijuterias e cestaria encantam o público."
            hrefLabel="Ler notícia"
          />
          <SiteCard
            search="escola educação natureza"
            meta="Educação • 14 de maio de 2024"
            title="Escola da Aldeia desenvolve horta escolar"
            description="Projeto integra alimentação saudável e cuidados com a natureza."
            hrefLabel="Ler notícia"
          />
        </div>
      </PageSection>
    </>
  );
}
