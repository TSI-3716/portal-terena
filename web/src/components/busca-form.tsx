import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

type Filtro = {
  param: string;
  label: string;
  value?: string;
  allLabel: string;
  options: readonly { value: string; label: string }[];
};

/**
 * Busca + filtro opcional por GET (a página lê os parâmetros no servidor).
 * Funciona sem JavaScript e o resultado pode ser compartilhado pelo link.
 */
export function BuscaForm({
  action,
  q = "",
  label = "Buscar",
  placeholder = "Palavra-chave",
  filtro,
}: {
  action: string;
  q?: string;
  label?: string;
  placeholder?: string;
  filtro?: Filtro;
}) {
  const ativo = Boolean(q || filtro?.value);

  return (
    <form
      action={action}
      role="search"
      className="mb-6 grid gap-3 rounded-xl border bg-background p-4 sm:grid-cols-[1fr_auto] lg:grid-cols-[2fr_1fr_auto]"
    >
      <Field>
        <FieldLabel htmlFor="busca-q">{label}</FieldLabel>
        <Input id="busca-q" name="q" type="search" defaultValue={q} placeholder={placeholder} />
      </Field>
      {filtro ? (
        <Field>
          <FieldLabel htmlFor={`busca-${filtro.param}`}>{filtro.label}</FieldLabel>
          <NativeSelect
            id={`busca-${filtro.param}`}
            name={filtro.param}
            className="w-full"
            defaultValue={filtro.value ?? ""}
          >
            <NativeSelectOption value="">{filtro.allLabel}</NativeSelectOption>
            {filtro.options.map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      ) : null}
      <div className="flex items-end gap-2">
        <Button type="submit">Buscar</Button>
        {ativo ? (
          <Button variant="ghost" asChild>
            <Link href={action}>Limpar</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
