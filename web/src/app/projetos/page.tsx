import type { Metadata } from "next";
import { CircleCheck, Folder, LayoutGrid, Sprout } from "lucide-react";
import { FilterBar, FilterSelect } from "@/components/filter-bar";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { PageSection } from "@/components/site-layout";
import { Tile } from "@/components/tile";
import { NativeSelectOption } from "@/components/ui/native-select";

export const metadata: Metadata = { title: "Projetos Terena" };

export default function ProjetosPage() {
  return (
    <>
      <Hero
        eyebrow="Iniciativas que transformam"
        title="Projetos Terena"
        description="Conheça iniciativas que fortalecem nossas aldeias, valorizam nossa cultura e promovem desenvolvimento sustentável."
      />
      <PageSection>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Tile
            icon={<LayoutGrid className="size-5" />}
            title="Todos os Projetos"
            description="Veja todos os projetos desenvolvidos nas aldeias."
          />
          <Tile
            icon={<Sprout className="size-5" />}
            title="Em Andamento"
            description="Acompanhe iniciativas que estão em execução."
          />
          <Tile
            icon={<CircleCheck className="size-5" />}
            title="Concluídos"
            description="Conheça projetos já realizados com sucesso."
          />
          <Tile
            icon={<Folder className="size-5" />}
            title="Projetos"
            description="Detalhes completos de cada iniciativa."
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
          <FilterSelect label="Situação">
            <NativeSelectOption>Todas as situações</NativeSelectOption>
          </FilterSelect>
          <FilterSelect label="Área">
            <NativeSelectOption>Todas as áreas</NativeSelectOption>
          </FilterSelect>
        </FilterBar>
        <div className="grid gap-4 md:grid-cols-3">
          <SiteCard
            search="nascentes meio ambiente"
            meta="Meio ambiente"
            title="Proteção das Nascentes"
            description="Recuperação de nascentes e preservação dos recursos hídricos."
            hrefLabel="Ver detalhes"
          />
          <SiteCard
            search="formação jovens educação"
            meta="Educação"
            title="Formação de Jovens Líderes"
            description="Formação para liderança comunitária, cidadania e valorização cultural."
            hrefLabel="Ver detalhes"
          />
          <SiteCard
            search="artesanato renda cultura"
            meta="Cultura & renda"
            title="Artesanato Terena"
            description="Capacitação de artesãos e fortalecimento da produção."
            hrefLabel="Ver detalhes"
          />
        </div>
      </PageSection>
    </>
  );
}
