import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { salvarRegistro } from "@/app/admin/[recurso]/actions";
import { ResourceForm } from "@/components/admin/resource-form";
import { PageHeading } from "@/components/site-layout";
import { loadReferenceOptions } from "@/lib/admin/repository";
import { getResource } from "@/lib/admin/resources";

type Props = { params: Promise<{ recurso: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { recurso } = await params;
  return { title: getResource(recurso)?.newLabel ?? "Novo cadastro" };
}

export default async function NovoRegistroPage({ params }: Props) {
  const { recurso } = await params;
  const resource = getResource(recurso);
  if (!resource) notFound();

  const options = await loadReferenceOptions(resource);

  return (
    <>
      <PageHeading title={resource.newLabel} />
      <div className="mt-6">
        <ResourceForm
          action={salvarRegistro.bind(null, resource.slug, null)}
          fields={resource.fields}
          initialValues={{}}
          options={options}
          cancelHref={`/admin/${resource.slug}`}
        />
      </div>
    </>
  );
}
