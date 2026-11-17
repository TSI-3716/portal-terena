import type { Metadata } from "next";
import { salvarConfiguracao } from "@/app/admin/configuracoes/actions";
import { AdminNotice } from "@/components/admin/admin-notice";
import { ResourceForm } from "@/components/admin/resource-form";
import { PageHeading } from "@/components/site-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type FormValues, toFormValue } from "@/lib/admin/fields";
import { requireUser } from "@/lib/auth";
import { CONFIGURACAO_CAMPOS } from "@/lib/configuracao";

export const metadata: Metadata = { title: "Configurações" };

const dataHora = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Campo_Grande",
});

export default async function ConfiguracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from("configuracao")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const row = (data ?? {}) as Record<string, unknown>;
  const initialValues: FormValues = {};
  for (const field of CONFIGURACAO_CAMPOS) {
    initialValues[field.name] = toFormValue(field, row[field.name]);
  }

  return (
    <>
      <PageHeading
        title="Configurações"
        description="Contatos e redes sociais exibidos no rodapé e na página de contato."
      />
      <div className="mt-6 space-y-4">
        <AdminNotice ok={ok} />
        {error || !data ? (
          <Alert variant="destructive" className="max-w-3xl">
            <AlertDescription>
              A tabela de configurações não foi encontrada. Rode a migration
              20261107120000_configuracao_e_auditoria.sql no Supabase.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {typeof row.atualizado_em === "string" ? (
              <p className="text-sm text-muted-foreground">
                Última alteração em {dataHora.format(new Date(row.atualizado_em))}.
              </p>
            ) : null}
            <ResourceForm
              action={salvarConfiguracao}
              fields={CONFIGURACAO_CAMPOS}
              initialValues={initialValues}
              options={{}}
              cancelHref="/admin"
            />
          </>
        )}
      </div>
    </>
  );
}
