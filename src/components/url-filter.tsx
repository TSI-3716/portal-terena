"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { Option } from "@/lib/admin/fields";

/** Select que aplica o filtro trocando o parâmetro da URL (lido pela página no servidor). */
export function UrlFilter({
  label,
  param,
  value,
  allLabel,
  options,
}: {
  label: string;
  param: string;
  value?: string;
  allLabel: string;
  options: readonly Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const id = `filtro-${param}`;

  return (
    <Field data-pending={pending || undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <NativeSelect
        id={id}
        className="w-full"
        value={value ?? ""}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value;
          const query = next ? `?${new URLSearchParams({ [param]: next })}` : "";
          startTransition(() => router.push(`${pathname}${query}`, { scroll: false }));
        }}
      >
        <NativeSelectOption value="">{allLabel}</NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </Field>
  );
}
