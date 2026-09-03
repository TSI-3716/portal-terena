import type { Metadata } from "next";
import { CalendarDays, Feather, Landmark, Languages, UsersRound } from "lucide-react";
import { Hero } from "@/components/hero";
import { SiteCard } from "@/components/site-card";
import { PageSection, SectionHeader } from "@/components/site-layout";
import { Tile } from "@/components/tile";

export const metadata: Metadata = { title: "Cultura Terena" };

export default function CulturaPage() {
  return (
    <>
      <Hero
        eyebrow="Memória • língua • tradições"
        title="Cultura Terena"
        description="Nossa cultura é viva e se fortalece a cada geração. Conheça memória, história, língua, tradições e calendário cultural."
      />
      <PageSection>
        <SectionHeader title="Navegue pela Cultura" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Tile
            icon={<UsersRound className="size-5" />}
            title="Memória Viva / Anciãos"
            description="Sabedoria e ensinamentos dos guardiões da memória Terena."
          />
          <Tile
            icon={<Landmark className="size-5" />}
            title="História Terena"
            description="Origens, trajetória e marcos históricos do povo Terena."
          />
          <Tile
            icon={<Languages className="size-5" />}
            title="Língua Terena"
            description="Palavras, expressões e fortalecimento da nossa língua."
          />
          <Tile
            icon={<Feather className="size-5" />}
            title="Tradições e Saberes"
            description="Costumes, rituais, danças, cantos e conhecimentos tradicionais."
          />
          <Tile
            icon={<CalendarDays className="size-5" />}
            title="Calendário Cultural"
            description="Eventos e celebrações que marcam o ciclo cultural Terena."
          />
        </div>
      </PageSection>
      <PageSection muted>
        <SectionHeader title="Destaques da Cultura" />
        <div className="grid gap-4 md:grid-cols-3">
          <SiteCard
            title="Ancião Kadiwéu"
            description="Guardião das histórias e da sabedoria do povo."
          />
          <SiteCard
            title="Dança do Bate-Pau"
            description="Expressão cultural que representa força, união e respeito."
          />
          <SiteCard
            title="Aprenda Terena"
            description="Palavras e expressões para fortalecer nossa língua."
          />
        </div>
      </PageSection>
    </>
  );
}
