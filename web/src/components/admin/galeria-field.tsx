"use client";

import { useState, type ChangeEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { optimizeImage } from "@/lib/image";

export type GaleriaItem = { id: number; url: string };

const MAX_ENVIO = 5;

/**
 * Imagens extras do cadastro (a "Imagem" principal continua sendo a capa).
 * As novas são otimizadas no navegador; as existentes podem ser marcadas
 * para remoção, que acontece ao salvar.
 */
export function GaleriaField({ imagens = [] }: { imagens?: GaleriaItem[] }) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [remover, setRemover] = useState<Record<number, boolean>>({});
  const [error, setError] = useState("");
  const [optimizing, setOptimizing] = useState(false);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    input.value = "";
    setError("");
    if (files.length > MAX_ENVIO) {
      setError(`Selecione no máximo ${MAX_ENVIO} imagens por vez.`);
      setPreviews([]);
      return;
    }

    setOptimizing(true);
    try {
      const data = new DataTransfer();
      const urls: string[] = [];
      for (const file of files) {
        const optimized = await optimizeImage(file);
        data.items.add(optimized);
        urls.push(URL.createObjectURL(optimized));
      }
      input.files = data.files;
      setPreviews((current) => {
        current.forEach((url) => URL.revokeObjectURL(url));
        return urls;
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível otimizar as imagens.");
    } finally {
      setOptimizing(false);
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor="galeria">Mais imagens (galeria)</FieldLabel>
      {imagens.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {imagens.map((imagem) => (
            <li key={imagem.id} className="space-y-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagem.url}
                alt=""
                className={`aspect-[4/3] w-full rounded-lg bg-muted object-contain ${
                  remover[imagem.id] ? "opacity-40" : ""
                }`}
              />
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox
                  name="galeria_remover"
                  value={String(imagem.id)}
                  checked={Boolean(remover[imagem.id])}
                  onCheckedChange={(next) =>
                    setRemover((current) => ({ ...current, [imagem.id]: next === true }))
                  }
                />
                Remover
              </label>
            </li>
          ))}
        </ul>
      ) : null}
      {previews.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {previews.map((url) => (
            <li key={url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="aspect-[4/3] w-full rounded-lg bg-muted object-contain" />
            </li>
          ))}
        </ul>
      ) : null}
      <Input
        id="galeria"
        name="galeria"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={onChange}
      />
      <FieldDescription>
        {optimizing
          ? "Otimizando as imagens..."
          : `Até ${MAX_ENVIO} imagens por vez. Elas aparecem abaixo do conteúdo no portal.`}
      </FieldDescription>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
