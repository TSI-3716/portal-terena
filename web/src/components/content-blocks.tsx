import type { ReactNode } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Bloco de texto com título opcional (".content-card" no HTML original). */
export function ContentCard({
  title,
  meta,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  meta?: string;
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={className}>
      {title || meta ? (
        <CardHeader>
          {meta ? (
            <p className="text-xs font-bold tracking-wide text-brown uppercase">
              {meta}
            </p>
          ) : null}
          {title ? (
            <CardTitle className="text-lg text-primary">{title}</CardTitle>
          ) : null}
        </CardHeader>
      ) : null}
      {children ? (
        <CardContent
          className={cn(
            "space-y-3 text-sm leading-relaxed text-muted-foreground",
            contentClassName
          )}
        >
          {children}
        </CardContent>
      ) : null}
    </Card>
  );
}

export type InfoItem = { label: string; value: ReactNode };

/** Lista "rótulo em destaque + valor" (".list-item" no HTML original). */
export function InfoList({ items }: { items: readonly InfoItem[] }) {
  return (
    <dl className="divide-y text-sm">
      {items.map((item, index) => (
        <div key={`${index}-${item.label}`} className="py-3 first:pt-0 last:pb-0">
          <dt className="mb-1 font-medium text-primary">{item.label}</dt>
          <dd className="text-muted-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Aviso com borda marrom à esquerda (".notice" no HTML original). */
export function Notice({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "my-4 border-l-4 border-brown bg-[#fbf6ef] px-[18px] py-[15px] text-sm leading-relaxed",
        className
      )}
    >
      {title ? <strong className="text-foreground">{title} </strong> : null}
      {children}
    </div>
  );
}

export type TimelineStep = { label: string; description: string };

export function Timeline({ steps }: { steps: readonly TimelineStep[] }) {
  return (
    <ol className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step) => (
        <li key={step.label}>
          <Card className="h-full">
            <CardContent className="space-y-1.5">
              <p className="text-xs font-extrabold tracking-wide text-brown uppercase">
                {step.label}
              </p>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ol>
  );
}

export type GalleryImage = { src: string; alt: string };

export function Gallery({ images }: { images: readonly GalleryImage[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {images.map((image) => (
        <a
          key={image.src}
          href={image.src}
          target="_blank"
          rel="noopener"
          className="relative block h-40 overflow-hidden rounded-[10px] border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
            className="object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none"
          />
        </a>
      ))}
    </div>
  );
}

/** Imagem larga com cantos arredondados, usada dentro de blocos de conteúdo. */
export function WideImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-[300px] w-full overflow-hidden rounded-[10px]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1152px) 100vw, 1152px"
        className="object-cover"
      />
    </div>
  );
}
