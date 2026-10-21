"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { excluirArtesanato, salvarArtesanato } from "@/app/admin/artesanato/actions";
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
import type { Artesanato } from "@/lib/artesanato";
import { artesanatoSchema, fieldErrorsFrom, liveFieldErrors } from "@/lib/schemas";
import { getPublicAssetUrl } from "@/lib/storage";

const categorias = [
  "Cerâmica",
  "Tecido",
  "Madeira",
  "Trançado",
  "Pintura",
  "Bijuteria",
  "Outro",
] as const;

export function ArtesanatoForm({ artesanato }: { artesanato?: Artesanato }) {
  const [state, action, pending] = useActionState(salvarArtesanato, null);
  const [values, setValues] = useState({
    nome: artesanato?.nome ?? "",
    descricao: artesanato?.descricao ?? "",
    categoria: artesanato?.categoria ?? "",
    preco: artesanato?.preco != null ? String(artesanato.preco) : "",
    disponivel: artesanato ? String(artesanato.disponivel) : "true",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function change(name: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  }

  const parsed = artesanatoSchema.safeParse({
    ...values,
    disponivel: values.disponivel === "true",
  });
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
        <input type="hidden" name="id_artesanato" value={artesanato?.id_artesanato ?? ""} />
        <FieldGroup>
          <Field data-invalid={Boolean(errors.nome) || undefined}>
            <FieldLabel htmlFor="nome">Nome</FieldLabel>
            <Input
              id="nome"
              name="nome"
              value={values.nome}
              aria-invalid={Boolean(errors.nome)}
              onChange={(event) => change("nome", event.target.value)}
              required
            />
            {errors.nome ? <FieldError>{errors.nome}</FieldError> : null}
          </Field>
          <Field data-invalid={Boolean(errors.descricao) || undefined}>
            <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
            <Textarea
              id="descricao"
              name="descricao"
              value={values.descricao}
              aria-invalid={Boolean(errors.descricao)}
              onChange={(event) => change("descricao", event.target.value)}
              required
            />
            {errors.descricao ? <FieldError>{errors.descricao}</FieldError> : null}
          </Field>
          <Field data-invalid={Boolean(errors.categoria) || undefined}>
            <FieldLabel htmlFor="categoria">Categoria</FieldLabel>
            <NativeSelect
              id="categoria"
              name="categoria"
              className="w-full"
              value={values.categoria}
              aria-invalid={Boolean(errors.categoria)}
              onChange={(event) => change("categoria", event.target.value)}
            >
              <NativeSelectOption value="" disabled>
                Selecione uma categoria
              </NativeSelectOption>
              {categorias.map((cat) => (
                <NativeSelectOption key={cat} value={cat}>
                  {cat}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            {errors.categoria ? <FieldError>{errors.categoria}</FieldError> : null}
          </Field>
          <Field data-invalid={Boolean(errors.preco) || undefined}>
            <FieldLabel htmlFor="preco">Preço (R$)</FieldLabel>
            <Input
              id="preco"
              name="preco"
              type="number"
              min="0"
              step="0.01"
              value={values.preco}
              aria-invalid={Boolean(errors.preco)}
              onChange={(event) => change("preco", event.target.value)}
              required
            />
            {errors.preco ? <FieldError>{errors.preco}</FieldError> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor="disponivel">Disponibilidade</FieldLabel>
            <NativeSelect
              id="disponivel"
              name="disponivel"
              className="w-full"
              value={values.disponivel}
              onChange={(event) => change("disponivel", event.target.value)}
            >
              <NativeSelectOption value="true">Disponível</NativeSelectOption>
              <NativeSelectOption value="false">Indisponível</NativeSelectOption>
            </NativeSelect>
          </Field>
          <ImageField
            currentUrl={
              artesanato?.imagem ? getPublicAssetUrl(artesanato.imagem) : null
            }
          />
          {general ? <FieldError>{general}</FieldError> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/artesanato">Cancelar</Link>
            </Button>
          </div>
        </FieldGroup>
      </form>
      {artesanato ? (
        <div className="mt-2">
          <ConfirmButton
            action={excluirArtesanato.bind(null, artesanato.id_artesanato)}
            message="Excluir este artesanato?"
          >
            Excluir
          </ConfirmButton>
        </div>
      ) : null}
    </div>
  );
}
