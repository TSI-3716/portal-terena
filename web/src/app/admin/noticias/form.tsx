"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { excluirNoticia, salvarNoticia } from "@/app/admin/noticias/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { Noticia } from "@/lib/noticias";
import {
  fieldErrorsFrom,
  liveFieldErrors,
  noticiaSchema,
  noticiaStatusLabel,
  noticiaStatuses,
} from "@/lib/schemas";
import { getPublicAssetUrl } from "@/lib/storage";

export function NoticiaForm({
  noticia,
  aldeias,
}: {
  noticia?: Noticia & { id_aldeia?: number | string | null };
  aldeias: { id_aldeia: number; nome: string }[];
}) {
  const [state, action, pending] = useActionState(salvarNoticia, null);
  const [values, setValues] = useState({
    titulo: noticia?.titulo ?? "",
    resumo: noticia?.resumo ?? "",
    conteudo: noticia?.conteudo ?? "",
    data_publicacao: noticia?.data_publicacao ?? today(),
    status: noticia?.status ?? "rascunho",
    id_aldeia: noticia?.id_aldeia ? String(noticia.id_aldeia) : "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function change(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  }

  const parsed = noticiaSchema.safeParse(values);
  const allErrors = parsed.success ? {} : fieldErrorsFrom(parsed.error);
  const errors = liveFieldErrors(allErrors, touched, Boolean(state?.error));
  const attempt = state?.attempt ?? 0;
  const [trackedAttempt, setTrackedAttempt] = useState(0);
  const [serverIsField, setServerIsField] = useState(false);
  const serverIsFieldNow =
    attempt === trackedAttempt
      ? serverIsField
      : Boolean(state?.error && Object.values(allErrors).includes(state.error));
  if (attempt !== trackedAttempt) {
    setTrackedAttempt(attempt);
    setServerIsField(serverIsFieldNow);
  }
  const general = state?.error && !serverIsFieldNow ? state.error : null;

  return (
    <div className="max-w-2xl">
      <form action={action}>
        <input type="hidden" name="id_noticia" value={noticia?.id_noticia ?? ""} />
        <FieldGroup>
          <Field data-invalid={Boolean(errors.titulo) || undefined}>
            <FieldLabel htmlFor="titulo">Título</FieldLabel>
            <Input
              id="titulo"
              name="titulo"
              value={values.titulo}
              aria-invalid={Boolean(errors.titulo)}
              onChange={(event) => change("titulo", event.target.value)}
              required
            />
            {errors.titulo ? <FieldError>{errors.titulo}</FieldError> : null}
          </Field>
          <Field data-invalid={Boolean(errors.resumo) || undefined}>
            <FieldLabel htmlFor="resumo">Resumo</FieldLabel>
            <Textarea
              id="resumo"
              name="resumo"
              value={values.resumo}
              aria-invalid={Boolean(errors.resumo)}
              onChange={(event) => change("resumo", event.target.value)}
              required
            />
            {errors.resumo ? <FieldError>{errors.resumo}</FieldError> : null}
          </Field>
          <Field data-invalid={Boolean(errors.conteudo) || undefined}>
            <FieldLabel htmlFor="conteudo">Conteúdo</FieldLabel>
            <Textarea
              id="conteudo"
              name="conteudo"
              value={values.conteudo}
              className="min-h-48"
              aria-invalid={Boolean(errors.conteudo)}
              onChange={(event) => change("conteudo", event.target.value)}
              required
            />
            {errors.conteudo ? <FieldError>{errors.conteudo}</FieldError> : null}
          </Field>
          <ImageField
            currentUrl={
              noticia?.imagem ? getPublicAssetUrl(noticia.imagem) : null
            }
          />
          <Field data-invalid={Boolean(errors.data_publicacao) || undefined}>
            <FieldLabel htmlFor="data_publicacao">Data de publicação</FieldLabel>
            <Input
              id="data_publicacao"
              name="data_publicacao"
              type="date"
              value={values.data_publicacao}
              aria-invalid={Boolean(errors.data_publicacao)}
              onChange={(event) => change("data_publicacao", event.target.value)}
              required
            />
            {errors.data_publicacao ? (
              <FieldError>{errors.data_publicacao}</FieldError>
            ) : null}
          </Field>
          <Field data-invalid={Boolean(errors.id_aldeia) || undefined}>
            <FieldLabel htmlFor="id_aldeia">Aldeia</FieldLabel>
            <NativeSelect
              id="id_aldeia"
              name="id_aldeia"
              className="w-full"
              value={values.id_aldeia}
              aria-invalid={Boolean(errors.id_aldeia)}
              onChange={(event) => change("id_aldeia", event.target.value)}
            >
              <NativeSelectOption value="">Selecione a aldeia</NativeSelectOption>
              {aldeias.map((aldeia) => (
                <NativeSelectOption key={aldeia.id_aldeia} value={String(aldeia.id_aldeia)}>
                  {aldeia.nome}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {aldeias.length === 0 ? (
              <FieldDescription>Nenhuma aldeia cadastrada ainda.</FieldDescription>
            ) : null}
            {errors.id_aldeia ? <FieldError>{errors.id_aldeia}</FieldError> : null}
          </Field>
          <Field data-invalid={Boolean(errors.status) || undefined}>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <NativeSelect
              id="status"
              name="status"
              className="w-full"
              value={values.status}
              aria-invalid={Boolean(errors.status)}
              onChange={(event) => change("status", event.target.value)}
            >
              {noticiaStatuses.map((status) => (
                <NativeSelectOption key={status} value={status}>
                  {noticiaStatusLabel[status]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {errors.status ? <FieldError>{errors.status}</FieldError> : null}
          </Field>
          {general ? <FieldError>{general}</FieldError> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/noticias">Cancelar</Link>
            </Button>
          </div>
        </FieldGroup>
      </form>
      {noticia ? (
        <div className="mt-2">
          <ConfirmButton
            action={excluirNoticia.bind(null, noticia.id_noticia)}
            message="Excluir esta notícia?"
          >
            Excluir
          </ConfirmButton>
        </div>
      ) : null}
    </div>
  );
}

function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
