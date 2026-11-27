"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  type ConteudoFormState,
  type ConteudoFormValues,
  excluirConteudo,
  salvarConteudo,
} from "@/app/admin/conteudos/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { GaleriaField, type GaleriaItem } from "@/components/admin/galeria-field";
import { ImageField } from "@/components/admin/image-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { Option } from "@/lib/admin/fields";
import {
  conteudoSchema,
  fieldErrorsFrom,
  liveFieldErrors,
  noticiaStatusLabel,
  noticiaStatuses,
} from "@/lib/schemas";
import { secoes, type SecaoSlug } from "@/lib/secoes";

function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function ConteudoForm({
  secao,
  id,
  initial,
  categorias,
  aldeias,
  imageUrl,
  galeria = [],
}: {
  secao: SecaoSlug;
  id: number | null;
  initial?: Partial<ConteudoFormValues>;
  categorias: Option[];
  aldeias: Option[];
  imageUrl?: string | null;
  galeria?: GaleriaItem[];
}) {
  const [state, action, pending] = useActionState<ConteudoFormState, FormData>(
    salvarConteudo.bind(null, secao, id),
    null,
  );
  const [values, setValues] = useState<ConteudoFormValues>({
    titulo: initial?.titulo ?? "",
    id_tipo: initial?.id_tipo ?? (categorias.length === 1 ? categorias[0].value : ""),
    resumo: initial?.resumo ?? "",
    descricao: initial?.descricao ?? "",
    data_publicacao: initial?.data_publicacao?.slice(0, 10) || today(),
    status: initial?.status ?? "rascunho",
    fonte: initial?.fonte ?? "",
    id_aldeia: initial?.id_aldeia ?? "",
    destaque: initial?.destaque ?? false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function change<K extends keyof ConteudoFormValues>(name: K, value: ConteudoFormValues[K]) {
    setValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  }

  const parsed = conteudoSchema.safeParse(values);
  const allErrors = parsed.success ? {} : fieldErrorsFrom(parsed.error);
  const errors = liveFieldErrors(allErrors, touched, Boolean(state?.error));
  const general =
    state?.error && !Object.values(allErrors).includes(state.error) ? state.error : null;
  const admin = secoes[secao].admin;

  const text = (
    name: "titulo" | "fonte",
    label: string,
    opts: { maxLength: number; placeholder?: string; description?: string; required?: boolean },
  ) => (
    <Field data-invalid={Boolean(errors[name]) || undefined}>
      <FieldLabel htmlFor={name}>
        {label}
        {opts.required ? " *" : ""}
      </FieldLabel>
      <Input
        id={name}
        name={name}
        value={values[name]}
        maxLength={opts.maxLength}
        placeholder={opts.placeholder}
        aria-invalid={Boolean(errors[name])}
        onChange={(event) => change(name, event.target.value)}
      />
      {opts.description ? <FieldDescription>{opts.description}</FieldDescription> : null}
      {errors[name] ? <FieldError>{errors[name]}</FieldError> : null}
    </Field>
  );

  return (
    <div className="max-w-3xl">
      <form action={action} key={state?.attempt ?? 0}>
        <FieldGroup>
          {text("titulo", "Título", { maxLength: 200, required: true })}

          {categorias.length > 1 ? (
            <Field data-invalid={Boolean(errors.id_tipo) || undefined}>
              <FieldLabel htmlFor="id_tipo">Categoria *</FieldLabel>
              <NativeSelect
                id="id_tipo"
                name="id_tipo"
                className="w-full"
                value={values.id_tipo}
                aria-invalid={Boolean(errors.id_tipo)}
                onChange={(event) => change("id_tipo", event.target.value)}
              >
                <NativeSelectOption value="">Selecione...</NativeSelectOption>
                {categorias.map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              {errors.id_tipo ? <FieldError>{errors.id_tipo}</FieldError> : null}
            </Field>
          ) : (
            <input type="hidden" name="id_tipo" value={values.id_tipo} />
          )}

          <Field data-invalid={Boolean(errors.resumo) || undefined}>
            <FieldLabel htmlFor="resumo">Resumo *</FieldLabel>
            <Textarea
              id="resumo"
              name="resumo"
              value={values.resumo}
              className="min-h-20"
              aria-invalid={Boolean(errors.resumo)}
              onChange={(event) => change("resumo", event.target.value)}
            />
            <FieldDescription>Aparece nos cards e na busca (cortado no mesmo tamanho em todo o portal).</FieldDescription>
            {errors.resumo ? <FieldError>{errors.resumo}</FieldError> : null}
          </Field>

          <Field data-invalid={Boolean(errors.descricao) || undefined}>
            <FieldLabel htmlFor="descricao">Conteúdo completo *</FieldLabel>
            <Textarea
              id="descricao"
              name="descricao"
              value={values.descricao}
              className="min-h-56"
              aria-invalid={Boolean(errors.descricao)}
              onChange={(event) => change("descricao", event.target.value)}
            />
            {errors.descricao ? <FieldError>{errors.descricao}</FieldError> : null}
          </Field>

          <ImageField currentUrl={imageUrl} />
          <GaleriaField imagens={galeria} />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field data-invalid={Boolean(errors.data_publicacao) || undefined}>
              <FieldLabel htmlFor="data_publicacao">Data de publicação *</FieldLabel>
              <Input
                id="data_publicacao"
                name="data_publicacao"
                type="date"
                value={values.data_publicacao}
                aria-invalid={Boolean(errors.data_publicacao)}
                onChange={(event) => change("data_publicacao", event.target.value)}
              />
              {errors.data_publicacao ? <FieldError>{errors.data_publicacao}</FieldError> : null}
            </Field>
            <Field data-invalid={Boolean(errors.status) || undefined}>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <NativeSelect
                id="status"
                name="status"
                className="w-full"
                value={values.status}
                onChange={(event) => change("status", event.target.value)}
              >
                {noticiaStatuses.map((status) => (
                  <NativeSelectOption key={status} value={status}>
                    {noticiaStatusLabel[status]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field>
              <FieldLabel htmlFor="id_aldeia">Aldeia</FieldLabel>
              <NativeSelect
                id="id_aldeia"
                name="id_aldeia"
                className="w-full"
                value={values.id_aldeia}
                onChange={(event) => change("id_aldeia", event.target.value)}
              >
                <NativeSelectOption value="">Nenhuma (povo Terena)</NativeSelectOption>
                {aldeias.map((option) => (
                  <NativeSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>
            <Field orientation="horizontal" className="self-end">
              <Checkbox
                id="destaque"
                name="destaque"
                checked={values.destaque}
                onCheckedChange={(next) => change("destaque", next === true)}
              />
              <FieldLabel htmlFor="destaque" className="font-normal">
                Mostrar entre os destaques
              </FieldLabel>
            </Field>
          </div>

          {text("fonte", "Fonte", {
            maxLength: 500,
            placeholder: "https://... ou referência (livro, entrevista, ancião)",
            description: "Origem da informação: link ou referência em texto.",
          })}

          {general ? (
            <Alert variant="destructive">
              <AlertDescription>{general}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={admin}>Cancelar</Link>
            </Button>
          </div>
        </FieldGroup>
      </form>
      {id ? (
        <div className="mt-4">
          <ConfirmButton
            action={excluirConteudo.bind(null, secao, id)}
            message="Excluir este conteúdo? Essa ação não pode ser desfeita."
          >
            Excluir
          </ConfirmButton>
        </div>
      ) : null}
    </div>
  );
}
