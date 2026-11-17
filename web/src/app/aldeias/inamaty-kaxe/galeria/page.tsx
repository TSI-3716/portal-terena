import type { Metadata } from "next";
import { Gallery, Notice } from "@/components/content-blocks";
import { PageHeading, PageSection } from "@/components/site-layout";
import { type ImageName, staticImage } from "@/lib/images";

export const metadata: Metadata = { title: "Galeria | Inamaty Kaxé" };

const fotos: { name: ImageName; alt: string }[] = [
  { name: "home_hero", alt: "Paisagem do território Terena" },
  { name: "cultura_1", alt: "Registro cultural da comunidade" },
  { name: "cultura_2", alt: "Dança tradicional" },
  { name: "cultura_3", alt: "Saberes e tradições" },
  { name: "juventude_1", alt: "Encontro da juventude" },
  { name: "juventude_2", alt: "Atividade com jovens" },
  { name: "feira_1", alt: "Artesanato da comunidade" },
  { name: "feira_2", alt: "Peças artesanais" },
  { name: "noticias_1", alt: "Atividade na escola da aldeia" },
  { name: "noticias_2", alt: "Roda de conversa" },
  { name: "projetos_1", alt: "Projeto comunitário" },
  { name: "projetos_2", alt: "Formação de jovens" },
];

export default function InamatyGaleriaPage() {
  return (
    <>
      <PageHeading
        title="Galeria da Inamaty Kaxé"
        description="Imagens que ajudam a contar a história da comunidade."
      />
      <PageSection contained={false} className="pt-4">
        <Gallery
          images={fotos.map((foto) => ({
            src: staticImage(foto.name),
            alt: foto.alt,
          }))}
        />
        <Notice>
          As fotografias da comunidade devem ser publicadas somente com
          autorização e identificação adequada das pessoas e atividades.
        </Notice>
      </PageSection>
    </>
  );
}
