import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/site-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listRows } from "@/lib/admin/repository";
import { getResource } from "@/lib/admin/resources";

type Props = { params: Promise<{ recurso: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recurso } = await params;
  return { title: getResource(recurso)?.title ?? "Administração" };
}

export default async function AdminRecursoPage({ params }: Props) {
  const { recurso } = await params;
  const resource = getResource(recurso);
  if (!resource) notFound();

  const rows = await listRows(resource);

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading title={resource.title} />
        <Button asChild>
          <Link href={`/admin/${resource.slug}/novo`}>{resource.newLabel}</Link>
        </Button>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nada cadastrado ainda. Use “{resource.newLabel}” para começar.
        </p>
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border">
          {rows.map((row) => {
            const id = String(row[resource.idColumn]);
            const secondary = resource.secondary?.(row);
            const badge = resource.badge?.(row);
            const publicHref = resource.publicHref?.(row);

            return (
              <li
                key={id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-primary">{resource.primary(row)}</p>
                  {secondary ? (
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {secondary}
                    </p>
                  ) : null}
                </div>
                {badge ? (
                  <Badge variant={badge.highlight ? "default" : "secondary"}>
                    {badge.label}
                  </Badge>
                ) : null}
                <div className="flex gap-2">
                  {publicHref ? (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={publicHref}>Ver no portal</Link>
                    </Button>
                  ) : null}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/${resource.slug}/${id}`}>Editar</Link>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
