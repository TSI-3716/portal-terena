"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
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
import type {
  FieldDef,
  FormValues,
  Option,
  ResourceFormState,
} from "@/lib/admin/fields";
import { parseFormData } from "@/lib/admin/parse";
import { liveFieldErrors } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const inputTypes = {
  text: "text",
  email: "email",
  tel: "tel",
  date: "date",
  datetime: "datetime-local",
  money: "text",
} as const;

export function ResourceForm({
  action,
  fields,
  initialValues,
  options,
  imageUrl,
  cancelHref,
}: {
  action: (state: ResourceFormState, formData: FormData) => Promise<ResourceFormState>;
  fields: readonly FieldDef[];
  initialValues: FormValues;
  options: Record<string, Option[]>;
  imageUrl?: string | null;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const [local, setLocal] = useState<FormValues | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const values = local ?? state?.values ?? initialValues;

  function setField(name: string, value: string) {
    setLocal((current) => ({ ...(current ?? values), [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
  }

  const parsed = parseFormData(fields, toFormData(fields, values));
  const showAll = Boolean(state?.error);
  const errors = { ...liveFieldErrors(parsed.errors, touched, showAll) };
  if (showAll && state?.fieldErrors) {
    for (const field of fields) {
      if (field.type === "image" && state.fieldErrors[field.name]) {
        errors[field.name] = state.fieldErrors[field.name];
      }
    }
  }

  return (
    <form action={formAction} key={state?.attempt ?? 0} className="max-w-3xl">
      <FieldGroup className="gap-5 sm:grid sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name];
          const wide = field.wide || field.type === "textarea" || field.type === "image";
          const className = cn(wide && "sm:col-span-2");

          if (field.type === "image") {
            return (
              <div key={field.name} className={className}>
                <ImageField name={field.name} currentUrl={imageUrl} />
                {error ? <FieldError>{error}</FieldError> : null}
              </div>
            );
          }

          if (field.type === "boolean") {
            const checked =
              field.name in values ? values[field.name] === "on" : (field.defaultValue ?? false);
            return (
              <Field key={field.name} orientation="horizontal" className={className}>
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={checked}
                  onCheckedChange={(next) =>
                    setField(field.name, next === true ? "on" : "")
                  }
                />
                <FieldLabel htmlFor={field.name} className="font-normal">
                  {field.label}
                </FieldLabel>
              </Field>
            );
          }

          return (
            <Field
              key={field.name}
              className={className}
              data-invalid={Boolean(error) || undefined}
            >
              <FieldLabel htmlFor={field.name}>
                {field.label}
                {field.required ? " *" : ""}
              </FieldLabel>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  aria-invalid={Boolean(error)}
                  className={field.name === "conteudo" ? "min-h-56" : "min-h-24"}
                  onChange={(event) => setField(field.name, event.target.value)}
                />
              ) : field.type === "select" || field.type === "reference" ? (
                <NativeSelect
                  id={field.name}
                  name={field.name}
                  className="w-full"
                  value={values[field.name] ?? ""}
                  aria-invalid={Boolean(error)}
                  onChange={(event) => setField(field.name, event.target.value)}
                >
                  <NativeSelectOption value="">
                    {field.required ? "Selecione..." : "Nenhum"}
                  </NativeSelectOption>
                  {(field.type === "select" ? field.options : (options[field.name] ?? [])).map(
                    (option) => (
                      <NativeSelectOption key={option.value} value={option.value}>
                        {option.label}
                      </NativeSelectOption>
                    ),
                  )}
                </NativeSelect>
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={inputTypes[field.type]}
                  inputMode={field.type === "money" ? "decimal" : undefined}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  aria-invalid={Boolean(error)}
                  onChange={(event) => setField(field.name, event.target.value)}
                />
              )}
              {field.type === "reference" && (options[field.name] ?? []).length === 0 ? (
                <FieldDescription>
                  Nenhum registro cadastrado ainda. Cadastre antes de continuar.
                </FieldDescription>
              ) : field.description ? (
                <FieldDescription>{field.description}</FieldDescription>
              ) : null}
              {error ? <FieldError>{error}</FieldError> : null}
            </Field>
          );
        })}

        {state?.error &&
        !(
          state.error === "Verifique os campos destacados." &&
          Object.keys(parsed.errors).length === 0
        ) ? (
          <Alert variant="destructive" className="sm:col-span-2">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar"}
          </Button>
          <Button variant="outline" asChild>
            <Link href={cancelHref}>Cancelar</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

function toFormData(fields: readonly FieldDef[], values: FormValues) {
  const data = new FormData();
  for (const field of fields) {
    if (field.type === "image") continue;
    const value = values[field.name] ?? "";
    if (field.type === "boolean") {
      if (value === "on" || value === "true") data.set(field.name, "on");
      continue;
    }
    data.set(field.name, value);
  }
  return data;
}
