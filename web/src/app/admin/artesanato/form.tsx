"use client";

import Link from "next/link";
import { useActionState } from "react";
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

  return (
    <div className="max-w-2xl">
      <form action={action}>
        <input type="hidden" name="id_artesanato" value={artesanato?.id_artesanato ?? ""} />
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="nome">Nome</FieldLabel>
            <Input
              id="nome"
              name="nome"
              defaultValue={artesanato?.nome}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
            <Textarea
              id="descricao"
              name="descricao"
              defaultValue={artesanato?.descricao}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="categoria">Categoria</FieldLabel>
            <NativeSelect
              id="categoria"
              name="categoria"
              className="w-full"
              defaultValue={artesanato?.categoria ?? ""}
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
          </Field>
          <Field>
            <FieldLabel htmlFor="preco">Preço (R$)</FieldLabel>
            <Input
              id="preco"
              name="preco"
              type="number"
              min="0"
              step="0.01"
              defaultValue={artesanato?.preco}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="disponivel">Disponibilidade</FieldLabel>
            <NativeSelect
              id="disponivel"
              name="disponivel"
              className="w-full"
              defaultValue={artesanato ? String(artesanato.disponivel) : "true"}
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
          {state?.error ? <FieldError>{state.error}</FieldError> : null}
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
