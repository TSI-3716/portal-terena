import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ImagemGaleria } from "@/lib/galeria";
import { fonteHref } from "@/lib/text";

/** Valor da fonte: URL vira link externo; texto aparece como está. */
export function FonteValor({ fonte }: { fonte: string }) {
  const value = fonte.trim();
  const href = fonteHref(value);
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="break-all text-primary underline underline-offset-4"
    >
      {value}
    </a>
  ) : (
    <>{value}</>
  );
}

export function Fonte({ fonte }: { fonte?: string | null }) {
  if (!fonte?.trim()) return null;
  return (
    <p className="text-sm text-muted-foreground">
      <strong className="text-primary">Fonte:</strong> <FonteValor fonte={fonte} />
    </p>
  );
}

/** Imagens extras do registro, sem corte. */
export function GaleriaPublica({ imagens, titulo }: { imagens: ImagemGaleria[]; titulo: string }) {
  if (imagens.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="font-heading text-xl font-semibold text-primary">Galeria</h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {imagens.map((imagem, index) => (
          <li key={imagem.id}>
            <a href={imagem.url} target="_blank" rel="noopener noreferrer" className="block">
              <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={imagem.url}
                  alt={imagem.legenda ?? `${titulo} — imagem ${index + 2}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 360px"
                  className="object-contain"
                />
              </span>
            </a>
            {imagem.legenda ? (
              <p className="mt-1 text-xs text-muted-foreground">{imagem.legenda}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Página de detalhe padrão (notícia, cultura, juventude, projeto, evento,
 * artesanato): título e dados no topo, imagem inteira (sem texto por cima e
 * sem corte), texto completo, galeria, fonte e link de volta.
 */
export function ConteudoDetalhe({
  categoria,
  titulo,
  resumo,
  meta,
  imagem,
  info,
  children,
  galeria = [],
  fonte,
  voltar,
}: {
  categoria?: string;
  titulo: string;
  resumo?: string | null;
  meta?: ReactNode;
  imagem?: string;
  info?: ReactNode;
  children?: ReactNode;
  galeria?: ImagemGaleria[];
  fonte?: string | null;
  voltar: { href: string; label: string };
}) {
  return (
    <Container className="py-8">
      <article className="mx-auto max-w-3xl space-y-6">
        <Button variant="ghost" size="sm" asChild className="-ml-3">
          <Link href={voltar.href}>
            <ArrowLeft />
            {voltar.label}
          </Link>
        </Button>
        <header className="space-y-3">
          {categoria ? <Badge variant="secondary">{categoria}</Badge> : null}
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {titulo}
          </h1>
          {meta ? <div className="text-sm text-muted-foreground">{meta}</div> : null}
          {resumo ? <p className="text-lg leading-relaxed text-muted-foreground">{resumo}</p> : null}
        </header>
        {imagem ? (
          <figure className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
            <Image
              src={imagem}
              alt={titulo}
              fill
              preload
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain"
            />
          </figure>
        ) : null}
        {info ? <div className="rounded-xl border bg-muted/40 p-4 text-sm">{info}</div> : null}
        {children ? (
          <div className="whitespace-pre-wrap text-base leading-relaxed">{children}</div>
        ) : null}
        <GaleriaPublica imagens={galeria} titulo={titulo} />
        <Fonte fonte={fonte} />
        <Button variant="outline" asChild>
          <Link href={voltar.href}>{voltar.label}</Link>
        </Button>
      </article>
    </Container>
  );
}

/** Linha "Rótulo: valor" usada no bloco de informações do detalhe. */
export function InfoLinha({ label, children }: { label: string; children: ReactNode }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <p>
      <strong className="text-primary">{label}:</strong> {children}
    </p>
  );
}
