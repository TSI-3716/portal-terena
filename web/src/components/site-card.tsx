import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resumir } from "@/lib/text";

/**
 * Card padrão do portal (notícias, cultura, juventude, projetos, eventos,
 * artesanato). Mesma altura de imagem, título em até 2 linhas e resumo com o
 * mesmo limite de caracteres em todo o site; o texto salvo não é alterado.
 */
export function SiteCard({
  title,
  description,
  href,
  hrefLabel = "Leia mais…",
  meta,
  search,
  imageSrc,
  imageAlt = "",
  details,
}: {
  title: string;
  description?: string | null;
  href?: string;
  hrefLabel?: string;
  meta?: string;
  search?: string;
  imageSrc?: string;
  imageAlt?: string;
  details?: ReactNode;
}) {
  const resumo = resumir(description);
  const titulo = href ? (
    <Link href={href} className="hover:underline underline-offset-4">
      {title}
    </Link>
  ) : (
    title
  );

  return (
    <Card className="h-full gap-4 overflow-hidden pt-0" data-search={search}>
      {imageSrc ? (
        <div className="relative aspect-[16/10] w-full shrink-0 bg-muted">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 380px"
            className="object-cover object-[center_30%]"
          />
        </div>
      ) : (
        <MediaPlaceholder className="aspect-[16/10] h-auto shrink-0" />
      )}
      <CardHeader className="gap-2">
        {meta ? (
          <Badge variant="secondary" className="max-w-full truncate">
            {meta}
          </Badge>
        ) : null}
        <CardTitle className="line-clamp-2 leading-snug text-primary">{titulo}</CardTitle>
        {resumo ? (
          <CardDescription className="line-clamp-3">{resumo}</CardDescription>
        ) : null}
      </CardHeader>
      {details ? (
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          {details}
        </CardContent>
      ) : null}
      {href ? (
        <CardFooter className="mt-auto">
          <Link
            href={href}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {hrefLabel}
            <span className="sr-only"> sobre {title}</span>
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  );
}

/** Grade padrão de cards. */
export function CardGrid({
  children,
  columns = 3,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}) {
  const cols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 xl:grid-cols-3";
  return <div className={`grid gap-4 ${cols}`}>{children}</div>;
}
