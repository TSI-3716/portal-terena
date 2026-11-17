import type { Option } from "@/lib/admin/fields";
import type { ResourceDef, Row } from "@/lib/admin/resources";
import { requireUser } from "@/lib/auth";

export async function listRows(resource: ResourceDef) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from(resource.table)
    .select(resource.listSelect ?? "*")
    .order(resource.orderBy.column, {
      ascending: resource.orderBy.ascending ?? true,
      nullsFirst: false,
    });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Row[];
}

export async function getRow(resource: ResourceDef, id: number) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from(resource.table)
    .select("*")
    .eq(resource.idColumn, id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Row | null;
}

/** Carrega as opções dos campos que apontam para outra tabela (chaves estrangeiras). */
export async function loadReferenceOptions(resource: ResourceDef) {
  const { supabase } = await requireUser();
  const options: Record<string, Option[]> = {};

  await Promise.all(
    resource.fields.map(async (field) => {
      if (field.type !== "reference") return;
      const { data, error } = await supabase
        .from(field.table)
        .select(`${field.valueColumn}, ${field.labelColumn}`)
        .order(field.labelColumn);

      if (error) throw new Error(error.message);
      options[field.name] = ((data ?? []) as unknown as Row[]).map((row) => ({
        value: String(row[field.valueColumn]),
        label: String(row[field.labelColumn]),
      }));
    }),
  );

  return options;
}
