"use client";

import { useState, type ChangeEvent } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { optimizeImage } from "@/lib/image";

export function ImageField({
  name = "imagem",
  currentUrl,
}: {
  name?: string;
  currentUrl?: string | null;
}) {
  const [preview, setPreview] = useState(currentUrl ?? "");
  const [error, setError] = useState("");
  const [optimizing, setOptimizing] = useState(false);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    input.value = "";
    setOptimizing(true);
    setError("");

    try {
      const optimized = await optimizeImage(file);
      const data = new DataTransfer();
      data.items.add(optimized);
      input.files = data.files;
      setPreview((current) => {
        if (current.startsWith("blob:")) URL.revokeObjectURL(current);
        return URL.createObjectURL(optimized);
      });
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível otimizar a imagem.",
      );
    } finally {
      setOptimizing(false);
    }
  }

  return (
    <Field>
      <FieldLabel htmlFor={name}>Imagem</FieldLabel>
      {preview ? (
        // A prévia usa blob: depois da otimização no navegador.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="h-44 w-full rounded-lg object-cover"
        />
      ) : null}
      <Input
        id={name}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onChange}
      />
      <FieldDescription>
        {optimizing
          ? "Otimizando a imagem..."
          : "A foto é reduzida e convertida para WebP antes de ir para o Storage."}
      </FieldDescription>
      {error ? <FieldError>{error}</FieldError> : null}
    </Field>
  );
}
