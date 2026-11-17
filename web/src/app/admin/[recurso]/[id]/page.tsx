import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { excluirRegistro, salvarRegistro } from "@/app/admin/[recurso]/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ResourceForm } from "@/components/admin/resource-form";
import { PageHeading } from "@/components/site-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { type FormValues, toFormValue } from "@/lib/admin/fields";
import { getRow, loadReferenceOptions } from "@/lib/admin/repository";
import { getResource, parseId } from "@/lib/admin/resources";
import { resolveImageUrl } from "@/lib/storage";

type Props = {
  params: Promise<{ recurso: string; id: string }>;
  searchParams: Promise<{ erro?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recurso } = await params;
  return { title: getResource(recurso)?.editLabel ?? "Editar" };
}

export default async function EditarRegistroPage({ params, searchParams }: Props) {
  const { recurso, id: rawId } = await params;
  const { erro } = await searchParams;
  const resource = getResource(recurso);
  const id = parseId(rawId);
  if (!resource || !id) notFound();

  const [row, options] = await Promise.all([
    getRow(resource, id),
    loadReferenceOptions(resource),
  ]);
  if (!row) notFound();

  const initialValues: FormValues = {};
  for (const field of resource.fields) {
    if (field.type !== "image") {
      initialValues[field.name] = toFormValue(field, row[field.name]);
    }
  }
  const imageField = resource.fields.find((field) => field.type === "image");
  const imageValue = imageField ? row[imageField.name] : null;
  const publicHref = resource.publicHref?.(row);

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <PageHeading title={resource.editLabel} description={resource.primary(row)} />
        {publicHref ? (
          <Button variant="outline" asChild>
            <Link href={publicHref}>Ver no portal</Link>
          </Button>
        ) : null}
      </div>

      {erro ? (
        <Alert variant="destructive" className="mb-6 max-w-3xl">
          <AlertDescription>
            {erro === "em-uso"
              ? (resource.inUseMessage ??
                "Este registro está vinculado a outros cadastros e não pode ser excluído.")
              : "Não foi possível excluir. Tente novamente."}
          </AlertDescription>
        </Alert>
      ) : null}

      <ResourceForm
        action={salvarRegistro.bind(null, resource.slug, id)}
        fields={resource.fields}
        initialValues={initialValues}
        options={options}
        imageUrl={typeof imageValue === "string" ? resolveImageUrl(imageValue) : null}
        cancelHref={`/admin/${resource.slug}`}
      />
      <div className="mt-4">
        <ConfirmButton
          action={excluirRegistro.bind(null, resource.slug, id)}
          message="Excluir este registro? Essa ação não pode ser desfeita."
        >
          Excluir
        </ConfirmButton>
      </div>
    </>
  );
}
