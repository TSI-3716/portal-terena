"use client";

import Link from "next/link";
import { useActionState } from "react";
import { excluirNoticia, salvarNoticia } from "@/app/admin/noticias/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import {
  Field,
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
import { noticiaStatusLabel, noticiaStatuses } from "@/lib/schemas";
import type { Noticia } from "@/lib/noticias";
import { getPublicAssetUrl } from "@/lib/storage";

export function NoticiaForm({ noticia }: { noticia?: Noticia }) {
  const [state, action, pending] = useActionState(salvarNoticia, null);

  return (
    <div className="max-w-2xl">
      <form action={action}>
        <input type="hidden" name="id_noticia" value={noticia?.id_noticia ?? ""} />
        <FieldGroup>
        <Field>
          <FieldLabel htmlFor="titulo">Título</FieldLabel>
          <Input
            id="titulo"
            name="titulo"
            defaultValue={noticia?.titulo}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="resumo">Resumo</FieldLabel>
          <Textarea
            id="resumo"
            name="resumo"
            defaultValue={noticia?.resumo}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="conteudo">Conteúdo</FieldLabel>
          <Textarea
            id="conteudo"
            name="conteudo"
            defaultValue={noticia?.conteudo}
            className="min-h-48"
            required
          />
        </Field>
        <ImageField
          currentUrl={
            noticia?.imagem ? getPublicAssetUrl(noticia.imagem) : null
          }
        />
        <Field>
          <FieldLabel htmlFor="data_publicacao">Data de publicação</FieldLabel>
          <Input
            id="data_publicacao"
            name="data_publicacao"
            type="date"
            defaultValue={noticia?.data_publicacao ?? today()}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <NativeSelect
            id="status"
            name="status"
            className="w-full"
            defaultValue={noticia?.status ?? "rascunho"}
          >
            {noticiaStatuses.map((status) => (
              <NativeSelectOption key={status} value={status}>
                {noticiaStatusLabel[status]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        {state?.error ? <FieldError>{state.error}</FieldError> : null}
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
